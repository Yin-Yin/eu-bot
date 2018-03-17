# EU Bot #

Webhook for a EU bot. Based on the quoteBot project.


Current functionality: 
    -Trump Quote
    -Joke


Demo: https://bot.dialogflow.com/ ...


This is what the bot can do at the moment: 
- __Quote__ Get a  random inspirational quote. from API: http://forismatic.com/en/api/ _Example:_ "quote"
- __Programming Quote__ Get a random programming quote. from API: http://quotes.stormconsultancy.co.uk/api _Example:_ "programming", "programmer"
- __Trump Quote__ Get a random Trump quote. from API: https://whatdoestrumpthink.com/api-docs/index.html#introduction _Example:_ "Trump"
- __Chuck Nottis Fact__ from API: https://api.chucknorris.io/#! (alternative: http://www.icndb.com/api/ or https://www.programmableweb.com/api/chuck-norris-facts) "chuck norris"
- __Start Up Idea__ from API: http://itsthisforthat.com/ "startup"
- __Cat Fact__ from: https://catfact.ninja/ "cat", "cat fact"
- __Dog Fact__ from: https://fact.birb.pw/ "dog", "dog fact"
- __Random Year Fact__ from: http://numbersapi.com/#random/trivia "year"
- __Random Number Fact__ from: http://numbersapi.com/#random/trivia "number"
- __Yes or no__ from: https://yesno.wtf/#api "yes or no", "yes", "no"

__Possible improvements__
- Add some more content with maps
- Reduce size of functions, eliminate duplicate code

__toDo__
- The current api to fetch quotes causes sometimes bugs because the parsing of their json: they have characters like "'" or spaces that cause problems. -> Use different API to avoid-

more quote APIs that could be used
- https://theysaidso.com/api/ TheySaidSo Famous Quotes API
- https://www.forbes.com/forbesapi/thought/uri.json?enrich=true&query=1&relatedlimit=1
- https://en.wikiquote.org/w/api.php
- https://talaikis.com/random_quotes_api/
