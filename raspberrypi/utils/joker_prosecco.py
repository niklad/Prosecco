import pyrebase
import random
from utils.check_time import increment_prosecco
from utils.constants import JOKER_PROSECCO_PENALTY


def give_random_processo(db: pyrebase, id):
    """
    - Everyday choose a random ID
    - Everyday choose a random number between 0-100 if number under 6 then give a Joker processo
    """
    id_list = list(db.child("Users").get().val().keys())
    id_list.remove(id)
    number_of_participants = len(id_list)
    if number_of_participants == 0:
        return
    the_chosen_number = random.randint(0, number_of_participants - 1)
    the_chosen_one_id = id_list[the_chosen_number]
    the_chosen_one_name = (
        db.child("Users").child(the_chosen_one_id).child("name").get().val()
    )

    joker_proseco = random.randint(0, 100) <= 1
    if joker_proseco:
        increment_prosecco(the_chosen_one_id, db, JOKER_PROSECCO_PENALTY)
        print(f"{the_chosen_one_name} got a Joker Prosecco!!!")


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
