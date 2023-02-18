# import pyrebase
from datetime import datetime, timedelta

from utils.check_time import increment_prosecco
from utils.firebase_setup import firebase_setup


def daily_update():
    firebase = firebase_setup()
    db = firebase.database()
    BRAGE_ID = "3207269892"
    increment_prosecco(BRAGE_ID, db)


if __name__ == "__main__":
    daily_update()
