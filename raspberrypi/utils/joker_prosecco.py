import pyrebase
import random
from utils.constants import JOKER_PROSECCO_PENALTY
from utils.check_time import day_is_weekend


def increment_joker_prosecco(id: str, db: pyrebase, penalty_points: int = 1):
    # Increment the prosecco_mark variable in the database
    joker_prosecco_marks = db.child("Users").child(id).child("joker_prosecco").get().val()
    joker_prosecco_marks += penalty_points
    db.child("Users").child(id).child("joker_prosecco").set(joker_prosecco_marks)
    return


def give_random_processo(db: pyrebase, id: str):
    """
    - Everyday choose a random ID
    - Everyday choose a random number between 0-100 if number under 6 then give a Joker processo
    """
    if day_is_weekend():
        return

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
        increment_joker_prosecco(the_chosen_one_id, db, JOKER_PROSECCO_PENALTY)
        print(f"{the_chosen_one_name} got a Joker Prosecco!!!")


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
