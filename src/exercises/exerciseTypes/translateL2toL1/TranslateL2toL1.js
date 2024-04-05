import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import exerciseTypes from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import NextNavigation from "../NextNavigation.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import BottomInput from "../BottomInput.js";
import LearningCycleIndicator from "../../LearningCycleIndicator.js";

// The user has to translate the L2 word in bold to their L1.
// This tests the user's active knowledge.

const EXERCISE_TYPE = exerciseTypes.translateL2toL1;

export default function TranslateL2toL1({
  api,
  bookmarksToStudy,
  correctAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isCorrect,
  setIsCorrect,
  moveToNextExercise,
  toggleShow,
  reload,
  setReload,
  exerciseSessionId,
  activeSessionDuration,
}) {
  const [messageToAPI, setMessageToAPI] = useState("");
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
  const speech = useContext(SpeechContext);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setInteractiveText(
      new InteractiveText(
        bookmarksToStudy[0].context,
        bookmarksToStudy[0].from_lang,
        bookmarksToStudy[0].article_id,
        api,
        "TRANSLATE WORDS IN EXERCISE",
        EXERCISE_TYPE,
        speech,
      ),
    );
  }, []);

  function handleShowSolution(e, message) {
    e.preventDefault();
    let concatMessage;
    if (!message) {
      concatMessage = messageToAPI + "S";
    } else {
      concatMessage = message;
    }

    notifyIncorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    setMessageToAPI(concatMessage);                        
    api.uploadExerciseFinalizedData(
      concatMessage,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    correctAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId
    );
  }

  function handleIncorrectAnswer() {
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(bookmarksToStudy[0]);
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="translateL2toL1">
      <div className="headlineWithMoreSpace">
        {strings.translateL2toL1Headline}
      </div>
      <div className="learningCycleIndicator">
        <LearningCycleIndicator
          learningCycle={bookmarksToStudy[0].learning_cycle}
          coolingInterval={bookmarksToStudy[0].cooling_interval}
        />
      </div>
      <div className="contextExample">
                <TranslatableText
                    isCorrect={isCorrect}
                    interactiveText={interactiveText}
                    translating={true}
                    pronouncing={false}
                    translatedWords={translatedWords}
                    setTranslatedWords={setTranslatedWords}
                    bookmarkToStudy={bookmarksToStudy[0].from}
                    boldWord={bookmarksToStudy[0].from}
                />
            </div>
      
      {!isCorrect && (
        <>
            <BottomInput
                handleCorrectAnswer={handleCorrectAnswer}
                handleIncorrectAnswer={handleIncorrectAnswer}
                bookmarksToStudy={bookmarksToStudy}
                messageToAPI={messageToAPI}
                setMessageToAPI={setMessageToAPI}
                isL1Answer={true}
            />
        </>
      )}
      {isCorrect && (
        <>
            <h1 className="wordInContextHeadline">{bookmarksToStudy[0].to}</h1>   
        </>
        )}

      <NextNavigation
        message={messageToAPI}
        api={api}
        bookmarksToStudy={bookmarksToStudy}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={(e) => handleShowSolution(e, undefined)}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </s.Exercise>
  );
}