"""Functions for controlling the GPIO pins on the Raspberry Pi."""

import os
import sys
import RPi.GPIO as GPIO


def turn_on_GPIO0():
    """Turn on the GPIO0 LED."""
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(0, GPIO.OUT)
    GPIO.output(0, GPIO.HIGH)
