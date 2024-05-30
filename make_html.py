import os
import ipdb
# File to simply update index.html with code from femview.mjs
with open(os.path.join('utils', 'template.html'), 'r') as f:
    content = f.read()
with open(os.path.join('utils', 'femview.mjs'), 'r') as f:
    code = f.read()

with open(os.path.join('utils', 'nodes.txt'), 'r') as f:
    nodes = f.read()
with open(os.path.join('utils', 'faces.txt'), 'r') as f:
    faces = f.read()
with open(os.path.join('utils', 'lines.txt'), 'r') as f:
    lines = f.read()

code = code.replace("REPLACE_NODES", nodes)
code = code.replace("REPLACE_FACES", faces)
code = code.replace("REPLACE_LINES", lines)
content = content.replace("REPLACE_ME", code)
with open('index.html', 'w') as f:
    f.write(content)
