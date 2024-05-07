const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cloud Function to trigger on new document creation in Firestore
exports.onUserAdded = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
        // Get the newly added user data
        const userData = snap.data();
        // Perform actions based on the new user data
        console.log('New user added:', userData);
        // You can perform any other operations here, like sending notifications, updating other documents, etc.
        return null;
    });
