"""Functions for controlling the GPIO pins on the Raspberry Pi."""
import RPi.GPIO as GPIO
import time
# from utils.constants import (GREEN_LED_PIN, BLUE_LED_PIN)


def configure_GPIO_pins():
    """Configure the GPIO pins."""
    # GPIO.setmode(GPIO.BCM)
    # GPIO.setup(GREEN_LED_PIN, GPIO.OUT)
    # GPIO.setup(BLUE_LED_PIN, GPIO.OUT)
    pass


def turn_on_GPIO_pin(gpio_pin):
    """Turn on the GPIO0 LED."""
    # GPIO.output(gpio_pin, GPIO.HIGH)
    pass


def turn_off_GPIO_pin(gpio_pin):
    """Turn off the GPIO0 LED."""
    # GPIO.output(gpio_pin, GPIO.LOW)
    pass


def blink_LED(gpio_pin, number_of_blinks, delay):
    """Blink the GPIO0 LED three times."""
    # for _ in range(number_of_blinks):
    #     turn_on_GPIO_pin(gpio_pin)
    #     time.sleep(delay)
    #     turn_off_GPIO_pin(gpio_pin)
    #     time.sleep(delay)
    pass


# Define GPIO pins for RS, RW, and E
LCD_RS = 25
LCD_RW = 24
LCD_E = 23

# Define GPIO pins for data bits D4-D7
LCD_D4 = 17
LCD_D5 = 18
LCD_D6 = 27
LCD_D7 = 22

# Define LCD commands
LCD_CLEAR = 0x01
LCD_HOME = 0x02
LCD_ENTRY_MODE = 0x06
LCD_DISPLAY_CONTROL = 0x0C
LCD_FUNCTION_SET = 0x28


def lcd_init():
    # Set up GPIO pins for LCD
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(LCD_RS, GPIO.OUT)
    GPIO.setup(LCD_RW, GPIO.OUT)
    GPIO.setup(LCD_E, GPIO.OUT)
    GPIO.setup(LCD_D4, GPIO.OUT)
    GPIO.setup(LCD_D5, GPIO.OUT)
    GPIO.setup(LCD_D6, GPIO.OUT)
    GPIO.setup(LCD_D7, GPIO.OUT)

    # Initialize LCD
    lcd_send(LCD_FUNCTION_SET)
    lcd_send(LCD_CLEAR)
    lcd_send(LCD_ENTRY_MODE)
    lcd_send(LCD_DISPLAY_CONTROL)


def lcd_send(cmd, mode=0):
    # Set RS pin based on mode (0 = command, 1 = data)
    GPIO.output(LCD_RS, mode)

    # Set RW pin low for write mode
    GPIO.output(LCD_RW, 0)

    # Send high nibble of command
    GPIO.output(LCD_D4, ((cmd >> 4) & 0x01))
    GPIO.output(LCD_D5, ((cmd >> 5) & 0x01))
    GPIO.output(LCD_D6, ((cmd >> 6) & 0x01))
    GPIO.output(LCD_D7, ((cmd >> 7) & 0x01))

    # Send low nibble of command
    GPIO.output(LCD_E, 1)
    time.sleep(0.000001)
    GPIO.output(LCD_E, 0)

    GPIO.output(LCD_D4, (cmd & 0x01))
    GPIO.output(LCD_D5, ((cmd >> 1) & 0x01))
    GPIO.output(LCD_D6, ((cmd >> 2) & 0x01))
    GPIO.output(LCD_D7, ((cmd >> 3) & 0x01))

    # Send low nibble of command
    GPIO.output(LCD_E, 1)
    time.sleep(0.000001)
    GPIO.output(LCD_E, 0)


def lcd_write(message):
    for char in message:
        lcd_send(ord(char), 1)


if __name__ == '__main__':
    try:
        lcd_init()
        lcd_write("Hello, world!")
    except KeyboardInterrupt:
        pass
    finally:
        GPIO.cleanup()
