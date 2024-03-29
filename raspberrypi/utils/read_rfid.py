import pyrebase
from datetime import datetime
from utils.gpio import blink_LEDs, turn_off_LEDs
from utils.constants import (
    DEPARTING_NUMBER_OF_BLINKS,
    BLINK_DELAY,
    GREEN,)


def read_rfid(database: pyrebase):
    print()
    id = input("Enter ID: ")
    print()

    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    current_date = now.strftime("%Y-%m-%d")

    # Check if ID is ten numbers
    if len(id) != 10 or not id.isdigit():
        print("ID must be ten digits.")
        return None, None, None

    # Format to match database
    id = f"ID:{id}"

    # Check if ID exists in database
    if database.child(f"Users/{id}").get().val() is None:
        print("ID does not exist.")
        return None, None, None

    turn_off_LEDs()

    # Get arrival and departure times
    arrival_time = database.child(
        f"Users/{id}/arrival_times/{current_date}").get().val()
    departure_time = database.child(
        f"Users/{id}/departure_times/{current_date}").get().val()

    if arrival_time is None:
        database.child(f"Users/{id}/arrival_times/{current_date}").set(current_time)
        arrival_time = current_time
        print(f"Arrival time set to {current_time}.")

    elif departure_time is None:
        database.child(
            f"Users/{id}/departure_times/{current_date}").set(current_time)
        departure_time = current_time
        blink_LEDs(GREEN, DEPARTING_NUMBER_OF_BLINKS, BLINK_DELAY)
        print(f"Departure time set to {current_time}.")

    else:
        print(f"Today's arrival time: {arrival_time}.")
        print(f"Today's departure time: {departure_time}.")
        time_difference = datetime.strptime(
            departure_time, "%H:%M:%S"
        ) - datetime.strptime(arrival_time, "%H:%M:%S")
        print(f"Time spent at lesesal today: {time_difference}.")

    return id, arrival_time, departure_time


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
