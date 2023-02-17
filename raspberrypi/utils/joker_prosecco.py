from firebase_admin import db
import random
from utils.check_time import increment_prosecco


def give_random_processo():
    """
    - Everyday choose a random ID
    - Everyday choose a random number between 0-100 if number under 6 then give a Joker processo
    """
    id_list = list(db.reference("/Users").get().keys())
    number_of_participants = len(id_list)
    the_chosen_number = random.randint(0, number_of_participants - 1)
    id = id_list[the_chosen_number]
    split_id = id.split(":")
    the_chosen_one = split_id[1]

    joker_proseco = random.randint(0, 100) <= 1
    if joker_proseco:
        increment_prosecco(the_chosen_one)
        print(str(the_chosen_one), " got a Joker Prosecco!!!")


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
