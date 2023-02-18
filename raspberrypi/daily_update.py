import pyrebase
from datetime import datetime
from utils.firebase_setup import firebase_setup
from utils.check_time import increment_prosecco


def daily_update():
    """Check if everyone in the database who do not have
    a registered absence_dates today have arrived.
    """
    firebase = firebase_setup()
    db = firebase.database()
    user_ids = db.child("Users").get().val()
    today = datetime.today()
    # Yesterday's date
    yesterday = today - timedelta(days=1)
    yesterday_date = yesterday.strftime("%Y-%m-%d")

    NO_SHOW_PENALTY = 2
    for user_id in user_ids:
        if user_did_not_show(user_id, db, yesterday_date):
            increment_prosecco(user_id, db, penalty_points=NO_SHOW_PENALTY)


def user_did_not_show(user_id: str, db: pyrebase, yesterday_date: str):
    # Check if the user has a registered absence_dates today
    absence_dates = (
        db.child("Users").child(user_id).child("absence_dates").get().val()
    )
    # Continue if there is a registered absence_dates today
    if (absence_dates is not None) and (yesterday_date in absence_dates):
        return False

    # Check if the user has a registered arrival_time today
    arrival_time = (
        db.child("Users")
        .child(user_id)
        .child("arrival_times")
        .child(yesterday_date)
        .get()
        .val()
    )
    if arrival_time is None:
        return True
    return False


if __name__ == "__main__":
    daily_update()
