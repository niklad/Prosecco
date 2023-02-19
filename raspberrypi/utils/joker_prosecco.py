import pyrebase
import random
from utils.check_time import increment_prosecco
from utils.constants import JOKER_PROSECCO_PENALTY


def give_random_processo(firebase: pyrebase):
    """
    - Everyday choose a random ID
    - Everyday choose a random number between 0-100 if number under 6 then give a Joker processo
    """
    db = firebase.database()

    id_list = list(db.child("Users").get().val().keys())
    number_of_participants = len(id_list)
    the_chosen_number = random.randint(0, number_of_participants - 1)
    the_chosen_one = id_list[the_chosen_number]

    joker_proseco = random.randint(0, 100) >= 1
    if joker_proseco:
        increment_prosecco(the_chosen_one, db, JOKER_PROSECCO_PENALTY)
        print(str(the_chosen_one), " got a Joker Prosecco!!!")


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
