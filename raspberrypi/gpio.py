"""Functions for controlling the GPIO pins on the Raspberry Pi."""

import os
import sys
import warnings

from . import pins
from . import utils

# Import the correct GPIO module for the platform
if os.name == 'posix':
    if sys.platform.startswith('linux'):
        from . import _pigpio
    else:
        print("Bing bong")


def turn_on_GPIO0():
    """Turn on the GPIO0 LED."""
    _pigpio.turn_on_GPIO0()
