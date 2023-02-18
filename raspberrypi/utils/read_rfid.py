import pyrebase
from datetime import datetime


def read_rfid(firebase: pyrebase):
    print()
    id = input("Enter ID: ")

    # Check if ID is ten numbers
    if len(id) != 10 or not id.isdigit():
        print("ID must be ten digits.")
        return

    # Format to match database
    id = f"ID:{id}"

    print()
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    current_date = now.strftime("%Y-%m-%d")

    # Get arrival and departure times
    arrival_time = (
        firebase.database()
        .child(f"Users/{id}/arrival_times/{current_date}")
        .get()
        .val()
    )
    departure_time = (
        firebase.database()
        .child(f"Users/{id}/departure_times/{current_date}")
        .get()
        .val()
    )

    if arrival_time is None:
        firebase.database().child(f"Users/{id}/arrival_times/{current_date}").set(
            current_time
        )
        arrival_time = current_time
        print(f"Arrival time set to {current_time}.")

    elif departure_time is None:
        firebase.database().child(f"Users/{id}/departure_times/{current_date}").set(
            current_time
        )
        departure_time = current_time
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
