"""Home Assistant Eltako Frontend."""

from typing import Final


def locate_dir() -> str:
    """Return the location of the frontend files."""
    return __path__[0]


# The webcomponent name that loads the panel (main.ts)
webcomponent_name: Final = "home-assistant-eltako-frontend"
