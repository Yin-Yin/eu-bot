# EU Vote Bot #

A chatbot that educates users about the elections of the European Parliament.

This is the NodeJS webhook for dialogflow.

## Integrations
Telegram: __[@euVoteBot](http://t.me/euVoteBot)__

## What is the EU Vote Bot?
A chatbot that helps EU citizens to inform themselves about the European Parliament elections in an interactive, new and entertaining format.  
We believe that the make or break of this bot lies in making the most simple and pleasant user experience possible.

## Vision
To apply our skills (IT development) and knowledge (EU affairs) to offer EU citizens an additional and interactive source of information on the European Parliament elections and encourage citizens to cast their vote. 


## Current functionality: 
- __Why? Who? How? When? What?__ The main functionality of the bot is to provide information about the next election of the European parliament. _Example:_ "Why should I vote?", "When", "How to vote"

- __Abbreviation__ Let the bot explain you a abbreviation that you give him. _Example:_ "MEP". 
- __Random Abbreviation__ Ask the bot for a random abbreviation from the EU and he will give you a random abbreviation. _Example:_ "Random abbreviation"

### Fun
- __EU meme__ Gives you a meme about why Europe is a great idea. _Example:_ "eu meme"
- __EU facts__ Gives you some trivia about Europe. _Example:_ "eu fact"
- __Small Talk__ The bot knows some small talk. Try to ask it some questions. _Example:_ "How are you?"

### General
- __Help__ Explains the bot. _Example:_ "help". 
- __Feedback__ Give the developers feedback. 


## Technical details
We use dialogflow to parse the user input and a node.js server hosted on Heroku to host the business logic.

## Data Privacy
At the moment we use the dialogflow chat engine. We let dialogflow store the bot messages to analyse where the bot needs improvement.

## Work in progress 

__toDos__
- enhance the information about the eu parliament election, make the dialog more natural, add outputContexts to make it like a tutorial
- add some entertaining information (brainstorm what that could be) - have a reason why the users should use the bot
    - country guessing game
- activate the existing features that are in the code already (also decide which are needed)

- Find a name for the chatbot, personalize the experience
- Expand and finetune the dialogue/smalltalk capabilities -> train the bot
- Test and get user feedback
- Define a strategy on how to spread the bot

- Get more information about the voting process and finetune the answer texts 
- Define the scope of the chatbot
- Add EU facts 
- Search for duplicates in abbreviation list

__Challenges__
- Varying information about the voting process. The voting process and rules differ between EU Member States and subject to changes
- Inaccessibility of the EU developer portal
- Language variety and adaption to national contexts 

__ideas__
- Use the thesaurus of the European Union: http://eurovoc.europa.eu/drupal/ 
- get some interesting data from the EU Open Data Portal http://data.europa.eu/euodp/en/developerscorner


