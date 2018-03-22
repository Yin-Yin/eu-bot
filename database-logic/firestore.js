//Firestore Code
const admin = require('firebase-admin');

//var serviceAccount = require('path/to/serviceAccountKey.json'); // set key to get from process.env. like process.env.serviceAccountKey
var serviceAccount = require('path/to/serviceAccountKey.json');

var db = admin.firestore();

module.exports = {
    initializeDatabase: function() {
        console.log("Initialize Firestore ..")
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        
    },

    readFromFirestore: function(){
        db.collection('abbreviations').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
    }
}
