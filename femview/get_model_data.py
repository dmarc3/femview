"""Build THREE.js geometry using pyNastran"""
import os
from pyNastran.bdf.bdf import BDF

def get_model_data(filename: str) -> tuple[list, list, list, list]:
    model = BDF(debug=False)
    model.read_bdf(filename, save_file_structure=True)

    # Gather nodes in global coordinates
    nids = []
    nodes = []
    for nid, node in sorted(model.nodes.items()):
        nids.append(nid)
        xyz = node.get_position().tolist()
        # Swap Y and Z to account for three.js convention
        nodes.extend([xyz[0], xyz[2], xyz[1]])

    # Build three.js face / line indeces for each element
    lines = {}
    wires = {}
    faces = {}
    for eid, element in sorted(model.elements.items()):
        source = model.active_filenames[element.ifile]
        if element.ifile == 0:
            source = os.path.basename(source)
        # CHEXAs
        if len(element.nodes) == 8:
            if source not in faces:
                faces[source] = []
            if source not in wires:
                wires[source] = []
            # Face 1
            out = square(nids, [element.nodes[0], element.nodes[1], element.nodes[2], element.nodes[3]])
            faces[source].extend(out[0])
            wires[source].extend(out[1])
            # Face 2
            out = square(nids, [element.nodes[4], element.nodes[5], element.nodes[6], element.nodes[7]])
            faces[source].extend(out[0])
            wires[source].extend(out[1])
            # Face 3
            out = square(nids, [element.nodes[0], element.nodes[1], element.nodes[5], element.nodes[4]])
            faces[source].extend(out[0])
            wires[source].extend(out[1])
            # Face 4
            out = square(nids, [element.nodes[1], element.nodes[5], element.nodes[6], element.nodes[2]])
            faces[source].extend(out[0])
            wires[source].extend(out[1])
            # Face 5
            out = square(nids, [element.nodes[2], element.nodes[6], element.nodes[7], element.nodes[3]])
            faces[source].extend(out[0])
            wires[source].extend(out[1])
            # Face 6
            out = square(nids, [element.nodes[0], element.nodes[4], element.nodes[7], element.nodes[3]])
            faces[source].extend(out[0])
            wires[source].extend(out[1])
        # CQUAD4s
        elif len(element.nodes) == 4:
            if source not in faces:
                faces[source] = []
            if source not in wires:
                wires[source] = []
            out = square(nids, element.nodes)
            faces[source].extend(out[0])
            wires[source].extend(out[1])
        # CTRIA3s
        elif len(element.nodes) == 3:
            if source not in faces:
                faces[source] = []
            if source not in wires:
                wires[source] = []
            out = tri(nids, element.nodes)
            faces[source].extend(out[0])
            wires[source].extend(out[1])
        # CBARs
        elif len(element.nodes) == 2:
            if source not in lines:
                lines[source] = []
            lines[source].extend([
                # First edge
                nids.index(element.nodes[0]),
                nids.index(element.nodes[1]),
            ])
        else:
            continue

    return nodes, faces, wires, lines

def square(nids: list, nodes: list) -> tuple[dict, dict]:
    faces = [
        # First tri
        nids.index(nodes[0]),
        nids.index(nodes[1]),
        nids.index(nodes[2]),
        # Second tri
        nids.index(nodes[0]),
        nids.index(nodes[2]),
        nids.index(nodes[3]),
    ]
    wires = [
        # First edge
        nids.index(nodes[0]),
        nids.index(nodes[1]),
        # Second edge
        nids.index(nodes[1]),
        nids.index(nodes[2]),
        # Third edge
        nids.index(nodes[2]),
        nids.index(nodes[3]),
        # Fourth edge
        nids.index(nodes[3]),
        nids.index(nodes[0]),
    ]
    return faces, wires

def tri(nids: list, nodes: list) -> tuple[dict, dict]:
    faces = [
        # First tri
        nids.index(nodes[0]),
        nids.index(nodes[1]),
        nids.index(nodes[2]),
    ]
    wires = [
        # First edge
        nids.index(nodes[0]),
        nids.index(nodes[1]),
        # Second edge
        nids.index(nodes[1]),
        nids.index(nodes[2]),
        # Third edge
        nids.index(nodes[2]),
        nids.index(nodes[0]),
    ]
    return faces, wires
