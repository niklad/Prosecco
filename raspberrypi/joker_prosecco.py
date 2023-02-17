from firebase_admin import db
import random
from firebase.check_time import increment_prosecco


def give_random_processo():
    """
    - Everyday choose a random ID 
    - Everyday choose a random number between 0-100 if number under 6 then give a Joker processo
    """
    ID_list = list(db.reference(f"/Users").get().keys())
    nr_participants = len(ID_list)
    the_choosen_number = random.randint(0, nr_participants-1)
    id = ID_list[the_choosen_number]
    split_id = id.split(":")
    the_choosen_one = split_id[1]

    joker_proseco = (random.randint(0, 100) <= 1)
    if(joker_proseco):
        increment_prosecco(the_choosen_one)
        print(str(the_choosen_one), " got a Joker Prosecco!!!")