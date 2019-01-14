'use strict';
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

const quoteModule = require('../functional-logic/quotes/quotes.js');
const euInfoModule = require('../functional-logic/eu-info/eu-info.js');
const firestoreModule = require('../database-logic/firestore.js');
const euData = require('../data/eu-data.js');
const nodemailer = require('../nodemailer/nodemailer.js');

var response = {};
const richResponseV2Card = {
  'title': 'Title: this is a title',
  'subtitle': 'This is an subtitle.  Text can include unicode characters including emoji 📱.',
  'imageUri': 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  'buttons': [{
    'text': 'This is a button',
    'postback': 'https://assistant.google.com/'
  }]
};

const richResponsesV2 = [{
    'platform': 'ACTIONS_ON_GOOGLE',
    'simple_responses': {
      'simple_responses': [{
        'text_to_speech': 'Spoken simple response',
        'display_text': 'Displayed simple response'
      }]
    }
  },
  {
    'platform': 'ACTIONS_ON_GOOGLE',
    'basic_card': {
      'title': 'Title: this is a title',
      'subtitle': 'This is an subtitle.',
      'formatted_text': 'Body text can include unicode characters including emoji 📱.',
      'image': {
        'image_uri': 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png'
      },
      'buttons': [{
        'title': 'This is a button',
        'open_uri_action': {
          'uri': 'https://assistant.google.com/'
        }
      }]
    }
  },
  {
    'platform': 'FACEBOOK',
    'card': richResponseV2Card
  },
  {
    'platform': 'SLACK',
    'card': richResponseV2Card
  },
  {
    'platform': 'TELEGRAM',
    'card': richResponseV2Card
  }
];


