"""Functions for controlling the GPIO pins on the Raspberry Pi."""

import os
import sys
import RPi.GPIO as GPIO


def turn_on_GPIO0():
    """Turn on the GPIO0 LED."""
    GPIO.setmode(GPIO.BCM)  # set the pin numbering scheme to BCM
    GPIO.setup(17, GPIO.OUT)  # set the pin as an output pin
    GPIO.output(17, GPIO.HIGH)
    print("GPIO0 turned on.")
