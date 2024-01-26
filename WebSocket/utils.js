export function getRandomItems(array, count) {
  const shuffled = array.slice(); // Make a copy of the original array
  let currentIndex = shuffled.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Swap it with the current element
    temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }

  return shuffled.slice(0, count); // Return the first 'count' elements
}

export const shuffleBottles = (array) => { 
  return array.sort(() => Math.random() - 0.5);  
}; 