import { useState } from "react";
import AlterMenu from "./AlterMenu";

export default function TranslatableWord({
  interactiveText,
  word,
  wordUpdated,
  translating,
  pronouncing,
  translatedWords,
  setTranslatedWords,
  disableTranslation,
}) {
  const [showingAlternatives, setShowingAlternatives] = useState(false);

  function clickOnWord(e, word) {
    if (word.translation) {
      interactiveText.pronounce(word);
      return;
    }
    e.target.className = "loading";
    if (translating) {
      interactiveText.translate(word, () => {
        wordUpdated();
        e.target.className = null;
      });
      if (translatedWords) {
        let copyOfWords = [...translatedWords];
        copyOfWords.push(word.word);
        setTranslatedWords(copyOfWords);
      }
    }
    if (pronouncing) {
      interactiveText.pronounce(word);
    }
  }

  function toggleAlternatives(e, word) {
    if (showingAlternatives) {
      setShowingAlternatives(false);
      return;
    }
    interactiveText.alternativeTranslations(word, () => {
      wordUpdated(word);
      setShowingAlternatives(!showingAlternatives);
    });
  }

  function selectAlternative(alternative, preferredSource) {
    interactiveText.selectAlternative(
      word,
      alternative,
      preferredSource,
      () => {
        wordUpdated();
        setShowingAlternatives(false);
      },
    );
  }

  function clickedOutsideAlterMenu() {
    setShowingAlternatives(false);
  }

  function hideTranslation(e, word) {
    console.log(word);
    word.translation = undefined;
    word.splitIntoComponents();
    wordUpdated();
  }

  //disableTranslation so user cannot translate words that are being tested
  if (!word.translation || disableTranslation) {
    return (
      <>
        <z-tag onClick={(e) => clickOnWord(e, word)}>{word.word + " "}</z-tag>
      </>
    );
  }
  return (
    <>
      <z-tag>
        <z-tran
          chosen={word.translation}
          translation0={word.translation}
          onClick={(e) => toggleAlternatives(e, word)}
        >
          <span className="arrow">▼</span>
        </z-tran>
        <z-orig>
          <span onClick={(e) => clickOnWord(e, word)}>{word.word} </span>
          {showingAlternatives && (
            <AlterMenu
              word={word}
              setShowingAlternatives={setShowingAlternatives}
              selectAlternative={selectAlternative}
              clickedOutsideAlterMenu={clickedOutsideAlterMenu}
              hideTranslation={hideTranslation}
            />
          )}
        </z-orig>
      </z-tag>
    </>
  );
}
