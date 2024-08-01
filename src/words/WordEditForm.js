import * as s from "./WordEdit.sc";
import * as st from "../exercises/bottomActions/FeedbackButtons.sc";
import strings from "../i18n/definitions";
import { useState } from "react";
import { MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES } from "../exercises/ExerciseConstants";
import isBookmarkExpression from "../utils/misc/isBookmarkExpression";

export default function WordEditForm({
  bookmark,
  handleClose,
  updateBookmark,
  deleteAction,
}) {
  const [translation, setTranslation] = useState(bookmark.to);
  const [expression, setExpression] = useState(bookmark.from);
  const [context, setContext] = useState(bookmark.context);
  const [fitForStudy, setFitForStudy] = useState(bookmark.fit_for_study);

  const isNotEdited =
    bookmark.to === translation &&
    bookmark.from === expression &&
    bookmark.context === context &&
    bookmark.fit_for_study === fitForStudy;

  function prepClose() {
    setTranslation(bookmark.to);
    setExpression(bookmark.from);
    setContext(bookmark.context);
    setFitForStudy(bookmark.fit_for_study);
    handleClose();
  }
  function handleFitForStudyCheck() {
    setFitForStudy((state) => !state);
  }
  function typingTranslation(event) {
    setTranslation(event.target.value);
  }

  function typingExpression(event) {
    setExpression(event.target.value);
  }

  function typingContext(event) {
    setContext(event.target.value);
  }

  function handleSubmit(event) {
    if (translation === "" || expression === "" || context === "") {
      if (translation === "") {
        setTranslation(bookmark.to);
        event.preventDefault();
      }
      if (expression === "") {
        setExpression(bookmark.from);
        event.preventDefault();
      }
      if (context === "") {
        setContext(bookmark.context);
        event.preventDefault();
      }
    } else if (isNotEdited) {
      prepClose();
    } else {
      updateBookmark(bookmark, expression, translation, context, fitForStudy);
      prepClose();
    }
  }
  return (
    <>
      {isBookmarkExpression(bookmark) ? (
        <s.Headline>{strings.editExpression}</s.Headline>
      ) : (
        <s.Headline>{strings.editWord}</s.Headline>
      )}
      <form onSubmit={handleSubmit}>
        {isBookmarkExpression(bookmark) ? (
          <s.CustomTextField
            id="outlined-basic"
            label={strings.expression}
            variant="outlined"
            fullWidth
            value={expression}
            autoFocus={true}
            onChange={typingExpression}
          />
        ) : (
          <s.CustomTextField
            id="outlined-basic"
            label={strings.word}
            variant="outlined"
            fullWidth
            value={expression}
            autoFocus={true}
            onChange={typingExpression}
          />
        )}
        <s.CustomTextField
          id="outlined-basic"
          label={strings.translation}
          variant="outlined"
          fullWidth
          value={translation}
          onChange={typingTranslation}
        />
        <s.CustomTextField
          id="outlined-basic"
          label={strings.context}
          variant="outlined"
          fullWidth
          multiline
          value={context}
          onChange={typingContext}
        />
        {bookmark.from.split(" ").length <
          MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES && (
          <s.CustomCheckBoxDiv>
            <input
              style={{ width: "1.5em" }}
              type={"checkbox"}
              checked={fitForStudy}
              onChange={handleFitForStudyCheck}
            />
            <label>Include Word in Exercises</label>
          </s.CustomCheckBoxDiv>
        )}

        {isNotEdited ? (
          <s.DoneButtonHolder>
            <st.FeedbackDelete
              onClick={() => deleteAction(bookmark)}
              value={strings.deleteWord}
            />
            <st.FeedbackSubmit
              type="submit"
              value={strings.done}
              style={{ marginLeft: "1em", marginTop: "1em" }}
            />
          </s.DoneButtonHolder>
        ) : (
          <s.DoneButtonHolder>
            <st.FeedbackCancel
              type="button"
              onClick={prepClose}
              value={strings.cancel}
              style={{ marginLeft: "1em", marginTop: "1em" }}
            />
            <st.FeedbackSubmit
              type="submit"
              value={strings.save}
              style={{ marginLeft: "1em", marginTop: "1em" }}
            />
          </s.DoneButtonHolder>
        )}
      </form>
    </>
  );
}
