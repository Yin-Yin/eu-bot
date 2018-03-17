const quoteModule = require('../quotes/quotes.js')
var response = {}


// new Code
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
  }
];


module.exports = {

  handleRequest: function(request, res) {
    return new Promise((resolve, reject) => {
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
          let responseToUser = {
            //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
            //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
            fulfillmentText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
          };
          sendResponse(responseToUser);
        }
      };


      // If undefined or unknown action use the default handler
      if (!actionHandlers[action]) {
        action = 'default';
      }
      
      
      
      // Run the proper handler function to handle the request from Dialogflow
      actionHandlers[action]();
      
      
      // Function to send correctly formatted responses to Dialogflow which are then sent to the user
      function sendResponse(responseToUser) {
        // if the response is a string send it as a response to the user
        if (typeof responseToUser === 'string') {
          let responseJson = { fulfillmentText: responseToUser }; // displayed response
          response.json(responseJson); // Send response to Dialogflow
          return response;
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
          response.json(responseJson);
          return response;
        }
      }
    })
  },


  // old code

  // ## dialogflow intents ##
  getResponse: function(intentName, parameters, contexts) {
    return new Promise((resolve, reject) => {
      console.log("Triggerd intent: " + intentName + ".")

      switch (intentName) {
        case 'joke':
          resolve(this.getRandomJoke())
          break;

        case 'chuck-norris':
          resolve(this.getRandomChuckNorris())
          break;

        case 'quote':
          resolve(this.getForismaticQuote())
          break;

        case 'startup':
          resolve(this.getStartupIdea())
          break;

        case 'programming':
          resolve(this.getProgrammingQuote())
          break;

        case 'trump-quote':
          resolve(this.getRandomTrumpQuote())
          break;

        case 'yes-no':
          resolve(this.getYesOrNo())
          break;

        case 'number-trivia':
          resolve(this.getNumberTrivia())
          break;

        case 'year-trivia':
          resolve(this.getYearTrivia())
          break;

        case 'cat-fact':
          resolve(this.getCatFact())
          break;

        case 'dog-fact':
          resolve(this.getDogFact())
          break;

        default:
          console.log("Something went wrong. The default switch case was triggered. This means there was a intent triggered from api.ai that is not yet implemented in the webhook You triggered the intent: " + intentName + ", with the parameters: " + parameters)
          reject("Something went wrong. Sorry about that.")
          break;
      }
    })
  },

  // ### Build the responses (messages, pictures and quick replies) for the intents ### 

  /*
  Fetch a quote from an API.
  */
  getRandomJoke: function() {
    let text = quoteModule.getRandomJoke();
    console.log("quoteModule.getRandomJoke()", text);
    return this.getSimpleResponse(text)
  },

  getRandomChuckNorris: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getRandomChuckNorris().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getForismaticQuote: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getForismaticQuote().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getStartupIdea: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getStartupIdea().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getProgrammingQuote: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getProgrammingQuote().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getRandomTrumpQuote: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getRandomTrumpQuote().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getNumberTrivia: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getNumberTrivia().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getYearTrivia: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getYearTrivia().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getCatFact: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getCatFact().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getDogFact: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getDogFact().then(
        (text) => {
          resolve(this.getSimpleResponse(text))
        }
      )
    })
  },

  getYesOrNo: function() {
    return new Promise((resolve, reject) => {
      quoteModule.getYesOrNo().then(
        (resultObject) => {
          response.speech = resultObject.text;
          response.displayText = resultObject.text;
          response.messages = [this.getResponseMessageObject(resultObject.text), this.getImageObject(resultObject.imageUrl), this.getQuickRepliesObject("More?", ["Quote", "Chuck Norris Fact", "Programming Quote", "Trump Quote", "Cat Fact", "Dog Fact", "Random number fact", "Random year fact", "yes or no?"])]
          resolve(response)
        }
      )
    })
  },

  // ### construct the reponse objects for dialogflow ###

  getSimpleResponse: function(text) {
    return {
      "speech": text,
      "displayText": text,
      "messages": [this.getResponseMessageObject(text), this.getQuickRepliesObject(":)", ["Quote", "Chuck Norris Fact", "Programming Quote", "Trump Quote", "Cat Fact", "Dog Fact", "Random number fact", "Random year fact", "yes or no?"])]
    }
  },

  getResponseMessageObject: function(messageText) { // may be it would be better to call this a more specific name: like getResponseMessageObjectObject - because what we are doing here is creating an object!
    return {
      "type": 0,
      "speech": messageText
    }
  },

  getQuickRepliesObject: function(title, replies) {
    return {
      "type": 2,
      "title": title,
      "replies": replies
    }
  },

  getImageObject: function(imageUrl) {
    return {
      "type": 3,
      "imageUrl": imageUrl
    }
  },

  getContextOutObject: function(name, paremeters, lifespan) {
    return {
      "name": name,
      "parameters": paremeters,
      "lifespan": lifespan
    }
  },
}
