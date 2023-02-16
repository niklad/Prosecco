import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Fetch the service account key JSON file contents
cred = credentials.Certificate('Firebase/prosecco-91651-firebase-adminsdk-z0z5i-048fc97ec3.json')
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://prosecco-91651-default-rtdb.europe-west1.firebasedatabase.app"
})

# users = db.reference('/Users')
# print(users.get())

users = db.reference('/Users').get()

spesific_id = 1

ID = list(users.values())
Name = list(users.keys())

print(Name[ID.index(spesific_id)])