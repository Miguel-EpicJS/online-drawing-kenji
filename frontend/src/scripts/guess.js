import WORDS from "../../../backend/src/database/words";

const word = WORDS[Math.floor(Math.random() * WORDS.length)];

const compare = (guess) => {
  return word.variants.find((variant) => variant === guess);
};
