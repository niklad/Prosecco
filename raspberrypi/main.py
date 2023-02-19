from utils.firebase_setup import firebase_setup
from utils.read_rfid import read_rfid
from utils.check_time import check_time
from utils.joker_prosecco import give_random_processo


def main():
    db = firebase_setup()

    while True:
        id, arrival_time, departure_time = read_rfid(db)
        if id is None:
            continue
        check_time(id, arrival_time, departure_time, db)
        # Give joker prosecco upon arrival only
        if departure_time is None:
            give_random_processo(db, id)


if __name__ == "__main__":
    main()
