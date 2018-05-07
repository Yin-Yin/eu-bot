# EU Bot #

Webhook for a bot about EU questions.


Current functionality: 
- __EU Parliament Election__ The bot can give you some information about the vote of the election of the European parliament. _Example:_ "Why should I vote?"
- __EU facts__ Gives you some trivia about Europe. _Example:_ "eu fact"
- __Abbreviation__ Let the bot explain you a abbreviation that you give him. _Example:_ "MEP". 
- __Random Abbreviation__ Ask the bot for a random abbreviation from the EU and he will give you a random abbreviation. _Example:_ "Random abbreviation"
- __Trump Quote__ Ask the bot for a trump quote and he will reply with a random Trump quote. _Example:_ "trump quote"
- __Small Talk__ The bot knows some small talk.

__Possible improvements__


__toDos__
- enhance the information about the eu parliament election, make the dialog more natural, add outputContexts to make it like a tutorial
- add some entertaining information (brainstorm what that could be) - have a reason why the users should use the bot
    - country guessing game
- activate the existing features that are in the code already (also decide which are needed)
- use richResponses to make it possible to easily add more plattforms
- add a contact possibility through nodemailer
- code cleaning


__Challentes__
- Finding adequate use cases that give value to the user is quite difficult
- the website of the eu-open data portal is often down

__ideas__
- Use the thesaurus of the European Union: http://eurovoc.europa.eu/drupal/ 
- get some interesting data from the EU Open Data Portal http://data.europa.eu/euodp/en/developerscorner

__Lessons learned__
- While starting the project I didn`t do a lot of research and didn't put a lot of thought into the planning. I just thought it is a great idea and started working. Right now I question wether the bot is really useful for any target audience. 
    - There are two audiences the bot might be interesting for: 
        - specialised workers in the EU that need help with detailed questions that the bot might be able to answer. (it gives abbreviations which is nice, but not sufficient, I assume)
        - an EU citizen that wants to get more information about the EU ( -> it doesn't appeal enough to a normal citizen. An interesting incenctive is missing. Why should I use the bot?)
