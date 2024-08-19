import isBookmarkExpression from "../misc/isBookmarkExpression";

// doesn't remove punctuation when it is part of a word, e.g. "l'Italie" or "it's"
function removePunctuation(string) {
  let removeLeadingPunctuation =
    /(\s|^)[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]+/g;
  let removeTrailingPunctuation =
    /[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]+(\s|$)/g;
  return string
    .replace(removeLeadingPunctuation, "")
    .replace(removeTrailingPunctuation, "");
}

function tokenize(sentence) {
  return sentence.split(" ");
}

function isExpression(word) {
  return word.includes(" ");
}

function isWordInSentence(word, sentence) {
  if (isExpression(word)) {
    return sentence.includes(word);
  }
  let tokens = tokenize(sentence);
  tokens = tokens.map((each) => removePunctuation(each));
  return tokens.includes(removePunctuation(word));
}

export { tokenize, removePunctuation, isWordInSentence, isExpression };
