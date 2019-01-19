// toDo: make this as arrays?!

const euFactsMap = new Map();
euFactsMap.set(1, 'The etymology for the word “Europe" is uncertain up to the present time. Some people like to think that it came from Europa, one of Zeus’s many wives in Greek mythology.');
euFactsMap.set(2, 'With a land area of only 4,000,000 square miles, Europe is the second smallest continent in the world, just behind Australia.');
euFactsMap.set(3, 'Europe’s most visited tourist destination is neither the Eiffel Tower nor the Big Ben, but Disneyland in Paris.');
euFactsMap.set(4, "Europe is technically not a continent. It's separation from Asia was actually a Greek idea.");
euFactsMap.set(5, 'The Dark Ages in Europe lasted for twice as long as the United States has been a nation');
//euFactsMap.set(6, '');
//euFactsMap.set(7, '');
//euFactsMap.set(8, '');

const euMemeMap = new Map();
euMemeMap.set(0, 'https://pbs.twimg.com/media/Dt0BS1-XcAAMFHa?format=jpg&name=medium');
euMemeMap.set(1, 'https://pbs.twimg.com/media/Dus9GAIWoAA-7i5?format=jpg&name=small');
euMemeMap.set(2, 'https://pbs.twimg.com/media/DuYiLQOXQAEdwS-?format=jpg&name=small');
euMemeMap.set(3, 'https://pbs.twimg.com/media/DuJqnS6W0AE0A9L?format=jpg&name=small');
euMemeMap.set(4, 'https://pbs.twimg.com/media/DtONyb-WwAAmlwi?format=jpg&name=medium');
euMemeMap.set(5, 'https://pbs.twimg.com/media/DtJPaI5XcAA0MlU?format=jpg&name=small');
euMemeMap.set(6, 'https://pbs.twimg.com/media/DtGtJY0X4AATk2T?format=jpg&name=medium');
euMemeMap.set(7, 'https://pbs.twimg.com/media/DtFpK70XoAAWeYJ?format=jpg&name=small');
euMemeMap.set(8, 'https://pbs.twimg.com/media/Dssew-kXQAQHxMM?format=jpg&name=small');
euMemeMap.set(9, 'https://pbs.twimg.com/media/DscrNyvX4AAqHTn?format=jpg&name=small');
euMemeMap.set(10, 'https://pbs.twimg.com/media/DsDvzDCX0AYA4rM?format=jpg&name=small');
euMemeMap.set(11, 'https://pbs.twimg.com/media/Dr-d9IgWoAEmyah?format=jpg&name=small');
euMemeMap.set(12, 'https://pbs.twimg.com/media/DrkCQW8XgAEcRtu?format=jpg&name=medium');
euMemeMap.set(13, 'https://pbs.twimg.com/media/DrJvjc7WoAAVfB3?format=jpg&name=medium');
euMemeMap.set(14, 'https://pbs.twimg.com/media/DrEWZC4XgAArFcy?format=jpg&name=small');
euMemeMap.set(15, 'https://pbs.twimg.com/media/Dq_BlzpU8AAMne5?format=jpg&name=small');
euMemeMap.set(16, 'https://pbs.twimg.com/media/DqRqjUdXgAAOWmW?format=jpg&name=small');
euMemeMap.set(17, 'https://pbs.twimg.com/media/DpP-wZwXcAAPTx8?format=jpg&name=small');
euMemeMap.set(18, 'https://pbs.twimg.com/media/DpUuE9tX4AUF6ja?format=jpg&name=small');
euMemeMap.set(19, 'https://pbs.twimg.com/media/DnhN4WYXsAA_8-M?format=jpg&name=small');
euMemeMap.set(20, 'https://pbs.twimg.com/media/DolNPQKW0AATJ6w?format=jpg&name=small');

const euWhyImgs = [
    "https://pbs.twimg.com/media/DvvRthIXgAIZJhQ.jpg:large",
    "https://pbs.twimg.com/media/DwoAO5LWsAAcX7x.jpg:large",
    "https://pbs.twimg.com/media/DvraD7CX0AMic0-.jpg:large ",
    "https://pbs.twimg.com/media/Dt0BS1-XcAAMFHa?format=jpg&name=medium ",
    "https://pbs.twimg.com/media/Dus9GAIWoAA-7i5?format=jpg&name=small ",
    "https://pbs.twimg.com/media/DuJqnS6W0AE0A9L?format=jpg&name=small",
    "https://pbs.twimg.com/media/DscrNyvX4AAqHTn?format=jpg&name=small",
    "https://pbs.twimg.com/media/Dr-d9IgWoAEmyah?format=jpg&name=small",
    "https://pbs.twimg.com/media/DrJvjc7WoAAVfB3?format=jpg&name=medium"
];


module.exports = {

    getRandomEUFact: function() {
        let randomNumberOfFact = Math.floor(Math.random() * euFactsMap.size) + 1;
        console.log("randomNumberOfJoke: ", randomNumberOfFact);
        console.log("jokesMap.size: ", euFactsMap.size);
        return euFactsMap.get(randomNumberOfFact); // get a random joke from the jokesMap
    },

    getRandomEUMeme: function() {
        let randomNumberOfMeme = Math.floor(Math.random() * euMemeMap.size);
        console.log("randomNumberOfEUMeme: ", randomNumberOfMeme);
        console.log("jokesMap.size: ", euFactsMap.size);
        return euMemeMap.get(randomNumberOfMeme);

    },

    getRandomEUWhy: function() {
        let randomNumberOfWhy = Math.floor(Math.random() * euWhyImgs.size);
        console.log("randomNumberOfWhy: ", randomNumberOfWhy);
        console.log("jokesMap.size: ", euWhyImgs.size);
        return euWhyImgs[randomNumberOfWhy];

    },

}
