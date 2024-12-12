import { useParams, useHistory } from "react-router-dom";
import { UMR_SOURCE } from "../reader/ArticleReader";
import { useState, useEffect } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import WordsToReview from "./WordsToReview";
import { NarrowColumn, CenteredContent } from "../components/ColumnWidth.sc";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { StyledButton } from "../components/allButtons.sc.js";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Tooltip from "@mui/material/Tooltip";

function fit_for_study(words) {
  return words.filter((b) => b.fit_for_study || b.starred).length > 0;
}

export default function WordsForArticle({ api }) {
  let { articleID } = useParams();
  const history = useHistory();
  const [words, setWords] = useState(null);
  const [articleInfo, setArticleInfo] = useState(null);
  const [exercisesEnabled, setExercisesEnabled] = useState(false);

  useEffect(() => {
    api.prioritizeBookmarksToStudy(articleID, setWords);
    api.getArticleInfo(articleID, (data) => {
      setArticleInfo(data);
      setTitle('Words in "' + data.title + '"');
    });

    api.logReaderActivity(api.WORDS_REVIEW, articleID, "", UMR_SOURCE);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (words) setExercisesEnabled(fit_for_study(words));
  }, [words]);

  if (words === null || articleInfo === null) {
    return <LoadingAnimation />;
  }

  function deleteBookmark(bookmark) {
    let newWords = [...words].filter((e) => e.id !== bookmark.id);
    setWords(newWords);
    setExercisesEnabled(fit_for_study(newWords));
  }

  function notifyWordChanged(bookmark) {
    let newWords = words.map((word) =>
      word.id === bookmark.id ? bookmark : word,
    );
    setWords(newWords);
    setExercisesEnabled(fit_for_study(newWords));
  }

  const backToArticle = () => {
    history.push(`../../read/article?id=${articleID}`);
  };

  const toExercises = async (e) => {
    e.preventDefault();
    console.log("toExercises called");
    try {
      console.log("Logging activity...");
      await logGoingToExercisesAfterReview(e);
      console.log(
        "Activity logged, navigating to:",
        `../words/forArticle/${articleID}`,
      );
      history.push(`../../exercises/forArticle/${articleID}`);
    } catch (error) {
      console.error("Error during logging and navigation:", error);
    }
  };

  const toScheduledExercises = async (e) => {
    history.push(`/exercises/}`);
  };

  function logGoingToExercisesAfterReview(e) {
    console.log("logGoingToExercisesAfterReview called");
    return api.logReaderActivity(
      api.TO_EXERCISES_AFTER_REVIEW,
      articleID,
      "",
      UMR_SOURCE,
    );
  }

  return (
    <NarrowColumn>
      <WordsToReview
        words={words}
        deleteBookmark={deleteBookmark}
        articleInfo={articleInfo}
        api={api}
        notifyWordChanged={notifyWordChanged}
        source={UMR_SOURCE}
      />
      <CenteredContent>
        {!exercisesEnabled ? (
          <Tooltip
            title="You need to translate words in the article first."
            arrow
          >
            <span>
              <StyledButton disabled>{strings.toExercises}</StyledButton>
            </span>
          </Tooltip>
        ) : (
          <StyledButton navigation onClick={toExercises}>
            {strings.toExercises}
          </StyledButton>
        )}
        <StyledButton primary onClick={toScheduledExercises}>
          Scheduled Exercises
        </StyledButton>
      </CenteredContent>
    </NarrowColumn>
  );
}
