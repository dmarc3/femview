import h5wasm  from "h5wasm/node";
await h5wasm.ready;

const dim = {
    // 1D elements
    "CROD": "1D",
    "CBAR": "1D",
    "CBEAM": "1D",
    "CBEND": "1D",
    "CBUSH": "1D",
    "CGAP": "1D",
    "CMARKB2": "1D",
    "CSPR": "1D",
    "CTUBE": "1D",
    "CVISC": "1D",
    "CDAMP1": "1D",
    "CDAMP2": "1D",
    "CDAMP5": "1D",
    "CELAS1": "1D",
    "CELAS2": "1D",
    "CMASS1": "1D",
    "CMASS2": "1D",
    "CONROD": "1D",
    // 2D elements - TRI
    "CTRIA": "2D_TRI",
    "CACINF3": "2D_TRI",
    // 2D elements - QUAD
    "CQUAD4": "2D_QUAD",
    "CQUADR": "2D_QUAD",
    "CSHEAR": "2D_QUAD",
    "CACINF4": "2D_QUAD",
    "CIFQUAD": "2D_QUAD",
    // 3D elements - TETRA
    "CTETRA": "3D_TET",
    // 3D elements - PYRAMID
    "CPYRAM": "3D_PYR",
    // 3D elements - PENTA
    "CPENTA": "3D_PEN",
    "CIFPENT": "3D_PEN",
    // 3D elements - HEXA
    "CHEXA": "3D_HEX",
    "CHACAB": "3D_HEX",
    "CHACBR": "3D_HEX",
    "CIFHEX": "3D_HEX",
}

function femview(filename) {
    let f = new h5wasm.File(filename, "r");
    
    var grids = f.get('/NASTRAN/INPUT/NODE/GRID');
    var elements = f.get('/NASTRAN/INPUT/ELEMENT');
    var coords = f.get('/NASTRAN/INPUT/COORDINATE_SYSTEM');
    
    
    // Collect GRID information TODO: Add logic for coordinate transformation to global
    var model = {}
    model['GRID'] = {}
    grids.value.forEach((item) => model['GRID'][item[0]] = item[2]);
    
    model['ELEMENT'] = {}
    for (const type of elements.keys()) {
        if (type in dim) {
            if (dim[type] in model["ELEMENT"]) {
                console.log("Skipping %s...", type)
            } else {
                model["ELEMENT"][dim[type]] = process_grids(elements.get(type))
            }
        }
    }
}

function process_grids(data) {
    var out = []
    var fields = []
    data.dtype.compound_type.members.forEach((member) => fields.push(member['name']))
    if (fields.indexOf("GA") > -1) {
        data.value.forEach((element) => out.push([parseInt(element[fields.indexOf("GA")]), parseInt(element[fields.indexOf("GB")])]))
    } else if (fields.indexOf("G1") > -1) {
        data.value.forEach((element) => out.push([parseInt(element[fields.indexOf("G1")]), parseInt(element[fields.indexOf("G2")])]))
    } else if (fields.indexOf("G") > -1) {
        data.value.forEach((element) => out.push(element[fields.indexOf("G")]))
    }
    return out
}

femview("bwb_saero.h5")