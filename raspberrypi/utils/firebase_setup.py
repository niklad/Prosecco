import pyrebase


def firebase_setup():
    config = {
        "apiKey": "AIzaSyC1VHPwn62vcyx_THa8COonJfY1lWEi-l0",
        "authDomain": "nettsidev1-76f5e.firebaseapp.com",
        "databaseURL": "https://nettsidev1-76f5e.firebaseio.com",
        "storageBucket": "nettsidev1-76f5e.appspot.com",
        "serviceAccount": "utils/nettsidev1-76f5e-firebase-adminsdk-w8ekw-d84ea01cad.json",
    }
    firebase = pyrebase.initialize_app(config)
    return firebase


if __name__ == "__main__":
    raise Exception("This file should not be run directly.")
