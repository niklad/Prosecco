import firebase_admin
from firebase_admin import db
from datetime import datetime, timedelta


def check_if_late(id: str, arrival_time: str, departure_time: str):
    # Get tomorrows date
    today = datetime.today()
    current_date = today.strftime("%Y-%m-%d")

    # Return if the departure time is registred
    if departure_time is not None:
        return

    # Check if there is a meeting time set for today
    meeting_time = db.reference(f"/Users/ID:{id}/meeting_times/{current_date}").get()
    if meeting_time is None:
        # Get the standard_time varibale from the database
        meeting_time = db.reference(f"/Users/ID:{id}/standard_time").get()

    arrival_time_hours = str(arrival_time).split(":")[0]
    arrival_time_minutes = str(arrival_time).split(":")[1]
    arrival_time_seconds = str(arrival_time).split(":")[2]
    meeting_time_hours = str(meeting_time).split(":")[0]
    meeting_time_minutes = str(meeting_time).split(":")[1]
    meeting_time_seconds = "00"

    if arrival_time_hours < meeting_time_hours:
        print("You are on time!")
        return
    if arrival_time_hours == meeting_time_hours:
        if arrival_time_minutes < meeting_time_minutes:
            print("You are on time!")
            return
        if arrival_time_minutes == meeting_time_minutes:
            if arrival_time_seconds <= meeting_time_seconds:
                print("You are on time!")
                return
    print("You are late!")
    # Increment the prosecco_mark variable in the database
    db.reference(f"/Users/ID:{id}/prosecco_marks").set(
        db.reference(f"/Users/ID:{id}/prosecco_marks").get() + 1
    )
    return


if __name__ == "__main__":
    check_if_late()
