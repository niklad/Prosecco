import firebase_admin
from firebase_admin import credentials


def firebase_setup():
    # Fetch the service account key JSON file contents
    cred = credentials.Certificate(
        "raspberrypi/utils/nettsidev1-76f5e-firebase-adminsdk-w8ekw-d84ea01cad.json"
    )
    # Initialize the app with a service account, granting admin privileges
    firebase_admin.initialize_app(
        cred,
        {
            "databaseURL": "https://nettsidev1-76f5e.firebaseio.com"
        },
    )


if __name__ == "__main__":
    firebase_setup()
