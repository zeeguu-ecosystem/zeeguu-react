import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions";
import shuffle from "../../../assorted/fisherYatesShuffle";
import {
  EXERCISE_TYPES,
  PRONOUNCIATION_SETTING,
} from "../../ExerciseTypeConstants.js";
import LearningCycleIndicator from "../../LearningCycleIndicator.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import NextNavigation from "../NextNavigation";
import MatchInput from "./MatchInput.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import { toast } from "react-toastify";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression.js";
import LocalStorage from "../../../assorted/LocalStorage.js";

// The user has to match three L1 words to their correct L2 translations.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.match;

export default function Match({
  api,
  bookmarksToStudy,
  notifyCorrectAnswer,
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
  // ML: TODO: this duplicates a bit the information in bookmarksToStudy
  // It should be possible to implement with a simple array of messageToAPI that will
  // always be in sync with bookmarksToStudy, i.e. messageToAPI[0] refers to the state of bookmarksToStudy[0], etc.
  const initialExerciseAttemptsLog = [
    {
      bookmark: bookmarksToStudy[0],
      messageToAPI: "",
    },
    {
      bookmark: bookmarksToStudy[1],
      messageToAPI: "",
    },
    {
      bookmark: bookmarksToStudy[2],
      messageToAPI: "",
    },
  ];

  const [messageToNextNav, setMessageToNextNav] = useState("");
  const [firstPressTime, setFirstPressTime] = useState();
  const [exerciseAttemptsLog, setexerciseAttemptsLog] = useState(
    initialExerciseAttemptsLog,
  );
  const [fromButtonOptions, setFromButtonOptions] = useState(null);
  const [toButtonOptions, setToButtonOptions] = useState(null);
  const [buttonsToDisable, setButtonsToDisable] = useState([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [lastCorrectBookmarkId, setLastCorrectBookmarkId] = useState(null);
  const [selectedBookmark, setSelectedBookmark] = useState();
  const [selectedBookmarkMessage, setSelectedBookmarkMessage] = useState("");

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    setButtonsToDisable([]);
    setFromButtonOptions(null);
    setToButtonOptions(null);
    setButtonOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function inputFirstClick() {
    if (firstPressTime === undefined) setFirstPressTime(new Date());
  }
  const speech = useContext(SpeechContext);
  async function handleSpeak(bookmark) {
    if (
      LocalStorage.getAutoPronounceInExercises() !== PRONOUNCIATION_SETTING.off
    ) {
      await speech.speakOut(bookmark.from, setIsPronouncing);
    }
  }

  useEffect(() => {
    for (let i = 0; i < bookmarksToStudy.length; i++) {
      let currentBookmarkLog = exerciseAttemptsLog[i];
      if (selectedBookmark == currentBookmarkLog.bookmark)
        setSelectedBookmarkMessage(currentBookmarkLog.messageToAPI);
    }
  }, [selectedBookmark]);

  function notifyBookmarkDeletion(bookmark) {
    let word_expression = "";
    if (isBookmarkExpression(bookmark)) word_expression = "expression";
    else word_expression = "word";
    toast.success(`The ${word_expression} '${bookmark.from}' is deleted!`);
  }

  function notifyChoiceSelection(firstChoice, secondChoice) {
    console.log("checking result...");
    let exerciseAttemptsLogCopy = { ...exerciseAttemptsLog };
    let fullMessage = messageToNextNav;
    for (let i = 0; i < bookmarksToStudy.length; i++) {
      let currentBookmarkLog = exerciseAttemptsLogCopy[i];
      let concatMessage = "";
      if (currentBookmarkLog.bookmark.id === Number(firstChoice)) {
        if (firstChoice === secondChoice) {
          setButtonsToDisable((arr) => [...arr, firstChoice]);
          concatMessage = currentBookmarkLog.messageToAPI + "C";
          fullMessage = fullMessage + concatMessage;
          exerciseAttemptsLogCopy[i].messageToAPI = concatMessage;
          handleSpeak(exerciseAttemptsLogCopy[i].bookmark);
          setexerciseAttemptsLog(exerciseAttemptsLogCopy);
          setLastCorrectBookmarkId(currentBookmarkLog.bookmark.id);
          if (buttonsToDisable.length === 2) {
            setIsCorrect(true);
            break;
          } else {
            notifyCorrectAnswer(currentBookmarkLog.bookmark);
            handleAnswer(concatMessage, currentBookmarkLog.bookmark.id);
          }
        } else {
          setIncorrectAnswer(secondChoice);
          notifyIncorrectAnswer(currentBookmarkLog.bookmark);
          concatMessage = currentBookmarkLog.messageToAPI + "W";
          fullMessage = fullMessage + concatMessage;
          exerciseAttemptsLogCopy[i].messageToAPI = concatMessage;
          setexerciseAttemptsLog(exerciseAttemptsLogCopy);
        }
      } else if (currentBookmarkLog.bookmark.id === Number(secondChoice)) {
        if (firstChoice !== secondChoice) {
          setIncorrectAnswer(secondChoice);
          notifyIncorrectAnswer(currentBookmarkLog.bookmark);
          concatMessage = currentBookmarkLog.messageToAPI + "W";
          fullMessage = fullMessage + concatMessage;
          exerciseAttemptsLogCopy[i].messageToAPI = concatMessage;
          setexerciseAttemptsLog(exerciseAttemptsLogCopy);
        }
      }
      if (selectedBookmark == currentBookmarkLog.bookmark)
        setSelectedBookmarkMessage(concatMessage);
    }
    setMessageToNextNav(fullMessage);
  }

  function handleShowSolution() {
    let finalMessage = "";
    for (let i = 0; i < bookmarksToStudy.length; i++) {
      if (!exerciseAttemptsLog[i].messageToAPI.includes("C")) {
        notifyIncorrectAnswer(exerciseAttemptsLog[i].bookmark);
        let concatMessage = exerciseAttemptsLog[i].messageToAPI + "S";
        finalMessage += concatMessage;
        api.uploadExerciseFinalizedData(
          concatMessage,
          EXERCISE_TYPE,
          getCurrentSubSessionDuration(activeSessionDuration, "ms"),
          exerciseAttemptsLog[i].bookmark.id,
          exerciseSessionId,
        );
      }
    }
    setIsCorrect(true);
    setMessageToNextNav(finalMessage);
  }

  function handleAnswer(message, id) {
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      id,
      exerciseSessionId,
    );
  }

  function setButtonOptions() {
    setFromButtonOptions(bookmarksToStudy);
    let optionsToShuffle = [
      bookmarksToStudy[0],
      bookmarksToStudy[1],
      bookmarksToStudy[2],
    ];
    let shuffledOptions = shuffle(optionsToShuffle);
    setToButtonOptions(shuffledOptions);
    console.log(shuffledOptions);
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.matchWordWithTranslation}{" "}
      </div>
      {selectedBookmark && (
        <LearningCycleIndicator
          bookmark={selectedBookmark}
          message={selectedBookmarkMessage}
        />
      )}

      <MatchInput
        fromButtonOptions={fromButtonOptions}
        toButtonOptions={toButtonOptions}
        notifyChoiceSelection={notifyChoiceSelection}
        inputFirstClick={inputFirstClick}
        buttonsToDisable={buttonsToDisable}
        isCorrect={isCorrect}
        api={api}
        incorrectAnswer={incorrectAnswer}
        setIncorrectAnswer={setIncorrectAnswer}
        reload={reload}
        setReload={setReload}
        onBookmarkSelected={setSelectedBookmark}
        notifyBookmarkDeletion={notifyBookmarkDeletion}
        isPronouncing={isPronouncing}
        lastCorrectBookmarkId={lastCorrectBookmarkId}
      />
      <NextNavigation
        message={messageToNextNav}
        api={api}
        exerciseBookmark={bookmarksToStudy[0]}
        exerciseAttemptsLog={exerciseAttemptsLog}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
        exerciseType={EXERCISE_TYPE}
      />
    </s.Exercise>
  );
}
