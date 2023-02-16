from firebase.firebase_setup import firebase_setup
from firebase.read_rfid import read_rfid


def main():
    firebase_setup()
    read_rfid()


if __name__ == "__main__":
    main()
