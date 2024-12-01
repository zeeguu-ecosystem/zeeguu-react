import { useState, useEffect, useContext } from "react";
import { scrollToTop } from "../../utils/misc/scrollToTop";
import redirect from "../../utils/routing/routing";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Selector from "../../components/Selector";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import { isSupportedBrowser } from "../../utils/misc/browserDetection";

import strings from "../../i18n/definitions";
import { PRACTICE_DAYS } from "../../assorted/practiceDays";
import { MINUTES_GOAL } from "../../assorted/minutesGoal";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

export default function CommitmentPreferences({ api, hasExtension }) {
  const [userDetails, setUserDetails] = useState({
    user_minutes: "",
    user_days: "",
  });
  const history = useHistory();

  function saveCommitmentInfo(info) {
    setUserDetails({
      user_minutes: info.user_minutes,
      user_days: info.user_days,
    });
  }

  function savePracticeDays(practiceDays) {
    setUserDetails({ ...userDetails, user_days: practiceDays });
  }

  function saveMinutes(minutes) {
    setUserDetails({ ...userDetails, user_minutes: minutes });
  }

  function handleCommitmentPreferences(e) {
    e.preventDefault();
    api.createUserCommitment(userDetails, () => {
      saveCommitmentInfo(userDetails);
      const nextPage = getLinkToNextPage();
      history.push(nextPage);
    });
  }

  function getLinkToNextPage() {
    if (isSupportedBrowser() && hasExtension === false) {
      return "/install_extension";
    } else return "/articles";
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>How much time would you like to commit to per week?</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            <Selector
              id={"practice-goal-initialiser"}
              options={PRACTICE_DAYS}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              label={strings.myPracticeGoal}
              selectedValue={userDetails.user_days}
              onChange={(e) => {
                savePracticeDays(e.target.value);
              }}
            />

            <Selector
              id={"minutes-goal-initialiser"}
              options={MINUTES_GOAL}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              label={strings.myDurationGoal}
              selectedValue={userDetails.user_minutes}
              onChange={(e) => {
                saveMinutes(e.target.value);
              }}
            />
          </FormSection>
          <p className="centered">{strings.youCanChangeLater}</p>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={handleCommitmentPreferences}
            >
              {strings.next} <RoundedForwardArrow />
            </Button>
          </ButtonContainer>
          <p className="centered">
            {strings.alreadyHaveAccount + " "}
            <a className="bold underlined-link" href="/log_in">
              {strings.login}
            </a>
          </p>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
