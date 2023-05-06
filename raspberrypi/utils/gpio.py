"""Functions for controlling the GPIO pins on the Raspberry Pi."""
import RPi.GPIO as GPIO
import time
from utils.constants import (NUMBER_OF_LEDS)
import board
import neopixel

import colorsys




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

def blink_rainbow_LEDs(colors: list, number_of_blinks: int, delay: float):
    """Blink the GPIO0 LED in a rainbow color sequence."""
    for _ in range(number_of_blinks):
        for i in range(len(colors)):
            start_color = colors[i]
            end_color = colors[(i+1) % len(colors)] # wrap around to the first color at the end
            for j in range(100): # generate 100 intermediate colors between start and end
                r, g, b = [int(255*x) for x in colorsys.hsv_to_rgb(j/100, 1, 1)] # convert HSV to RGB
                color = tuple([start_color[k] + int((end_color[k] - start_color[k]) * j/100) for k in range(3)])
                turn_on_LEDs(color)
                time.sleep(delay/100)
                turn_off_LEDs()
                time.sleep(delay/100)