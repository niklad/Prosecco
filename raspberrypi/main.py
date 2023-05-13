from utils.firebase_setup import firebase_setup
from utils.read_rfid import read_rfid
from utils.check_time import check_time, day_is_weekend
from utils.joker_prosecco import give_random_processo
from utils.gpio import blink_LEDs, configure_GPIO_pins, turn_on_LEDs, turn_off_LEDs
from utils.constants import BLINK_DELAY, ON_TIME_NUMBER_OF_BLINKS, BLUE, RED, GREEN
import os


def main():
    database = firebase_setup()

    while True:
        try:
            turn_off_LEDs()
            turn_on_LEDs(GREEN)

            id, arrival_time, departure_time = read_rfid(database)
            if id is None:
                continue

            # Give joker prosecco upon arrival only
            if departure_time is None:
                give_random_processo(database, id)

            if day_is_weekend():
                print("It's the weekend!")
                blink_LEDs(BLUE, ON_TIME_NUMBER_OF_BLINKS, BLINK_DELAY)
                continue

            check_time(id, arrival_time, departure_time, database)

        except KeyboardInterrupt:
            print("\nBing bong")
            turn_off_LEDs()
            turn_on_LEDs(RED)
            break
        except Exception as e:
            print("Program not running. Please reboot or contact an adult.")
            print(f"Error: {e}")
            turn_off_LEDs()
            turn_on_LEDs(RED)
            # Reboot if something goes wrong
            os.system("sudo reboot")
            break


if __name__ == "__main__":
    main()
