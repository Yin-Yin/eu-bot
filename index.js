// ## express server ##
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var dialogflowModule = require('./dialogflow/dialogflow.js');
var firestoreModule = require('./database-logic/firestore.js');

app.use((req, res, next) => {

  // -----------------------------------------------------------------------
  // authentication middleware

  const auth = {login: process.env.login, password: process.env.password}

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (!login || !password || login !== auth.login || password !== auth.password) {
    res.set('WWW-Authenticate', 'Basic realm="401"') 
    res.status(401).send('Authentication required.')
    return
  }

  // -----------------------------------------------------------------------
  // Access granted...
  next()

})

console.log("starting server ..");
firestoreModule.initializeDatabase();
// firestoreModule.addAbbreviationData(); // to reload the data into the database uncomment this

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  console.log("app get /");
  res.send('Hi there, this is the webhook for the EU bot. For more info got to: <a href="https://github.com/Yin-Yin/eu-bot/">EU Bot GitHub Page</a>');
});

app.post('/dialogflow', function(req, res) {
  console.log("app post /dialogflow");
  dialogflowModule.handleRequest(req).then((responseJSON) => {
    res.send(responseJSON); 
    console.log("responding with" + responseJSON);
  });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
