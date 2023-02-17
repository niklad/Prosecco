from utils.firebase_setup import firebase_setup
from utils.read_rfid import read_rfid
from utils.check_time import check_if_late
from utils.joker_prosecco import give_random_processo


def main():
    firebase = firebase_setup()

    while True:
        try:
            id, arrival_time, departure_time = read_rfid(firebase)
        except TypeError:
            continue
        check_if_late(id, arrival_time, departure_time, firebase)
        give_random_processo(firebase)


if __name__ == "__main__":
    main()
