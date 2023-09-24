import { useState } from "react";
import * as s from "./RedirectionNotificationModal.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function RedirectionNotificationForDesktop({
  article,
  handleModalVisibilityPreferences,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
}) {
  const [
    selectedDoNotShowRedirectionModal_Checkbox,
    setSelectedDoNotShowRedirectionModal_Checkbox,
  ] = useState(false);

  function toggleRedirectionCheckboxSelection() {
    setSelectedDoNotShowRedirectionModal_Checkbox(
      !selectedDoNotShowRedirectionModal_Checkbox
    );
  }

  //saves modal visibility preferences to the Local Storage
  function handleModalVisibilityPreferences() {
    selectedDoNotShowRedirectionModal_Checkbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  function handleCloseAndSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  //when user exits modal by clicking "X" without saving anything
  function handleCloseWithoutSavingVisibilityPreferences() {
    handleCloseRedirectionModal();
    setSelectedDoNotShowRedirectionModal_Checkbox(false); //to avoid prechecked checkboxes
  }

  return (
    <>
      <s.Header>
        <h1>
          You are ready to&nbsp;continue<br></br>
          to the original article's website
        </h1>
      </s.Header>
      <s.Body>
        <p>
          <strong>Once there</strong>, find and{" "}
          <strong>
            click The Zeeguu Reader{" "}
            <s.Icon>
              <img
                className="fullDivWidthImage"
                alt=""
                src="../static/images/zeeguuLogo.svg"
              ></img>
            </s.Icon>{" "}
            icon
          </strong>{" "}
          in the top right corner of&nbsp;your browser's toolbar
          or&nbsp;on&nbsp;the&nbsp;list of your installed extensions{" "}
          <s.Icon>
            <img
              className="fullDivWidthImage"
              alt=""
              src="../static/images/puzzle.svg"
            ></img>
          </s.Icon>
          . <strong>Then&nbsp;select Read Article</strong>.
        </p>
        <img
          className="fullDivWidthImage"
          src={"../static/images/find-extension.png"}
          alt="Zeeguu browser extension"
        />
      </s.Body>
      <s.Footer>
        <s.CheckboxWrapper>
          <input
            onChange={toggleRedirectionCheckboxSelection}
            checked={selectedDoNotShowRedirectionModal_Checkbox}
            type="checkbox"
            id="checkbox"
            name=""
            value=""
          ></input>{" "}
          <label htmlFor="checkbox">Don't show this message</label>
        </s.CheckboxWrapper>
        <a target="_blank" rel="noreferrer" href={article.url}>
          {/* Clicking the GoToArticleButton button sends the reader
                to the article, saves visibility preferences of the modal and closes it */}
          <s.GoToArticleButton
            role="button"
            onClick={handleCloseAndSaveVisibilityPreferences}
          >
            Enter the article's website
          </s.GoToArticleButton>
        </a>
      </s.Footer>
      <s.CloseButton
        role="button"
        onClick={handleCloseWithoutSavingVisibilityPreferences}
      >
        <CloseRoundedIcon fontSize="medium" />
      </s.CloseButton>
    </>
  );
}
