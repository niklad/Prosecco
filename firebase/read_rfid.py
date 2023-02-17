import firebase_admin
from firebase_admin import db
from datetime import datetime


def read_rfid():
    print()
    id = input("Enter ID: ")

    print()
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    current_date = now.strftime("%Y-%m-%d")

    arrival_time = db.reference(
        f"/Users/ID:{id}/arrival_times/{current_date}"
    ).get()
    departure_time = db.reference(
        f"/Users/ID:{id}/departure_times/{current_date}"
    ).get()

    if arrival_time is None:
        db.reference(f"/Users/ID:{id}/arrival_times/{current_date}").set(
            current_time
        )
        arrival_time = current_time
        print(f"Arrival time set to {current_time}.")

    elif departure_time is None:
        db.reference(f"/Users/ID:{id}/departure_times/{current_date}").set(
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
    read_rfid()
