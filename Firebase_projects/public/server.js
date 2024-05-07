const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

// Initialize Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://firstpro-bfbae-default-rtdb.firebaseio.com'
});

const db = firebase.firestore();

const app = express();
app.use(bodyParser.json());

// Create a user
app.post('/api/users', (req, res) => {
  const { name, age } = req.body;
  db.collection('users').add({ name, age })
    .then(docRef => res.status(201).json({ id: docRef.id }))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Get all users
app.get('/api/users', (req, res) => {
  db.collection('users').get()
    .then(snapshot => {
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      res.json(users);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Update a user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  db.collection('users').doc(id).update({ name, age })
    .then(() => res.sendStatus(204))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.collection('users').doc(id).delete()
    .then(() => res.sendStatus(204))
    .catch(error => res.status(500).json({ error: error.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
