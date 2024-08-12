import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import EditBookmarkButton from "../../words/EditBookmarkButton";
import * as s from "./Exercise.sc";
import SolutionFeedbackLinks from "./SolutionFeedbackLinks";
import { random } from "../../utils/basic/arrays";
import { useEffect, useState, useContext } from "react";
import Confetti from "react-confetti";
import SessionStorage from "../../assorted/SessionStorage.js";
import { SpeechContext } from "../../contexts/SpeechContext.js";
import {
  EXERCISE_TYPES,
  PRONOUNCIATION_SETTING,
} from "../ExerciseTypeConstants";

import CelebrationModal from "../CelebrationModal";
import { getStaticPath } from "../../utils/misc/staticPath.js";

import Feature from "../../features/Feature";
import { ExerciseValidation } from "../ExerciseValidation.js";
import LocalStorage from "../../assorted/LocalStorage.js";
import useBookmarkAutoPronounce from "../../hooks/useBookmarkAutoPronounce.js";

export default function NextNavigation({
  message,
  exerciseBookmark,
  exerciseAttemptsLog, // Used for exercises like Match which test multiple bookmarks
  moveToNextExercise,
  api,
  reload,
  setReload,
  isReadContext,
  toggleShow,
  isCorrect,
  handleShowSolution,
  exerciseType,
}) {
  const correctStrings = [
    strings.correctExercise1,
    strings.correctExercise2,
    strings.correctExercise3,
  ];

  const exercise = "exercise";
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [correctMessage, setCorrectMessage] = useState("");
  const [learningCycle, setLearningCycle] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [autoPronounceState, autoPronounceString, toggleAutoPronounceValue] =
    useBookmarkAutoPronounce();
  const speech = useContext(SpeechContext);
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const [matchExerciseProgressionMessage, setMatchExercisesProgressionMessage] =
    useState();
  const productiveExercisesDisabled =
    LocalStorage.getProductiveExercisesEnabled() === "false";
  const isLastInCycle = exerciseBookmark.is_last_in_cycle;
  const isLearningCycleOne = learningCycle === 1;
  const isLearningCycleTwo = learningCycle === 2;
  const learningCycleFeature = Feature.merle_exercises();
  const isMatchExercise = exerciseType === EXERCISE_TYPES.match;
  const isMultiExerciseType =
    EXERCISE_TYPES.isMultiBookmarkExercise(exerciseType);
  const isCorrectMatch = ["CCC"].includes(message);
  const isUserAndAnswerCorrect = userIsCorrect && isCorrect;
  const isRightAnswer = message.includes("C"); // User has gotten to the right answer, but not api correct

  const bookmarkLearned =
    isUserAndAnswerCorrect &&
    isLastInCycle &&
    isCorrectMatch &&
    (isLearningCycleTwo || (isLearningCycleOne && productiveExercisesDisabled));

  const bookmarkProgression =
    userIsCorrect &&
    isLearningCycleOne &&
    isLastInCycle &&
    isCorrectMatch &&
    !productiveExercisesDisabled &&
    learningCycleFeature;

  async function handleSpeak() {
    await speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking);
  }
  useEffect(() => {
    if (
      isCorrect &&
      autoPronounceState &&
      autoPronounceState !== PRONOUNCIATION_SETTING.off &&
      !isMatchExercise
    )
      handleSpeak();
    if (exerciseAttemptsLog) {
      let wordsProgressed = [];
      for (let i = 0; i < exerciseAttemptsLog.length; i++) {
        let apiMessage = exerciseAttemptsLog[i].messageToAPI;
        let b = exerciseAttemptsLog[i].bookmark;
        let isLastBookmark = exerciseAttemptsLog[i].isLast;
        if (b.is_last_in_cycle && apiMessage === "C" && !isLastBookmark) {
          wordsProgressed.push(b.from);
        }
      }
      setMatchExercisesProgressionMessage(
        "'" + wordsProgressed.join("', '") + "'",
      );
    }
  }, [isCorrect, exerciseAttemptsLog]);

  useEffect(() => {
    if (exerciseBookmark && "learning_cycle" in exerciseBookmark) {
      setLearningCycle(exerciseBookmark.learning_cycle);
    }
  }, [exerciseBookmark]);

  useEffect(() => {
    setLearningCycle(exerciseBookmark.learning_cycle);
  }, [exerciseBookmark.learning_cycle]);

  useEffect(() => {
    const { userIsCorrect } = ExerciseValidation(message);
    setUserIsCorrect(userIsCorrect);
  }, [message]);

  useEffect(() => {
    if (isCorrect) {
      setCorrectMessage(random(correctStrings));
    }
  }, [isCorrect]);

  useEffect(() => {
    if (isDeleted) {
      moveToNextExercise();
    }
  }, [isDeleted]);

  useEffect(() => {
    if (bookmarkLearned && !SessionStorage.isCelebrationModalShown()) {
      setShowCelebrationModal(true);
      SessionStorage.setCelebrationModalShown(true);
    }
  }, [bookmarkLearned]);

  return (
    <>
      {learningCycleFeature && (
        <>
          <CelebrationModal
            open={showCelebrationModal}
            onClose={() => setShowCelebrationModal(false)}
          />
        </>
      )}
      {isCorrectMatch && isMatchExercise && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
          />
          <div
            className="next-nav-learning-cycle"
            style={{ textAlign: "left" }}
          >
            <img
              src={getStaticPath("icons", "zeeguu-icon-correct.png")}
              alt="Correct Icon"
            />
            <p>
              <b>
                {`${matchExerciseProgressionMessage}`} have now moved to your
                productive knowledge.
              </b>
            </p>
          </div>
        </>
      )}
      {isRightAnswer &&
        !isMatchExercise &&
        (bookmarkProgression ? (
          <>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
            />
            <div className="next-nav-learning-cycle">
              <img
                src={getStaticPath("icons", "zeeguu-icon-correct.png")}
                alt="Correct Icon"
              />
              <p>
                <b>{correctMessage + " " + strings.nextLearningCycle}</b>
              </p>
            </div>
          </>
        ) : bookmarkLearned ? (
          <>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
            />
            <div className="next-nav-learning-cycle">
              <img
                src={getStaticPath("icons", "zeeguu-icon-correct.png")}
                alt="Correct Icon"
              />
              <p>
                <b>{correctMessage + " " + strings.wordLearned}</b>
              </p>
            </div>
          </>
        ) : (
          <div className="next-nav-feedback">
            <img
              src={getStaticPath("icons", "zeeguu-icon-correct.png")}
              alt="Correct Icon"
            />
            <p>
              <b>{correctMessage}</b>
            </p>
          </div>
        ))}
      {isCorrect && !isMultiExerciseType && (
        <>
          <s.BottomRowSmallTopMargin className="bottomRow">
            <s.EditSpeakButtonHolder>
              <SpeakButton
                bookmarkToStudy={exerciseBookmark}
                api={api}
                style="next"
                isReadContext={isReadContext}
                parentIsSpeakingControl={isButtonSpeaking}
              />
              <EditBookmarkButton
                bookmark={exerciseBookmark}
                api={api}
                styling={exercise}
                reload={reload}
                setReload={setReload}
                notifyDelete={() => setIsDeleted(true)}
              />
            </s.EditSpeakButtonHolder>
            <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
              {strings.next}
            </s.FeedbackButton>
          </s.BottomRowSmallTopMargin>
        </>
      )}
      {isCorrect && isMultiExerciseType && (
        <s.BottomRowSmallTopMargin className="bottomRow">
          <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
            {strings.next}
          </s.FeedbackButton>
        </s.BottomRowSmallTopMargin>
      )}
      {isCorrect && (
        <s.StyledGreyButton
          onClick={toggleAutoPronounceValue}
          style={{
            position: "relative",
            bottom: "3em",
            left: "2em",
            textAlign: "start",
          }}
        >
          {"Auto-Pronounce: " + autoPronounceString}
        </s.StyledGreyButton>
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </>
  );
}
