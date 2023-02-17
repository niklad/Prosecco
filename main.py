from firebase.firebase_setup import firebase_setup
from firebase.read_rfid import read_rfid
from firebase.check_time import check_if_late
from firebase.joker_prosecco import give_random_processo

def main():
    firebase_setup()

    while True:
        try:
            id, arrival_time, departure_time = read_rfid()
        except TypeError:
            continue
        check_if_late(id, arrival_time, departure_time)
        give_random_processo()

if __name__ == "__main__":
    main()
