# femview

This is a proof of concept for a static HTML FEM pre-processor. It includes minimal features currently.

See example deployment [here](https://dmarc3.github.io/femview/) which is a visualization of the [ISat_Dploy_Sm.dat](https://github.com/SteveDoyle2/pyNastran/blob/main/models/iSat/ISat_Dploy_Sm.dat) model from [pyNastran](https://github.com/SteveDoyle2/pyNastran).

## Installation

Install locally in editable mode:

```shell
pip install -e .
```

> [!NOTE]  
> `femview` is currently not deployed to `pypi` and thus must be installed manually

## Usage

```
Usage: femview [OPTIONS] FILENAME

  Generates static HTML visualization of Nastran FEM

Options:
  -f, --output-filename TEXT  Specifies output filename
  -o, --open-in-browser       Opens the resulting *.html file in default
                              browser
  --help                      Show this message and exit.
```

> [!IMPORTANT]
> `femview` is entirely dependent on `pyNastran`'s ability to successfully read the provided Nastran model.
