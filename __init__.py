"""Home Assistant Eltako Frontend."""

from typing import Final


def locate_dir() -> str:
    """Return the location of the frontend files."""
    return __path__[0]


# The webcomponent name that loads the panel (main.ts)
webcomponent_name: Final = "home-assistant-eltako-frontend"

local_module_url: Final = './assets/index-BYw5rWpL.js'
module_url: Final = '/eltako/assets/index-BYw5rWpL.js'
