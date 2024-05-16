import { useState } from "react";
import { useLocation } from "react-router";
import strings from "../i18n/definitions";
import * as s from "./SortingButtons.sc";

export default function SortingButtons({
  articleList,
  setArticleList,
  originalList,
}) {
  const [difficultySortState, setCurrentSort] = useState("");
  const [wordCountSortState, setwordCountSortState] = useState("");
  const isOnTeacherSite = useLocation().pathname.includes("teacher");

  function sortArticleList(sorting) {
    setArticleList([...articleList].sort(sorting));
  }

  function changeDifficultySorting(
    e,
    currentSort,
    setCurrentSort,
    setOtherSort,
    sortingFunction,
  ) {
    if (currentSort === "ascending") {
      sortArticleList(sortingFunction);
      setCurrentSort("descending");
      setOtherSort("");
    } else if (currentSort === "descending") {
      setArticleList(originalList);
      setCurrentSort("");
    } else {
      sortArticleList((a, b) => 0 - sortingFunction(a, b));
      setCurrentSort("ascending");
      setOtherSort("");
    }
  }

  return (
    <s.SortingButtons isOnTeacherSite={isOnTeacherSite}>
      <div className="sort-by"> {strings.sortBy}&nbsp; </div>
      <s.SortButton
        isOnTeacherSite={isOnTeacherSite}
        className={difficultySortState}
        onClick={(e) =>
          changeDifficultySorting(
            e,
            difficultySortState,
            setCurrentSort,
            setwordCountSortState,
            (a, b) => b.metrics.difficulty - a.metrics.difficulty,
          )
        }
      >
        {strings.levelWithCapital}
      </s.SortButton>
      <s.SortButton
        isOnTeacherSite={isOnTeacherSite}
        className={wordCountSortState}
        onClick={(e) =>
          changeDifficultySorting(
            e,
            wordCountSortState,
            setwordCountSortState,
            setCurrentSort,
            (a, b) => b.metrics.word_count - a.metrics.word_count,
          )
        }
      >
        {strings.lengthWithCapital}
      </s.SortButton>
    </s.SortingButtons>
  );
}
