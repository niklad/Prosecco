import pyrebase
import os


def firebase_setup():
    # Make an absolute path to the json file
    path = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(
        path, "nettsidev1-76f5e-firebase-adminsdk-w8ekw-d84ea01cad.json"
    )

    config = {
        "apiKey": "AIzaSyC1VHPwn62vcyx_THa8COonJfY1lWEi-l0",
        "authDomain": "nettsidev1-76f5e.firebaseapp.com",
        "databaseURL": "https://nettsidev1-76f5e.firebaseio.com",
        "storageBucket": "nettsidev1-76f5e.appspot.com",
        "serviceAccount": json_path,
    }
    firebase = pyrebase.initialize_app(config)
    database = firebase.database()
    return database


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
