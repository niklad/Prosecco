import pyrebase
from datetime import datetime, timedelta
from utils.firebase_setup import firebase_setup
from weekday_update import daily_update_was_done


def weekend_update():
    """Write "Weekend" to the database if it is the weekend"""
    database = firebase_setup()
    today = datetime.today()
    # Yesterday's date
    yesterday = today - timedelta(days=1)
    yesterday_date = yesterday.strftime("%Y-%m-%d")

    if daily_update_was_done(database, yesterday_date):
        return
    send_acknowledgement(database, yesterday_date)

    return f"{yesterday_date}: Weekend update done"


def send_acknowledgement(database: pyrebase, yesterday_date: str):
    database.child("daily_updates").child(yesterday_date).set("Weekend")


if __name__ == "__main__":
    weekend_update()
