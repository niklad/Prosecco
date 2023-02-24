import pyrebase
from datetime import datetime, timedelta
from utils.firebase_setup import firebase_setup
from utils.check_time import increment_prosecco
from utils.constants import NO_SHOW_PENALTY
from weekday_update import daily_update_was_done


def weekend_update():
    """Write "Weekend" to the database if it is the weekend"""
    db = firebase_setup()
    today = datetime.today()
    # Yesterday's date
    yesterday = today - timedelta(days=1)
    yesterday_date = yesterday.strftime("%Y-%m-%d")

    if daily_update_was_done(db, yesterday_date):
        return

    return f"{yesterday_date}: Weekend update done"


def send_acknowledgement(db: pyrebase, yesterday_date: str):
    db.child("daily_updates").child(yesterday_date).set("Weekend")


if __name__ == "__main__":
    weekend_update()
