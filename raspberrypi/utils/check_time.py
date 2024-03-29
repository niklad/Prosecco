import pyrebase
from datetime import datetime, timedelta
from utils.constants import (
    LATE_PENALTY,
    VERY_LATE_PENALTY,
    VERY_LATE_LIMIT_HOURS,
    SAFING_LIMIT_MINUTES,
    MEETING_TIME_SECONDS,
    RED,
    GREEN,
    ON_TIME_NUMBER_OF_BLINKS,
    LATE_NUMBER_OF_BLINKS,
    VERY_LATE_NUMBER_OF_BLINKS,
    SAFING_NUMBER_OF_BLINKS,
    BLINK_DELAY,
)
from utils.gpio import blink_LEDs


def check_time(id: str, arrival_time: str, departure_time: str, database: pyrebase):
    # Return if the departure time is registred
    if departure_time is not None:
        return

    # Check if there is a meeting time set for today
    meeting_time = get_meeting_time(id, database)

    if user_is_safing(arrival_time, meeting_time):
        print("You are safing!")
        blink_LEDs(RED, SAFING_NUMBER_OF_BLINKS, BLINK_DELAY)
        increment_prosecco(id, database)
        return

    if user_is_very_late(arrival_time, meeting_time):
        print("You are very late!")
        blink_LEDs(RED, VERY_LATE_NUMBER_OF_BLINKS, BLINK_DELAY)
        increment_prosecco(id, database, penalty_points=VERY_LATE_PENALTY)
        return

    if user_is_late(arrival_time, meeting_time):
        print("You are late!")
        blink_LEDs(RED, LATE_NUMBER_OF_BLINKS, BLINK_DELAY)
        increment_prosecco(id, database, penalty_points=LATE_PENALTY)
        return

    print("You are on time!")
    blink_LEDs(GREEN, ON_TIME_NUMBER_OF_BLINKS, BLINK_DELAY)
    return


def get_meeting_time(id: str, database: pyrebase):
    today = datetime.today()
    current_date = today.strftime("%Y-%m-%d")

    meeting_time = (
        database.child("Users")
        .child(id)
        .child("meeting_times")
        .child(current_date)
        .get()
        .val()
    )
    if meeting_time is None:
        # Get the standard times from the standard_time node in the database
        standard_times = (
            database.child("Users").child(id).child("standard_time").get().val()
        )
        # If the last standard time in the standard_times dictionary was set today, use the second to last one
        if (
            datetime.strptime(list(standard_times.keys())[-1], "%Y-%m-%d").date()
            == today.date()
        ):
            meeting_time = list(standard_times.values())[-2]
        else:
            meeting_time = list(standard_times.values())[-1]

    meeting_time = f"{meeting_time}:{MEETING_TIME_SECONDS}"
    return meeting_time


def user_is_late(arrival_time: str, meeting_time: str):
    """Check if the arrival time (HH:MM:SS) is later than the meeting time."""
    if datetime.strptime(arrival_time, "%H:%M:%S") > datetime.strptime(
        meeting_time, "%H:%M:%S"
    ):
        return True
    return False


def user_is_very_late(arrival_time: str, meeting_time: str):
    """Check if the arrival time (HH:MM:SS) is more than hour after meeting_time."""
    if datetime.strptime(arrival_time, "%H:%M:%S") > datetime.strptime(
        meeting_time, "%H:%M:%S"
    ) + timedelta(hours=VERY_LATE_LIMIT_HOURS):
        return True
    return False


def user_is_safing(arrival_time: str, meeting_time: str):
    """Safing is defined as arriving more than safing_limit minutes before meeting_time."""
    if datetime.strptime(arrival_time, "%H:%M:%S") < datetime.strptime(
        meeting_time, "%H:%M:%S"
    ) - timedelta(minutes=SAFING_LIMIT_MINUTES):
        return True
    return False


def day_is_weekend():
    today = datetime.today()
    if today.weekday() in [5, 6]:
        return True
    return False


def increment_prosecco(id: str, database: pyrebase, penalty_points: int = 1):
    # Increment the prosecco_mark variable in the database
    prosecco_marks = (
        database.child("Users").child(id).child("prosecco_marks").get().val()
    )
    prosecco_marks += penalty_points
    database.child("Users").child(id).child("prosecco_marks").set(prosecco_marks)
    return


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
