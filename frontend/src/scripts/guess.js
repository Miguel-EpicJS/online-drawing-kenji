import WORDS from "../../../backend/src/database/words";

export const word = WORDS[Math.floor(Math.random() * WORDS.length)];

export const verifyGuess = (guess, payload) => {
  if (guess.split(" ").length > 1) {
    return {
      message: "Dê palpites de apenas uma palvra!",
      action: "write",
      isCorrect: false,
    };
  }
  const compare = (guess) => {
    const newGuess = String(guess);
    return word.variants.find((variant) => variant === newGuess.toLowerCase());
  };

  if (!compare(guess) || compare(guess) === undefined) {
    return { message: "Jogador venceu!", action: "write", isCorrect: true };
  } else {
    return { message: undefined, action: "none", isCorrect: false };
  }
};
