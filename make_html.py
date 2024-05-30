import os
import ipdb
# File to simply update index.html with code from femview.mjs
with open(os.path.join('utils', 'template.html'), 'r') as f:
    content = f.read()
with open(os.path.join('utils', 'femview.mjs'), 'r') as f:
    femview = f.read()
with open(os.path.join('utils', 'ViewHelper.js'), 'r') as f:
    viewhelper = f.read()

with open(os.path.join('utils', 'nodes.txt'), 'r') as f:
    nodes = f.read()
with open(os.path.join('utils', 'faces.txt'), 'r') as f:
    faces = f.read()
with open(os.path.join('utils', 'lines.txt'), 'r') as f:
    lines = f.read()

femview = femview.replace("REPLACE_NODES", nodes)
femview = femview.replace("REPLACE_FACES", faces)
femview = femview.replace("REPLACE_LINES", lines)
content = content.replace("REPLACE_FEMVIEW", femview)
content = content.replace("REPLACE_VIEWHELPER", viewhelper)
with open('index.html', 'w') as f:
    f.write(content)
