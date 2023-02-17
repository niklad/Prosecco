import pyrebase
import random
from utils.check_time import increment_prosecco

firebase_config = {
    "apiKey": "<your_api_key>",
    "authDomain": "<your_auth_domain>",
    "databaseURL": "<your_database_url>",
    "projectId": "<your_project_id>",
    "storageBucket": "<your_storage_bucket>",
    "messagingSenderId": "<your_messaging_sender_id>",
    "appId": "<your_app_id>",
    "measurementId": "<your_measurement_id>"
}

firebase = pyrebase.initialize_app(firebase_config)
db = firebase.database()

def give_random_processo():
    """
    - Everyday choose a random ID
    - Everyday choose a random number between 0-100 if number under 6 then give a Joker processo
    """
    id_list = list(db.child("Users").get().val().keys())
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
