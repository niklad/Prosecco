import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from datetime import datetime


def read_rfid():
    while True:
        id = input("Enter ID: ")
        print(f"ID: {id}")

        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print("Current Time =", current_time)

        db.reference(f"/Users/{id}").update({"Arrival time": current_time})
