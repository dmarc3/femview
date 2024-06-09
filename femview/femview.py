import os
import webbrowser
from femview.get_model_data import get_model_data

from jsmin import jsmin
import click

@click.command()
@click.argument('filename')
@click.option('-f', '--output-filename', default='index.html', help='Specifies output filename')
@click.option('-o', '--open-in-browser', is_flag=True, help='Opens the resulting *.html file in default browser')
def main_cli(filename, output_filename, open_in_browser):
    """Generates static HTML visualization of Nastran FEM"""
    
    # Parse Nastran model using pyNastran
    nodes, faces, wires, lines = get_model_data(filename)
    
    # Read template and combine with Nastran model geometry
    femview_dir = os.path.dirname(__file__)
    with open(os.path.join(femview_dir, 'template', 'template.html'), 'r') as f:
        content = f.read()
    with open(os.path.join(femview_dir, 'js', 'femview.mjs'), 'r') as f:
        femview = f.read()
    with open(os.path.join(femview_dir, 'js', 'ViewHelper.js'), 'r') as f:
        viewhelper = f.read()
    femview = femview.replace("REPLACE_NODES", str(nodes).replace(' ', ''))
    femview = femview.replace("REPLACE_FACES", str(faces).replace(' ', ''))
    femview = femview.replace("REPLACE_WIRES", str(wires).replace(' ', ''))
    femview = femview.replace("REPLACE_LINES", str(lines).replace(' ', ''))
    content = content.replace("REPLACE_FEMVIEW", jsmin(femview))
    content = content.replace("REPLACE_VIEWHELPER", jsmin(viewhelper))
    with open(output_filename, 'w') as f:
        f.write(content)

    if open_in_browser:
        url = os.path.join('file://', os.getcwd(), output_filename)
        webbrowser.open(url, new=2)
