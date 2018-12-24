
const euFactsMap = new Map();
euFactsMap.set(1, 'The etymology for the word “Europe” is uncertain up to the present time. Some people like to think that it came from Europa, one of Zeus’s many wives in Greek mythology.');
euFactsMap.set(2, 'With a land area of only 4,000,000 square miles, Europe is the second smallest continent in the world, just behind Australia.');
euFactsMap.set(3, 'Europe’s most visited tourist destination is neither the Eiffel Tower nor the Big Ben, but Disneyland in Paris.');
euFactsMap.set(4, "Europe is technically not a continent. It's separation from Asia was actually a Greek idea.");
euFactsMap.set(5, 'The Dark Ages in Europe lasted for twice as long as the United States has been a nation');
//euFactsMap.set(6, '');
//euFactsMap.set(7, '');
//euFactsMap.set(8, '');

const euMemeMap = new Map();
euMemeMap.set(1, 'The Dark Ages in Europe lasted for twice as long as the United States has been a nation');

module.exports = {
 
   getRandomEUFact: function() {
    let randomNumberOfFact = Math.floor(Math.random() * euFactsMap.size) + 1;
    console.log("randomNumberOfJoke: ", randomNumberOfFact);
    console.log("jokesMap.size: ", euFactsMap.size);
    return euFactsMap.get(randomNumberOfFact); // get a random joke from the jokesMap
  },
  
  getRandomEUMeme: function() {
    return "https://twitter.com/WhyEuropeORG/status/1071013711173832704/photo/1";
      
  },
    
}