module.exports = {

  handleRequest: function(request, res) {
    const agent = new WebhookClient({ request, response });

    // return new Promise((resolve, reject) => {
    //console.log("request", request.body);
    /*
    if (!request.body) { // do we really need this?
      console.error("Empty body in request");
      reject("Reject Promise: Empty body in request");
    }
    */
    // An action is a string used to identify what needs to be done in fulfillment
    let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default';
    // Parameters are any entites that Dialogflow has extracted from the request.
    let parameters = request.body.queryResult.parameters || {}; // https://dialogflow.com/docs/actions-and-parameters
    // Contexts are objects used to track and store conversation state
    let inputContexts = request.body.queryResult.contexts; // https://dialogflow.com/docs/contexts
    // Get the request source (Google Assistant, Slack, API, etc)
    let requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.source : undefined;
    // Get the session ID to differentiate calls from different users
    let session = (request.body.session) ? request.body.session : undefined;

    let intent = request.body.queryResult.intent.displayName; // toDo: is it cleaner to add here something in case it is undefined?


    /*
    // Create handlers for Dialogflow actions as well as a 'default' handler
    const actionHandlers = {
      // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
      'input.welcome': () => {
        sendResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
      },
      // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
      'input.unknown': () => {
        // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
        sendResponse('I\'m having trouble, can you try that again?'); // Send simple response to user
      },
      // Default handler for unknown or undefined actions
      'default': () => {
        this.getRandomTrumpQuoteV2().then((text) => {
          let responseToUser = {
            //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
            //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
            fulfillmentText: text
            //fulfillmentText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
          }
          sendResponse(responseToUser)
        });
      },
    };

    // If undefined or unknown action use the default handler
    if (!actionHandlers[action]) {
      action = 'default';
    }

    // Run the proper handler function to handle the request from Dialogflow
    actionHandlers[action]();
    */

    /*
        const intenHandlers = {
          // Do we really need another handler for this???
          'QUOTE_trump-quote': () => {
            console.log("intenHandler QUOTE_trump-quote called")
            this.getRandomTrumpQuoteV2().then((text) => {
              let responseToUser = {
                //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
                //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
                fulfillmentText: text
                //fulfillmentText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
              }
              sendResponse(responseToUser)
            });
          },
          'QUOTE_joke': () => {
            console.log("intenHandler QUOTE_joke called")
            let text = quoteModule.getRandomJoke();
            let responseToUser = {
              //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
              //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
              fulfillmentText: text
            }
            sendResponse(responseToUser);
          },
          'QUOTE_eu-fact': () => {
            console.log("intenHandlers called")
            let text = euInfoModule.getRandomEUFact();
            let responseToUser = {
              //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
              //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
              fulfillmentText: text
            }
            sendResponse(responseToUser);
          },

          'EU_abbreviation': () => {
            console.log("EU_abbreviation case: _________");
            console.log("parameters from dialogflow: ", parameters.abbreviations);
            firestoreModule.readFromFirestore('abbreviations', parameters.abbreviations).then(
              returnObject => {
                let text = returnObject.abbreviation + " is short for " + returnObject.meaning;
                console.log("Text that is being sent to user: ", text);
                let responseToUser = {
                  //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
                  //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
                  fulfillmentText: text
                }
                sendResponse(responseToUser);
              }
            )

          },

          'EU_abbreviation_random': () => {
            console.log("random EU_abbreviation case: _________");
            let randomAbbreviation = euData.randomEUAbbreviation();
            console.log("Random abbreviation is: ", randomAbbreviation);
            firestoreModule.readFromFirestore('abbreviations', randomAbbreviation).then(
              returnObject => {
                let text = returnObject.abbreviation + " is short for " + returnObject.meaning;
                console.log("Text that is being sent to user: ", text);
                let responseToUser = {
                  //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
                  //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
                  fulfillmentText: text
                }
                sendResponse(responseToUser);
              }
            )

          },
          'feedback': () => {
            console.log("feedback case: _________");
            console.log("parameters", parameters);
            // determine first how safe this is, then reactivate this function
            let feedbackText = parameters.any
            nodemailer.sendFeedbackMail(feedbackText);
            let responseToUser = {
              fulfillmentText: "Thanks a lot for your feedback. Your feedback has been delivered to the developer."
            }
            sendResponse(responseToUser);
          },
          'EU_meme': () => {
            console.log("feedback case: EU_meme");
            console.log("parameters", parameters);
            //let feedbackText = parameters.any
            // let text = "https://twitter.com/WhyEuropeORG/status/1071013711173832704/photo/1";
            let imgUri = euInfoModule.getRandomEUMeme();
            let richResponseV2Card = this.constructRichResponseV2Card('', '', imgUri, this.standardButtons);
            let richResponsesV2 = [{
              'platform': 'TELEGRAM',
              'card': richResponseV2Card
            }];
            let responseToUser = {
              fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable,
              // fulfillmentText: text,
            }
            sendResponse(responseToUser);

          },

        };
        */

    // Uncomment and edit to make your own intent handler
    // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // below to get this function to be run when a Dialogflow intent is matched
    function yourFunctionHandler(agent) {
      agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
      agent.add(new Card({
        title: `Title: this is a card title`,
        imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
        text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
        buttonText: 'This is a button',
        buttonUrl: 'https://assistant.google.com/'
      }));
      agent.add(new Suggestion(`Quick Reply`));
      agent.add(new Suggestion(`Suggestion`));
      agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' } });
    }

    function quoteTrump() {
      return new Promise((resolve, reject) => {
        console.log("intenHandler QUOTE_trump-quote called")
        quoteModule.getRandomTrumpQuote().then(
          (text) => {
            console.log("trump quote ", text);
            agent.add(text);
            resolve();
          });
        /*
        this.getRandomTrumpQuoteV2().then((resText) => {
          agent.add(resText);
          resolve();
          /*
          let responseToUser = {
            //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
            //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
            fulfillmentText: text
            //fulfillmentText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
          }
          sendResponse(responseToUser)
          
      });*/
      });
    }

    function quoteJoke() {
      console.log("intenHandler QUOTE_joke called")
      let text = quoteModule.getRandomJoke()
      agent.add(text);
      /*
      let responseToUser = {
        //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
        //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
        fulfillmentText: text
      }
      sendResponse(responseToUser);
      */
    }

    function quoteEUfact() {
      console.log("intenHandlers called")
      let text = euInfoModule.getRandomEUFact();
      console.log("joke respone text ", text)
      agent.add(text);
      /*
      let responseToUser = {
        //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
        //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
        fulfillmentText: text
      }
      sendResponse(responseToUser);
      */
    }

    function euAbreviation() {

      return new Promise((resolve, reject) => {
        console.log("EU_abbreviation case: _________");
        console.log("parameters from dialogflow: ", parameters.abbreviations);
        firestoreModule.readFromFirestore('abbreviations', parameters.abbreviations).then(
          returnObject => {
            let text = returnObject.abbreviation + " is short for " + returnObject.meaning;
            console.log("Text that is being sent to user: ", text);
            agent.add(text);
            /*
            let responseToUser = {
              //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
              //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
              fulfillmentText: text
            }
            sendResponse(responseToUser);
            */
          });
      });

    }

    function euAbreviationRandom() {
      return new Promise((resolve, reject) => {
        console.log("random EU_abbreviation case: _________");
        let randomAbbreviation = euData.randomEUAbbreviation();
        console.log("Random abbreviation is: ", randomAbbreviation);
        firestoreModule.readFromFirestore('abbreviations', randomAbbreviation).then(
          returnObject => {
            let text = returnObject.abbreviation + " is short for " + returnObject.meaning;
            console.log("Text that is being sent to user: ", text);
            agent.add(text);
            /*
            let responseToUser = {
              //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
              //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
              fulfillmentText: text
            }
            sendResponse(responseToUser);
            */
          });
      });

    }

    function feedback() {
      console.log("feedback case: _________");
      console.log("parameters", parameters);
      // determine first how safe this is, then reactivate this function
      let feedbackText = parameters.any
      nodemailer.sendFeedbackMail(feedbackText);
      agent.add("Thanks a lot for your feedback. Your feedback has been delivered to the developer.");
      /*
      let responseToUser = {
        fulfillmentText: "Thanks a lot for your feedback. Your feedback has been delivered to the developer."
      }
      sendResponse(responseToUser);
      */
    }

    function euMeme() {
      console.log("feedback case: EU_meme");
      console.log("parameters", parameters);
      //let feedbackText = parameters.any
      // let text = "https://twitter.com/WhyEuropeORG/status/1071013711173832704/photo/1";

      let imgUri = euInfoModule.getRandomEUMeme();
      agent.add(new Card({
        title: `EU Meme:`,
        imageUrl: imgUri
      }));
      /*
            agent.add(new Card({
        title: `Title: this is a card title`,
        imageUrl: imgUri,
        text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
        buttonText: 'This is a button',
        buttonUrl: 'https://assistant.google.com/'
      }));
      let richResponseV2Card = this.constructRichResponseV2Card('', '', imgUri, this.standardButtons);
      let richResponsesV2 = [{
        'platform': 'TELEGRAM',
        'card': richResponseV2Card
      }];
      let responseToUser = {
        fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable,
        // fulfillmentText: text,
      }
      sendResponse(responseToUser);
      */

    }

    /*
    if (!intent) {
      console.error("intent missing");
    }
    else {
      console.log("Fullfilling: ", intent);
      intenHandlers[intent]();
    }
    */


    /*
    // Function to send correctly formatted responses to Dialogflow which are then sent to the user
    function sendResponse(responseToUser) {
      // if the response is a string send it as a response to the user
      if (typeof responseToUser === 'string') {
        let responseJson = { fulfillmentText: responseToUser }; // displayed response
        //response.json(responseJson); // Send response to Dialogflow
        resolve(responseJson);
      }
      else {
        // If the response to the user includes rich responses or contexts send them to Dialogflow
        let responseJson = {};
        // Define the text response
        responseJson.fulfillmentText = responseToUser.fulfillmentText;
        // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
        if (responseToUser.fulfillmentMessages) {
          responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
        }
        // Optional: add contexts (https://dialogflow.com/docs/contexts)
        if (responseToUser.outputContexts) {
          responseJson.outputContexts = responseToUser.outputContexts;
        }
        // Send the response to Dialogflow
        console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
        //response.json(responseJson);
        resolve(responseJson);
      }
    }
    */


    let intentMap = new Map();
    //intentMap.set('Default Welcome Intent', welcome);
    //intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('QUOTE_trump-quote', quoteTrump);
    intentMap.set('QUOTE_joke', quoteJoke);
    intentMap.set('QUOTE_eu-fact', quoteEUfact);
    intentMap.set('EU_abbreviation', euAbreviation);
    intentMap.set('EU_abbreviation_random', euAbreviationRandom);
    intentMap.set('feedback', feedback);
    intentMap.set('EU_meme', euMeme);
    agent.handleRequest(intentMap);


    // })
  },

  constructRichResponseV2Card: function(title, subtitle, imageUri, buttons) {
    return {
      'title': title,
      'subtitle': subtitle,
      'imageUri': imageUri,
      'buttons': buttons

    }
  },

  standardButtons: [{
      'text': 'What?'
    },
    {
      'text': 'Who?'
    }, {
      'text': 'Why?'
    }, {
      'text': 'When?'
    }, {
      'text': 'How?'
    }, {
      'text': 'EU Meme'
    }, {
      'text': 'EU fact'
    }
  ],

  getRandomTrumpQuoteV2: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getRandomTrumpQuote().then(
        (text) => {
          resolve(text)
        }
      )
    })
  },

  getRandomJokeV2: function() {
    return quoteModule.getRandomJoke();
  }

}
