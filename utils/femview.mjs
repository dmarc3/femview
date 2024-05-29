import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene
let scene = new THREE.Scene();
let group = new THREE.Group();

const canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// TODO: Add stuff to group
let color = 0xFFFFFF

// Points
var point_geometry = new THREE.BufferGeometry();
var grids = new Float32Array(REPLACE_NODES);
point_geometry.setAttribute('position', new THREE.BufferAttribute( grids, 3 ));
var point_material = new THREE.PointsMaterial( { color: color, size: 0, map: null} );
var points = new THREE.Points( point_geometry, point_material );
group.add(points)

// Faces
var face_geometry = new THREE.BufferGeometry();
var face_indices = REPLACE_FACES
const face_material = new THREE.MeshBasicMaterial( { color: color } );
face_material.transparent = true;
face_material.side = THREE.DoubleSide;
face_geometry.setIndex( face_indices );
face_geometry.setAttribute('position', new THREE.BufferAttribute( grids, 3));
const faces = new THREE.Mesh( face_geometry, face_material );
group.add(faces)

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

// Animation loop
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();

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