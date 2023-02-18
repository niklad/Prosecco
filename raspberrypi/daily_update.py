# import pyrebase
from datetime import datetime
from utils.firebase_setup import firebase_setup
from utils.check_time import increment_prosecco


def daily_update():
    """Check if everyone in the database who do not have
    a registered absence_dates today have arrived.
    """
    firebase = firebase_setup()
    db = firebase.database()
    # Get all users
    users_ids = db.child("Users").get().val()
    today = datetime.today()
    current_date = today.strftime("%Y-%m-%d")

    for user_id in users_ids:
        # Check if the user has a registered absence_dates today
        absence_dates = db.child("Users").child(user_id).child("absence_dates").get().val()
        # Continue if there is an absence_dates with key current_date
        if (absence_dates is not None) and (current_date in absence_dates):
            continue

        # Check if the user has a registered arrival_time today
        arrival_time = (
            db.child("Users")
            .child(user_id)
            .child("arrival_times")
            .child(current_date)
            .get()
            .val()
        )
        if arrival_time is None:
            # If the user has not arrived, increment prosecco_marks by two
            increment_prosecco(user_id, 2)


if __name__ == "__main__":
    daily_update()
