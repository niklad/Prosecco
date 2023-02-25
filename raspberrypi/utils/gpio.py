"""Functions for controlling the GPIO pins on the Raspberry Pi."""
import RPi.GPIO as GPIO
import time
from utils.constants import (NUMBER_OF_LEDS)
import board
import neopixel


def configure_GPIO_pins():
    """Configure the GPIO pins."""
    # GPIO.setmode(GPIO.BCM)
    # GPIO.setup(18, GPIO.OUT)
    pass


def turn_on_LEDs(color: tuple):
    pixels = neopixel.NeoPixel(board.D18, NUMBER_OF_LEDS)
    pixels.fill(color)


def turn_off_LEDs():
    pixels = neopixel.NeoPixel(board.D18, NUMBER_OF_LEDS)
    pixels.fill((0, 0, 0))


def blink_LEDs(color: tuple, number_of_blinks: int, delay: float):
    """Blink the GPIO0 LED three times."""
    for _ in range(number_of_blinks):
        turn_on_LEDs(color)
        time.sleep(delay)
        turn_off_LEDs()
        time.sleep(delay)
