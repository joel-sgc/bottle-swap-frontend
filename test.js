function isDerangement(arr1, arr2) {
  return arr1.every((value, index) => value !== arr2[index]);
}

function getBottle(arr) {
  const original = [...arr];
  let derangement = [...arr];

  do {
      derangement = derangement.sort(() => Math.random() - 0.5);
  } while (!isDerangement(original, derangement));

  return derangement;
}