"""Functions for controlling the GPIO pins on the Raspberry Pi."""
import RPi.GPIO as GPIO
import time
from utils.constants import (GREEN_LED_PIN, RED_LED_PIN)


def configure_GPIO_pins():
    """Configure the GPIO pins."""
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(GREEN_LED_PIN, GPIO.OUT)
    GPIO.setup(RED_LED_PIN, GPIO.OUT)


def turn_on_GPIO_pin(gpio_pin):
    """Turn on the GPIO0 LED."""
    GPIO.output(gpio_pin, GPIO.HIGH)


def turn_off_GPIO(gpio_pin):
    """Turn off the GPIO0 LED."""
    GPIO.output(gpio_pin, GPIO.LOW)


def blink_LED(gpio_pin, number_of_blinks, delay):
    """Blink the GPIO0 LED three times."""
    for _ in range(number_of_blinks):
        turn_on_GPIO_pin(gpio_pin)
        time.sleep(delay)
        turn_off_GPIO(gpio_pin)
        time.sleep(delay)
