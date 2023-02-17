import pyrebase
from datetime import datetime


def read_rfid():
    print()
    id = input("Enter ID: ")

    # Check if ID is ten numbers
    if len(id) != 10 or not id.isdigit():
        print("ID must be ten digits.")
        return

    print()
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    current_date = now.strftime("%Y-%m-%d")

    # Set up Pyrebase
    config = {
        "apiKey": "YOUR_API_KEY",
        "authDomain": "YOUR_AUTH_DOMAIN",
        "databaseURL": "YOUR_DATABASE_URL",
        "storageBucket": "YOUR_STORAGE_BUCKET",
        "serviceAccount": "utils/nettsidev1-76f5e-firebase-adminsdk-w8ekw-d84ea01cad.json"
    }
    firebase = pyrebase.initialize_app(config)

    # Get arrival and departure times
    arrival_time = firebase.database().child(f"Users/ID:{id}/arrival_times/{current_date}").get().val()
    departure_time = firebase.database().child(f"Users/ID:{id}/departure_times/{current_date}").get().val()

    if arrival_time is None:
        firebase.database().child(f"Users/ID:{id}/arrival_times/{current_date}").set(current_time)
        arrival_time = current_time
        print(f"Arrival time set to {current_time}.")

    elif departure_time is None:
        firebase.database().child(f"Users/ID:{id}/departure_times/{current_date}").set(current_time)
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
