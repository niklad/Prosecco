import pyrebase
from datetime import datetime, timedelta
from utils.firebase_setup import firebase_setup
from utils.check_time import increment_prosecco
from utils.constants import NO_SHOW_PENALTY


def weekday_update():
    """Check if everyone in the database who do not have
    a registered absence_dates today have arrived.
    """
    db = firebase_setup()
    user_ids = db.child("Users").get().val()
    today = datetime.today()
    # Yesterday's date
    yesterday = today - timedelta(days=1)
    yesterday_date = yesterday.strftime("%Y-%m-%d")

    if daily_update_was_done(db, yesterday_date):
        return

    for user_id in user_ids:
        if user_did_not_show(user_id, db, yesterday_date):
            increment_prosecco(user_id, db, penalty_points=NO_SHOW_PENALTY)
    send_acknowledgement(db, yesterday_date)
    # Status "Done" should be written to daily_update.log
    return f"{yesterday_date}: Done"


def user_did_not_show(user_id: str, db: pyrebase, yesterday_date: str):
    # Continue if there are no arrival_times in the database
    arrival_times = db.child("Users").child(user_id).child("arrival_times").get().val()
    if arrival_times is None:
        # The user account has just been created
        return False

    # Continue if there was a registered absence_date yesterday
    absence_dates = db.child("Users").child(user_id).child("absence_dates").get().val()
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


def send_acknowledgement(db: pyrebase, yesterday_date: str):
    db.child("daily_updates").child(yesterday_date).set("Done")


def daily_update_was_done(db: pyrebase, yesterday_date: str):
    daily_update_status = db.child("daily_updates").child(yesterday_date).get().val()
    if (daily_update_status == "Done" or daily_update_status == "Weekend"):
        return True
    return False


if __name__ == "__main__":
    weekday_update()
