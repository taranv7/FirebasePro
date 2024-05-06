// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDr82LOv8535l62V3H0MYQ4ClSfjGcmZjA",
    authDomain: "firstpro-bfbae.firebaseapp.com",
    databaseURL: "https://firstpro-bfbae-default-rtdb.firebaseio.com",
    projectId: "firstpro-bfbae",
    storageBucket: "firstpro-bfbae.appspot.com",
    messagingSenderId: "28564868793",
    appId: "1:28564868793:web:0b594b595c7f1b75255568"
  };


firebase.initializeApp(firebaseConfig);

// references
const db = firebase.firestore();
const auth = firebase.auth();
const realtimeDB = firebase.database();
const storage = firebase.storage();



function addData() {
    const name = document.getElementById("nameInput").value;
    const ageString = document.getElementById("ageInput").value; 

    // ageString to an integer
    const age = parseInt(ageString);

    // if ageString is a valid integer
    if (isNaN(age)) {
        console.error("Invalid age: not a number");
        return; 
        
    }

    db.collection("users").add({
        name: name,
        age: age
    })
    .then((doc) => {
        console.log("Document written with ID: ", doc.id);
        alert("Successfully added the data");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}
//read data from Firestore
function viewData() {
    const dataList = document.getElementById("dataList");
    dataList.innerHTML = "";

    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            dataList.innerHTML += `<li>ID: ${doc.id}, Name: ${data.name}, Age: ${data.age}</li>`;
        });
    });
}

// View data when the page loads
window.onload = function() {
    viewData();
};

//update data in Firestore
function updateData() {
    const id = document.getElementById("updateIdInput").value;
    const name = document.getElementById("updateNameInput").value;
    const age = document.getElementById("updateAgeInput").value;

    //object to store the fields to be updated
    const updateFields = {};

    //if name input is not empty, then add it to updateFields
    if (name.trim() !== '') {
        updateFields.name = name;
    }

    //if age input is not empty, then add it to updateFields
    if (age.trim() !== '') {
        //convert ageString to an integer 
        const ageInt = parseInt(age);

        //if ageInt is a valid integer
        if (isNaN(ageInt)) {
            console.error("Invalid age: not a number");
            return; 
        } else {
            updateFields.age = ageInt;
        }
    }

    //check if updateFields is empty
    if (Object.keys(updateFields).length === 0) {
        console.error("No fields to update");
        return;
    }

    //update only the specified fields
    db.collection("users").doc(id).update(updateFields)
    .then(() => {
        console.log("Document successfully updated");
        alert("Data is updated successfully");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
        alert("There's an error updating the data");
    });
}


//delete data from Firestore
function deleteData() {
    const id = document.getElementById("deleteIdInput").value;

    db.collection("users").doc(id).delete().then(() => {
        console.log("Document successfully deleted");
        alert("Deleted successfully");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });     
}




//sign up users
function signUp() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        console.log("User signed up:", userCredential.user.uid);
        alert("Successfully signed up");
    })
    .catch((error) => {
        console.error("Error signing up:", error.message);
        error("Error signing up:", error.message);
    });
}

//sign in users
function signIn() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        console.log("User signed in:", userCredential.user.uid);
        alert("Successfully signed in");
    })
    .catch((error) => {
        console.error("Error signing in:", error.message);

    });
}

// Function to sign out users
function signOut() {
    auth.signOut()
    .then(() => {
        console.log("User signed out");
        alert("Signed out as a user");
    })
    .catch((error) => {
        console.error("Error signing out:", error.message);
    });
}

//to check authentication state
function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            //signed in
            console.log("User is signed in:", user.uid);
        } else {
            //signed out
            console.log("User is signed out");
        }
    });
}

function addRealtimeData() {
    const data = document.getElementById("realtimeDataInput").value;

    // Push data to a new node in the Realtime Database
    realtimeDB.ref('realtimeData').push({
        value: data
    });
    console.log("Data added to Realtime Database:", data);
}

function viewRealtimeData() {
    const dataList = document.getElementById("realtimeDataList");
    dataList.innerHTML = "";

    // Retrieve data from the Realtime Database
    realtimeDB.ref('realtimeData').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            dataList.innerHTML += `<li>${data.value}</li>`;
            console.log("Data retrieved from Realtime Database:", snapshot.val());
        });
    });
}

// Function to upload a file to Firebase Storage
function uploadFile() {
    const fileInput = document.getElementById('fileInput').files[0];
    const fileName = fileInput.name;
    const storageRef = storage.ref('files/' + fileName);

    // Upload file
    storageRef.put(fileInput).then((snapshot) => {
        console.log('File uploaded successfully');
        alert('File uploaded successfully');
    }).catch((error) => {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
    });
}

// Function to retrieve files from Firebase Storage
function retrieveFiles() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    const storageRef = storage.ref('files');

    // Get the list of items in the folder
    storageRef.listAll().then((res) => {
        res.items.forEach((itemRef) => {
            // Get download URL for each file
            itemRef.getDownloadURL().then((url) => {
                fileList.innerHTML += `<li><a href="${url}" target="_blank">${itemRef.name}</a></li>`;
            }).catch((error) => {
                console.error('Error getting download URL:', error);
            });
        });
    }).catch((error) => {
        console.error('Error retrieving files:', error);
    });
}
