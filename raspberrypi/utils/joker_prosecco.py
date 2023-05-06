import pyrebase
import random
from utils.constants import JOKER_PROSECCO_PENALTY
from utils.constants import (
    LATE_PENALTY,
    VERY_LATE_PENALTY,
    VERY_LATE_LIMIT_HOURS,
    SAFING_LIMIT_MINUTES,
    MEETING_TIME_SECONDS,
    RED,
    GREEN,
    BLUE,
    JOKER_COLOR,
    ON_TIME_NUMBER_OF_BLINKS,
    LATE_NUMBER_OF_BLINKS,
    VERY_LATE_NUMBER_OF_BLINKS,
    SAFING_NUMBER_OF_BLINKS,
    BLINK_DELAY,
)
from utils.gpio import blink_rainbow_LEDs



def increment_joker_prosecco(id: str, database: pyrebase, penalty_points: int = 1):
    # Increment the prosecco_mark variable in the database
    blink_rainbow_LEDs(JOKER_COLOR, 3, 0.01)
    joker_prosecco_marks = database.child("Users").child(
        id).child("joker_prosecco").get().val()
    joker_prosecco_marks += penalty_points
    database.child("Users").child(id).child(
        "joker_prosecco").set(joker_prosecco_marks)
    return


def give_random_processo(database: pyrebase, id: str):
    """
    - Everyday choose a random ID
    - Everyday choose a random number between 0-100 if number under 6 then give a Joker processo
    """
    id_list = list(database.child("Users").get().val().keys())
    id_list.remove(id)
    number_of_participants = len(id_list)
    if number_of_participants == 0:
        return
    the_chosen_number = random.randint(0, number_of_participants - 1)
    the_chosen_one_id = id_list[the_chosen_number]
    the_chosen_one_name = (
        database.child("Users").child(
            the_chosen_one_id).child("name").get().val()
    )
    joker_proseco = random.randint(0, 99) < 7
    if joker_proseco:
        increment_joker_prosecco(
            the_chosen_one_id, database, JOKER_PROSECCO_PENALTY)
        print(f"{the_chosen_one_name} got a Joker Prosecco!!!")


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
