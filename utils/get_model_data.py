''' Simple script to extract necessary geometry using pyNastran '''
import itertools
from pyNastran.bdf.bdf import BDF
import ipdb

model = BDF()
model.read_bdf('../pyNastran/models/iSat/ISat_Dploy_Sm.dat')

# Loop through nodes
nids = []
nodes = []
for nid, node in sorted(model.nodes.items()):
    nids.append(nid)
    xyz = node.get_position().tolist()
    # Swap Y and Z to account for three.js convention
    nodes.extend([xyz[0], xyz[2], xyz[1]])


# Loop through elements
faces = []
for eid, element in sorted(model.elements.items()):
    if len(element.nodes) == 4:
        faces.append([
            nids.index(element.nodes[0]),
            nids.index(element.nodes[1]),
            nids.index(element.nodes[2]),
        ])
        faces.append([
            nids.index(element.nodes[0]),
            nids.index(element.nodes[2]),
            nids.index(element.nodes[3]),
        ])
    elif len(element.nodes) == 3:
        faces.append([
            nids.index(element.nodes[0]),
            nids.index(element.nodes[1]),
            nids.index(element.nodes[2]),
        ])
    else:
        continue

# Write out to files
with open('nodes.txt', 'w') as f:
    f.write(str(nodes).replace(' ', ''))

with open('faces.txt', 'w') as f:
    f.write(str(faces).replace(' ', ''))

