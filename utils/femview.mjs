import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Things to replace
let nodes = REPLACE_NODES;
let raw_faces = REPLACE_FACES;
let raw_wires = REPLACE_WIRES;
let raw_lines = REPLACE_LINES;

// Create scene
let scene = new THREE.Scene();
let group = new THREE.Group();

const canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.autoClear = false;
document.body.appendChild( renderer.domElement );

// TODO: Add stuff to group
let color = 0X91a16a

// Points
var point_geometry = new THREE.BufferGeometry();
var grids = new Float32Array(nodes);
point_geometry.setAttribute('position', new THREE.BufferAttribute( grids, 3 ));
var point_material = new THREE.PointsMaterial( { color: 0x000000, map: null} );
var points = new THREE.Points( point_geometry, point_material );
group.add(points)

// Faces
for (const [source, face_indices] of Object.entries(raw_faces)) {
    var face_geometry = new THREE.BufferGeometry();
    const face_material = new THREE.MeshPhongMaterial( { color: color } );
    face_material.transparent = true;
    face_material.side = THREE.DoubleSide;
    face_geometry.setIndex( face_indices );
    face_geometry.setAttribute('position', new THREE.BufferAttribute( grids, 3));
    const faces = new THREE.Mesh( face_geometry, face_material );
    faces.name = source;
    group.add(faces)
}
// Wires
for (const [source, wire_indices] of Object.entries(raw_wires)) {
    var wire_geometry = new THREE.BufferGeometry();
    var wire_material = new THREE.LineBasicMaterial( {color: 0x000000} );
    wire_geometry.setAttribute('position', new THREE.BufferAttribute( grids, 3));
    wire_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(wire_indices), 1));
    var wires = new THREE.LineSegments(wire_geometry, wire_material);
    wires.name = source;
    group.add(wires)
}

// Lines
for (const [source, line_indices] of Object.entries(raw_lines)) {
    var line_geometry = new THREE.BufferGeometry();
    var line_material = new THREE.LineBasicMaterial( {color: color, linewidth: 10} );
    line_material.transparent = true;
    line_geometry.setAttribute('position', new THREE.BufferAttribute( grids, 3));
    line_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(line_indices), 1));
    var lines = new THREE.LineSegments(line_geometry, line_material);
    lines.name = source;
    group.add(lines)
}

// Add to scene
scene.add(group)

// Camera
const bbox = new THREE.Box3().setFromObject( group );
var size = bbox.getSize( new THREE.Vector3() );
let aspect = window.innerHeight / window.innerWidth;
let frustumSize = size.length() * 2;
let camera = new THREE.OrthographicCamera( -frustumSize / 2, frustumSize / 2, frustumSize*aspect / 2, -frustumSize*aspect / 2, 0.1, frustumSize*5 );
camera.position.set( -frustumSize, frustumSize, frustumSize );
// camera.lookAt( bbox.getCenter( new THREE.Vector3() ) );

// Controls
let controls = new OrbitControls( camera, renderer.domElement );

// lights
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
scene.add( ambientLight );
var pointLight = new THREE.PointLight( 0xffffff, 0.9 );
camera.add( pointLight );

// Resize event loop
// const canvas = document.getElementById( "body" );
function getWidth() {
    return parseInt( window.getComputedStyle(canvas).width );
}
function getHeight() {
    return parseInt( window.getComputedStyle(canvas).height );
}
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    camera.aspect = getWidth() / getHeight();
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// ViewHelper
let clock = new THREE.Clock();
let view = new ViewHelper( camera, renderer.domElement );
// view.controls = controls;
view.center = controls.target;
const div = document.createElement( 'div' );
div.id = 'viewHelper';
div.style.position = 'absolute';
div.style.right = 0;
div.style.bottom = 0;
div.style.height = '128px';
div.style.width = '128px';
document.body.appendChild( div );
div.addEventListener( 'pointerup', (event) => view.handleClick( event ) );


// Terminal stuff
import {Termino} from 'https://cdn.jsdelivr.net/gh/MarketingPipeline/Termino.js@v1.0.0/dist/termino.min.js';
import ansiUp from "https://cdn.skypack.dev/ansi_up@5.1.0";
let ansi_up = new ansiUp();
let term = Termino(document.getElementById("terminal"))
const output = "\x1b[38;5;186m"
const invalid = "\x1b[38;5;167m"

async function terminalFunc() {
    // call the terminal for initial input
    let terminal_msg = await term.input("")

    if (terminal_msg == "help") {
        term.output(ansi_up.ansi_to_html(output+`List of all functions:
        clear → clears the terminal output
        test  → confirms terminal is working!`))
    } else if (terminal_msg.startsWith("rotate")) {
        terminal_msg = terminal_msg.split(" ")
        const dir = terminal_msg[1].toLowerCase()
        const deg = parseFloat(terminal_msg[2])
        // TODO: Figure out how to rotate view helper too
        if (dir == 'z') {
            group.rotation.y = Math.PI/180 * deg
        } else if (dir == 'y') {
            group.rotation.z = Math.PI/180 * deg
        } else if (dir == 'x') {
            group.rotation.x = Math.PI/180 * deg
        }
        term.output(ansi_up.ansi_to_html(output+`Rotated ${deg.toString()} degrees about +${dir}`))
    } else if (terminal_msg == "test") {
        term.output(ansi_up.ansi_to_html(output+"It's working!"))
    } else if (terminal_msg == "clear") {
        term.clear()
        term.output("List all function available by typing 'help'")
    } else if (!terminal_msg) {
        term.output("")
    } else {
        term.output(ansi_up.ansi_to_html(invalid+"Invalid command. Type 'help' for valid commands."))
    }
    // after called  - repeat function again
    terminalFunc();
}
terminalFunc();

// Animation loop
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    const delta = clock.getDelta();
    if ( view.animating ) view.update( delta );
    view.render( renderer );
}
animate();