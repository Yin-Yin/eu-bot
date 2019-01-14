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

    function quoteTrump() {
      return new Promise((resolve, reject) => {
        console.log("intenHandler QUOTE_trump-quote called")
        quoteModule.getRandomTrumpQuote().then(
          (text) => {
            console.log("trump quote ", text);
            agent.add(text);
            addStandardButtons();
            resolve();
          });
      });
    }

    function quoteJoke() {
      console.log("intenHandler QUOTE_joke called")
      let text = quoteModule.getRandomJoke()
      agent.add(text);
      addStandardButtons();
    }

    function quoteEUfact() {
      console.log("intenHandlers called")
      let text = euInfoModule.getRandomEUFact();
      console.log("joke respone text ", text)
      agent.add(text);
      addStandardButtons();
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
            addStandardButtons();
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
            addStandardButtons();
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
      addStandardButtons();
    }

    function euMeme() {
      console.log("feedback case: EU_meme");
      console.log("parameters", parameters);
      let imgUri = euInfoModule.getRandomEUMeme();
      agent.add(new Card({
        title: `EU Meme:`,
        imageUrl: imgUri
      }));
      addStandardButtons();
    }

    function electionWhat() {
      agent.add(new Card({
        title: `What to vote?`,
        text: "Every five years EU citizens choose who represents them in the European Parliament, the directly-elected institution that holds up their interests in the EU decision-making process. Voting practices vary across the EU, but there are also some common elements. The next Elections to the European Parliament are held on May 23 to 26 2019.",
        buttonText: '[Video]: The European parliament in 40 seconds',
        buttonUrl: 'https://www.youtube.com/watch?v=BNlk64E4Fco'
      }));
      //agent.add("https://www.youtube.com/watch?v=BNlk64E4Fco");
      addStandardButtons();
    }

    function electionWho() {
      agent.add(new Card({
        title: `Who to vote?`,
        text: "Elections are contested by national political parties but once MEPs are elected, most opt to become part of transnational political groups. Most national parties are affiliated to a European-wide political party.\n  Which of these European groupings will exert greater influence in the next legislative term (2019-2024)? This is the big question on election night and depends who gets elected by citizens like you and me (ok, I am bot…). So, it is up to you!",
        //buttonText: '[Video]: How do MEPs represent me?',
        //buttonUrl: 'https://www.youtube.com/watch?v=a6yEdZMFlIU'
      }));
      agent.add("https://www.youtube.com/watch?v=a6yEdZMFlIU");
      addStandardButtons();
    }

    function electionHow() {
      agent.add(new Card({
        title: `How to vote?`,
        text: "The European elections is about selecting who you want to represent you as a Member of the European Parliament (MEP) and defend your interests in the EU. Not only can MEPs shape and decide on new legislation, they also vote on new trade agreements, scrutinise the EU institutions and how your tax money is spent, as well as launch investigations into specific issues.\n \n Basically, you need to be an EU citizen and be at least 18 years old. However, there can be more specific regulations depending on the EU member state you reside in.",
        imageUrl: "http://www.europarl.europa.eu/resources/library/images/20181018PHT16579/20181018PHT16579_original.png",
        buttonText: '[Open Graphic] 2019 election rules',
        buttonUrl: 'http://www.europarl.europa.eu/resources/library/images/20181018PHT16579/20181018PHT16579_original.png'
      }));
      addStandardButtons();
    }

    function electionWhen() {
      agent.add(new Card({
        title: `When to vote?`,
        text: "Countries in the EU have different voting traditions and each one may decide on the exact election day within a four-day span, from Thursday (the day on which the UK and the Netherlands usually vote) to Sunday (when most countries hold their elections). In 2019 it will be from May 23-26 2019.",
        buttonText: '[Open Video] Get ready to vote in the European elections!',
        buttonUrl: 'https://www.youtube.com/watch?v=RTj7KWPajsY'
      }));
      addStandardButtons();
    }


    function helpFun() {
      console.log("feedback case: help_fun");
      agent.add(new Suggestion(`EU meme`));
      agent.add(new Suggestion(`EU fact`));
      agent.add(new Suggestion(`Joke`));
      agent.add(new Suggestion(`Trump quote`));
    }



    function addStandardButtons() {
      agent.add(new Suggestion(`Help`));
      agent.add(new Suggestion(`What?`));
      agent.add(new Suggestion(`Who?`));
      agent.add(new Suggestion(`Why?`));
      agent.add(new Suggestion(`When?`));
      agent.add(new Suggestion(`How?`));
      agent.add(new Suggestion(`Fun`));
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
    intentMap.set('ELECTION_what', electionWhat);
    intentMap.set('ELECTION_how', electionHow);
    intentMap.set('ELECTION_when', electionWhen);


    agent.handleRequest(intentMap);

  },


}
