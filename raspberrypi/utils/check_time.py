import pyrebase
from datetime import datetime, timedelta


def check_if_late(id: str, arrival_time: str, departure_time: str, firebase: pyrebase):
    # Return if the departure time is registred
    db = firebase.database()
    if departure_time is not None:
        return

    # Check if there is a meeting time set for today
    meeting_time = get_meeting_time(id, db)

    if is_safing(arrival_time, meeting_time):
        print("You are safing!")
        increment_prosecco(id, db)
        return

    if is_late(arrival_time, meeting_time):
        print("You are late!")
        increment_prosecco(id, db)
        return

    print("You are on time!")
    return


def get_meeting_time(id: str, db: pyrebase):
    today = datetime.today()
    current_date = today.strftime("%Y-%m-%d")

    meeting_time = (
        db.child("Users")
        .child(f"ID:{id}")
        .child("meeting_times")
        .child(current_date)
        .get()
        .val()
    )
    if meeting_time is None:
        # Get the standard_time varibale from the database
        meeting_time = (
            db.child("Users").child(f"ID:{id}").child("standard_time").get().val()
        )
    meeting_time_seconds = "59"  # To allow for arriving within the minute
    meeting_time = f"{meeting_time}:{meeting_time_seconds}"
    return meeting_time


def is_late(arrival_time: str, meeting_time: str):
    """Check if the arrival time (HH:MM:SS) is later than the meeting time."""
    if datetime.strptime(arrival_time, "%H:%M:%S") > datetime.strptime(
        meeting_time, "%H:%M:%S"
    ):
        return True
    return False


def is_safing(arrival_time: str, meeting_time: str):
    """Safing is defined as arriving more than safing_limit minutes before meeting_time."""
    safing_limit_minutes = 30
    if datetime.strptime(arrival_time, "%H:%M:%S") < datetime.strptime(
        meeting_time, "%H:%M:%S"
    ) - timedelta(minutes=safing_limit_minutes):
        return True
    return False


def increment_prosecco(id: str, db: pyrebase):
    # Increment the prosecco_mark variable in the database
    prosecco_marks = (
        db.child("Users").child(f"ID:{id}").child("prosecco_marks").get().val()
    )
    prosecco_marks += 1
    db.child("Users").child(f"ID:{id}").child("prosecco_marks").set(prosecco_marks)
    return


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
