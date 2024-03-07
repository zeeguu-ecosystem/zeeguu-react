import React, { Fragment, useEffect, useState } from "react";
import strings from "../../../i18n/definitions";
import TimeSelector from "../../sharedComponents/TimeSelector";
import LocalStorage from "../../../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import ReadingInsightAccordion from "./ReadingInsightAccordion";
import { CenteredContent } from "../../../components/ColumnWidth.sc";
import LoadingAnimation from "../../../components/LoadingAnimation";

export default function StudentReadingInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  console.log("STUDENT ID AND COHOR TID");
  console.log(studentID);
  console.log(cohortID);

  const [studentName, setStudentName] = useState(null);
  const [cohortLang, setCohortLang] = useState("");
  const [readingSessions, setReadingSessions] = useState([]);
  const [articleCount, setArticleCount] = useState(null);

  useEffect(() => {
    api.getCohortsInfo((cohortInfo) => {
      let currentCohort = cohortInfo.find((each) => each.id === cohortID);
      setCohortLang(currentCohort.language_name);
    });
    api.getStudentInfo(
      studentID,
      cohortID,
      selectedTimePeriod,
      (studentInfo) => setStudentName(studentInfo.name),
      (error) => console.log(error),
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setArticleCount(null);
    api.getReadingSessions(
      studentID,
      cohortID,
      selectedTimePeriod,
      (readingSessions) => setReadingSessions(readingSessions),
      (error) => console.log(error),
    );
    api.getStudentActivityOverview(
      studentID,
      selectedTimePeriod,
      cohortID,
      (activity) => setArticleCount(activity.number_of_texts),
      (error) => console.log(error),
    );
    // eslint-disable-next-line
  }, [forceUpdate]);

  const customText =
    readingSessions &&
    studentName +
      strings.studentHasRead +
      articleCount +
      strings.textsInTheLastPeriod;

  if (studentName === null || articleCount === null) {
    return <LoadingAnimation />;
  }

  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      {readingSessions.length === 0 ? (
        <CenteredContent>
          <h3>
            {strings.studentHasNotReadAnyArticles} {cohortLang}
          </h3>
        </CenteredContent>
      ) : (
        <div>
          <ReadingInsightAccordion readingSessions={readingSessions} />
        </div>
      )}
    </Fragment>
  );
}
