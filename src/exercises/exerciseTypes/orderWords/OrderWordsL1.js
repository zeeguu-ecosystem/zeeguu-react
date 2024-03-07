import OrderWords from "./OrderWords.js";
// Order words in the Known Language
const EXERCISE_TYPE = "OrderWords_L1";

export default function OrderWordsL1({
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
  return (
    <>
      <OrderWords
        bookmarksToStudy={bookmarksToStudy}
        correctAnswer={correctAnswer}
        notifyIncorrectAnswer={notifyIncorrectAnswer}
        api={api}
        setExerciseType={setExerciseType}
        isCorrect={isCorrect}
        setIsCorrect={setIsCorrect}
        moveToNextExercise={moveToNextExercise}
        toggleShow={toggleShow}
        reload={reload}
        setReload={setReload}
        exerciseSessionId={exerciseSessionId}
        activeSessionDuration={activeSessionDuration}
        exerciseType={EXERCISE_TYPE}
      />
    </>
  );
}
