import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import NextNavigation from "../NextNavigation.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import DisableAudioSession from "../DisableAudioSession.js";
import useSubSessionTimer from "../../../hooks/useSubSessionTimer.js";
import LearningCycleIndicator from "../../LearningCycleIndicator.js";

// The user has to translate the word they hear into their L1. A L2 context with the word is shown when clicking the Hint button.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.translateWhatYouHear;
export default function TranslateWhatYouHear({
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
  const [messageToAPI, setMessageToAPI] = useState("");
  const bookmarkToStudy = bookmarksToStudy[0];
  const speech = useContext(SpeechContext);
  const [interactiveText, setInteractiveText] = useState();
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const [getCurrentSubSessionDuration] = useSubSessionTimer(
    activeSessionDuration,
  );
  const [usedHint, setUsedHint] = useState(false);

  async function handleSpeak() {
    await speech.speakOut(bookmarkToStudy.from, setIsButtonSpeaking);
  }

  useEffect(() => {
    setExerciseType(EXERCISE_TYPE);
    api.getArticleInfo(bookmarksToStudy[0].article_id, (articleInfo) => {
      setInteractiveText(
        new InteractiveText(
          bookmarksToStudy[0].context,
          articleInfo,
          api,
          "TRANSLATE WORDS IN EXERCISE",
          EXERCISE_TYPE,
          speech,
        ),
      );
    });
    if (!SessionStorage.isAudioExercisesEnabled()) handleDisabledAudio();
  }, []);

  useEffect(() => {
    if (SessionStorage.isAudioExercisesEnabled()) {
      handleSpeak();
    }
  }, [interactiveText]);

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

  function disableAudio(e) {
    e.preventDefault();
    SessionStorage.disableAudioExercises();
    handleDisabledAudio();
  }

  function handleDisabledAudio() {
    api.logUserActivity("AUDIO_DISABLE", "", bookmarksToStudy[0].id, "");
    moveToNextExercise();
  }

  function handleIncorrectAnswer() {
    setMessageToAPI(messageToAPI + "W");
    notifyIncorrectAnswer(bookmarksToStudy[0]);
  }

  function handleCorrectAnswer(message) {
    setMessageToAPI(message);
    notifyCorrectAnswer(bookmarksToStudy[0]);
    setIsCorrect(true);
    api.uploadExerciseFinalizedData(
      message,
      EXERCISE_TYPE,
      getCurrentSubSessionDuration(activeSessionDuration, "ms"),
      bookmarksToStudy[0].id,
      exerciseSessionId,
    );
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.translateWhatYouHearHeadline}
      </div>
      <LearningCycleIndicator
        bookmark={bookmarksToStudy[0]}
        message={messageToAPI}
      />
      {!isCorrect && !usedHint && (
        <>
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={bookmarkToStudy}
              api={api}
              styling="large"
              parentIsSpeakingControl={isButtonSpeaking}
            />
          </s.CenteredRowTall>

          <BottomInput
            handleCorrectAnswer={handleCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            bookmarksToStudy={bookmarksToStudy}
            messageToAPI={messageToAPI}
            setMessageToAPI={setMessageToAPI}
            isL1Answer={true}
            exerciseType={EXERCISE_TYPE}
            onHintUsed={() => setUsedHint(true)}
          />
        </>
      )}
      {!isCorrect && usedHint && (
        <>
          <s.CenteredRowTall>
            <SpeakButton
              bookmarkToStudy={bookmarkToStudy}
              api={api}
              styling="large"
              parentIsSpeakingControl={isButtonSpeaking}
            />
          </s.CenteredRowTall>

          <div className="contextExample">
            <TranslatableText
              isCorrect={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={bookmarksToStudy[0].from}
              exerciseType={EXERCISE_TYPE}
            />
          </div>

          <BottomInput
            handleCorrectAnswer={handleCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            bookmarksToStudy={bookmarksToStudy}
            messageToAPI={messageToAPI}
            setMessageToAPI={setMessageToAPI}
            isL1Answer={true}
            exerciseType={EXERCISE_TYPE}
            onHintUsed={() => setUsedHint(true)}
          />
        </>
      )}
      {isCorrect && (
        <>
          <br></br>
          <h1 className="wordInContextHeadline">{bookmarksToStudy[0].to}</h1>
          <div className="contextExample">
            <TranslatableText
              isCorrect={isCorrect}
              interactiveText={interactiveText}
              translating={true}
              pronouncing={false}
              bookmarkToStudy={bookmarksToStudy[0].from}
            />
          </div>
        </>
      )}
      <NextNavigation
        api={api}
        message={messageToAPI}
        exerciseBookmark={bookmarksToStudy[0]}
        moveToNextExercise={moveToNextExercise}
        reload={reload}
        setReload={setReload}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
      {SessionStorage.isAudioExercisesEnabled() && (
        <DisableAudioSession disableAudio={disableAudio} />
      )}
    </s.Exercise>
  );
}
