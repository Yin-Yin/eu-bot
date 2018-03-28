//Firestore Code
const admin = require('firebase-admin');

//var serviceAccount = require('path/to/serviceAccountKey.json'); // set key to get from process.env. like process.env.serviceAccountKey
//var serviceAccount = require('path/to/serviceAccountKey.json');
var serviceAccount = {
    "type": "service_account",
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": JSON.parse(process.env.PRIVATE_KEY),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
}

var db = {};

module.exports = {
    initializeDatabase: function() {
        console.log("Initialize Firestore ..")
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        this.db = admin.firestore();

        //this.readFromFirestore(); // just for testing .. 


    },

    addAbbreviationData: function() {
        var abbreviationJSON = require('../import-data/eu-abbreviations.json');
        console.log("Looping through abbreviationJSON ... _______-")
        for (var key in abbreviationJSON) {
            //console.log("key: ", key);
            //console.log("abbreviationJSON[key].meaning: ", abbreviationJSON[key].meaning);
            this.db.collection('abbreviations').doc(abbreviationJSON[key].abbreviation).set({
                abbreviation: abbreviationJSON[key].abbreviation,
                meaning: abbreviationJSON[key].meaning
            });
             /*
            this.db.collection('abbreviations').add({
                abbreviation: abbreviationJSON[key].abbreviation,
                meaning: abbreviationJSON[key].meaning
            }).then(ref => {
                console.log('Added document with ID: ', ref.id);
            });
            //*/
        }

    },

    readFromFirestoreHarcCoded: function() {
        //this is to get sth out of the database 
        this.db.collection('abbreviations').get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });

    },

    readFromFirestore: function(firestoreCollection, documentField) { //this is to get sth out of the database 
        return new Promise((resolve, reject) => {
            this.db.collection(firestoreCollection).get(documentField)
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        console.log("readFromFirestore: ", doc.id, '=>', doc.data());

                        //console.log("doc: ", doc);
                        let returnObject = doc.data();
                        //console.log("returnObject ", returnObject);
                        //console.log("returnObject.documentField ", returnObject.documentField);
                        /*
                        let returnValue = 'this is the return value';
                        for (var key in returnObject) {
                            console.log("key", key);
                            console.log("returnObject.key", returnObject.key);
                            returnValue = returnObject.key;
                        }
                        */
                        resolve(returnObject);
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                    reject('Error getting documents', err);
                });
        })
    }

}
