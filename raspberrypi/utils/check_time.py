from firebase_admin import db
from datetime import datetime, timedelta



def check_if_late(id: str, arrival_time: str, departure_time: str):
    # Return if the departure time is registred
    if departure_time is not None:
        return

    # Check if there is a meeting time set for today
    meeting_time = get_meeting_time(id)

    if is_safing(arrival_time, meeting_time):
        print("You are safing!")
        increment_prosecco(id)
        return

    if is_late(arrival_time, meeting_time):
        print("You are late!")
        increment_prosecco(id)
        return

    print("You are on time!")
    return


def get_meeting_time(id: str):
    today = datetime.today()
    current_date = today.strftime("%Y-%m-%d")

    meeting_time = db.reference(f"/Users/ID:{id}/meeting_times/{current_date}").get()
    if meeting_time is None:
        # Get the standard_time varibale from the database
        meeting_time = db.reference(f"/Users/ID:{id}/standard_time").get()
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


def increment_prosecco(id: str):
    # Increment the prosecco_mark variable in the database
    db.reference(f"/Users/ID:{id}/prosecco_marks").set(
        db.reference(f"/Users/ID:{id}/prosecco_marks").get() + 1
    )


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
