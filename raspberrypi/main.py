from utils.firebase_setup import firebase_setup
from utils.read_rfid import read_rfid
from utils.check_time import check_time
from utils.joker_prosecco import give_random_processo


def main():
    firebase = firebase_setup()

    while True:
        try:
            id, arrival_time, departure_time = read_rfid(firebase)
        except TypeError:
            continue
        check_time(id, arrival_time, departure_time, firebase)
        give_random_processo(firebase, id)


if __name__ == "__main__":
    main()
