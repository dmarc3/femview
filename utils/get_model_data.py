''' Simple script to extract necessary geometry using pyNastran '''
from pyNastran.bdf.bdf import BDF
import ipdb

model = BDF()
model.read_bdf('../../pyNastran/models/iSat/ISat_Dploy_Sm.dat')

# Loop through nodes
nids = []
nodes = []
for nid, node in sorted(model.nodes.items()):
    nids.append(nid)
    xyz = node.get_position().tolist()
    # Swap Y and Z to account for three.js convention
    nodes.extend([xyz[0], xyz[2], xyz[1]])

def square(nids, nodes):
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
    lines = [
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
    return faces, lines

def tri(nids, nodes):
    faces = [
        # First tri
        nids.index(nodes[0]),
        nids.index(nodes[1]),
        nids.index(nodes[2]),
    ]
    lines = [
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
    return faces, lines

# Loop through elements
lines = []
faces = []
for eid, element in sorted(model.elements.items()):
    # CHEXAs
    if len(element.nodes) == 8:
        # Face 1
        out = square(nids, [element.nodes[0], element.nodes[1], element.nodes[2], element.nodes[3]])
        faces.extend(out[0])
        lines.extend(out[1])
        # Face 2
        out = square(nids, [element.nodes[4], element.nodes[5], element.nodes[6], element.nodes[7]])
        faces.extend(out[0])
        lines.extend(out[1])
        # Face 3
        out = square(nids, [element.nodes[0], element.nodes[1], element.nodes[5], element.nodes[4]])
        faces.extend(out[0])
        lines.extend(out[1])
        # Face 4
        out = square(nids, [element.nodes[1], element.nodes[5], element.nodes[6], element.nodes[2]])
        faces.extend(out[0])
        lines.extend(out[1])
        # Face 5
        out = square(nids, [element.nodes[2], element.nodes[6], element.nodes[7], element.nodes[3]])
        faces.extend(out[0])
        lines.extend(out[1])
        # Face 6
        out = square(nids, [element.nodes[0], element.nodes[4], element.nodes[7], element.nodes[3]])
        faces.extend(out[0])
        lines.extend(out[1])
    # CQUAD4s
    elif len(element.nodes) == 4:
        out = square(nids, element.nodes)
        faces.extend(out[0])
        lines.extend(out[1])
    # CTRIA3s
    elif len(element.nodes) == 3:
        out = tri(nids, element.nodes)
        faces.extend(out[0])
        lines.extend(out[1])
    # CBARs
    elif len(element.nodes) == 2:
        lines.extend([
            # First edge
            nids.index(element.nodes[0]),
            nids.index(element.nodes[1]),
        ])
    else:
        continue

# Write out to files
with open('nodes.txt', 'w') as f:
    f.write(str(nodes).replace(' ', ''))

with open('faces.txt', 'w') as f:
    f.write(str(faces).replace(' ', ''))

with open('lines.txt', 'w') as f:
    f.write(str(lines).replace(' ', ''))
