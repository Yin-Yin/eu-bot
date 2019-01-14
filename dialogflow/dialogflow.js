'use strict';
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

const quoteModule = require('../functional-logic/quotes/quotes.js');
const euInfoModule = require('../functional-logic/eu-info/eu-info.js');
const firestoreModule = require('../database-logic/firestore.js');
const euData = require('../data/eu-data.js');
const nodemailer = require('../nodemailer/nodemailer.js');

module.exports = {

  handleRequest: function(request, response) {
    const agent = new WebhookClient({ request, response });

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
    */

    function quoteTrump() {
      return new Promise((resolve, reject) => {
        console.log("intenHandler QUOTE_trump-quote called")
        quoteModule.getRandomTrumpQuote().then(
          (text) => {
            console.log("trump quote ", text);
            agent.add(text);
            this.addStandardButtons();
            resolve();
          });
      });
    }

    function quoteJoke() {
      console.log("intenHandler QUOTE_joke called")
      let text = quoteModule.getRandomJoke()
      agent.add(text);
      this.addStandardButtons();
    }

    function quoteEUfact() {
      console.log("intenHandlers called")
      let text = euInfoModule.getRandomEUFact();
      console.log("joke respone text ", text)
      agent.add(text);
      this.addStandardButtons();
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
            this.addStandardButtons();
            resolve();
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
            this.addStandardButtons();
            resolve();
          });
      });

    }

    function feedback() {
      console.log("feedback case: _________");
      console.log("parameters", parameters);
      let feedbackText = parameters.any
      nodemailer.sendFeedbackMail(feedbackText);
      agent.add("Thanks a lot for your feedback. Your feedback has been delivered to the developer.");
      this.addStandardButtons();
    }

    function euMeme() {
      console.log("feedback case: EU_meme");
      console.log("parameters", parameters);
      let imgUri = euInfoModule.getRandomEUMeme();
      agent.add(new Card({
        title: `EU Meme:`,
        imageUrl: imgUri
      }));
      this.addStandardButtons();
    }

    function helpFun() {
      console.log("feedback case: help_fun");
      agent.add(new Suggestion(`EU meme`));
      agent.add(new Suggestion(`EU fact`));
      agent.add(new Suggestion(`Joke`));
      agent.add(new Suggestion(`Trump quote`));
    }

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
    intentMap.set('help_fun', helpFun);


    agent.handleRequest(intentMap);

  },

  addStandardButtons: function(agent) {
    agent.add(new Suggestion(`Help`));
    agent.add(new Suggestion(`What?`));
    agent.add(new Suggestion(`Who?`));
    agent.add(new Suggestion(`Why?`));
    agent.add(new Suggestion(`When?`));
    agent.add(new Suggestion(`How?`));
    agent.add(new Suggestion(`Fun`));
  },
}
