import pyrebase


def firebase_setup():
    config = {
        "apiKey": "YOUR_API_KEY",
        "authDomain": "YOUR_AUTH_DOMAIN",
        "databaseURL": "YOUR_DATABASE_URL",
        "storageBucket": "YOUR_STORAGE_BUCKET",
        "serviceAccount": "raspberrypi/utils/nettsidev1-76f5e-firebase-adminsdk-w8ekw-d84ea01cad.json",
    }
    firebase = pyrebase.initialize_app(config)


if __name__ == "__main__":
    firebase_setup()
