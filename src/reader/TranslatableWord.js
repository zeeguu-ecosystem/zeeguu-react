import { useState } from "react";
import { useClickOutside } from "react-click-outside-hook";
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
  const [showingAlterMenu, setShowingAlterMenu] = useState(false);
  const [refToTranslation, clickedOutsideTranslation] = useClickOutside();

  function clickOnWord(e, word) {
    if (word.translation) {
      interactiveText.pronounce(word);
      return;
    }
    if (translating) {
      e.target.className = "loading";
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

  function toggleAlterMenu(e, word) {
    if (showingAlterMenu) {
      setShowingAlterMenu(false);
      return;
    }
    interactiveText.alternativeTranslations(word, () => {
      wordUpdated(word);
      setShowingAlterMenu(!showingAlterMenu);
    });
  }

  function selectAlternative(alternative, preferredSource) {
    interactiveText.selectAlternative(
      word,
      alternative,
      preferredSource,
      () => {
        wordUpdated();
        setShowingAlterMenu(false);
      },
    );
  }

  function hideAlterMenu() {
    setShowingAlterMenu(false);
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
          ref={refToTranslation}
          onClick={(e) => toggleAlterMenu(e, word)}
        >
          <span className="arrow">▼</span>
        </z-tran>

        <z-orig>
          <span onClick={(e) => clickOnWord(e, word)}>{word.word} </span>
          {showingAlterMenu && (
            <AlterMenu
              word={word}
              setShowingAlternatives={setShowingAlterMenu}
              selectAlternative={selectAlternative}
              hideAlterMenu={hideAlterMenu}
              clickedOutsideTranslation={clickedOutsideTranslation}
              hideTranslation={hideTranslation}
            />
          )}
        </z-orig>
      </z-tag>
    </>
  );
}
