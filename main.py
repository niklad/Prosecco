from firebase.firebase_setup import firebase_setup
from firebase.read_rfid import read_rfid
from firebase.check_time import check_if_late


def main():
    firebase_setup()

    while True:
        id, arrival_time, departure_time = read_rfid()
        check_if_late(id, arrival_time, departure_time)


if __name__ == "__main__":
    main()
