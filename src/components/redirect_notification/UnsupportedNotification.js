import * as s from "./RedirectionNotificationModal.sc";
import { useState } from "react";
import Modal from "./modal_shared/Modal";
import Header from "./modal_shared/Header";
import Body from "./modal_shared/Body";
import Footer from "./modal_shared/Footer";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import GoToButton from "./modal_shared/GoToButton";
import Icon from "./modal_shared/Icon";
import Checkbox from "./modal_shared/Checkbox";

export default function UnsupportedNotification({
  article,
  api,
  setIsArticleSaved,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  open,
}) {
  const [redirectCheckbox, setRedirectCheckbox] = useState(false);

  function toggleRedirectCheckbox() {
    setRedirectCheckbox(!redirectCheckbox);
  }

  function saveArticle() {
    api.makePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setIsArticleSaved(true);
      }
    });
  }

  //this state is saved to local storage
  function handleModalVisibilityPreferences() {
    redirectCheckbox === true
      ? setDoNotShowRedirectionModal_UserPreference(true)
      : setDoNotShowRedirectionModal_UserPreference(false);
  }

  //runs when user enters article or saves it
  function handleSaveVisibilityPreferences() {
    handleModalVisibilityPreferences();
    handleCloseRedirectionModal();
  }

  // function below saves article, visibility preferences of the modal and closes it
  function handleSaveArticleFromTheModal() {
    saveArticle();
    handleSaveVisibilityPreferences();
  }

  function handleCancel() {
    handleCloseRedirectionModal();
    setRedirectCheckbox(false); //clear the redirectCheckbox state to avoid it being prechecked when the user re-enters the modal
  }

  let BrowserLinks = {
    Chrome: {
      link: "https://www.google.com/chrome/?brand=WHAR&gad_source=1&gclid=EAIaIQobChMI3Z3blfOghAMVD6doCR33SgG1EAAYASAAEgJ6TvD_BwE&gclsrc=aw.ds",
      name: <>Google&nbsp;Chrome</>,
    },
    Firefox: {
      link: "https://www.mozilla.org/en-US/firefox/new/",
      name: <>Mozilla&nbsp;Firefox</>,
    },
    Edge: {
      link: "https://www.microsoft.com/en-us/edge/download?form=MA13FJ",
      name: <>Microsoft&nbsp;Edge</>,
    },
  };

  function renderExternalLink(href, text) {
    return (
      <s.ExternalLink target="_blank" rel="noreferrer" href={href}>
        <s.Strong>{text}</s.Strong>
      </s.ExternalLink>
    );
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>
        Your browser doesn't support <br></br>
        <Icon src={"../static/images/zeeguuLogo.svg"} />
        The Zeeguu Reader extension
      </Header>
      <Body>
        <p>
          To read articles with our extension, we recommend installing{" "}
          {renderExternalLink(
            BrowserLinks.Chrome.link,
            BrowserLinks.Chrome.name
          )}
          ,{" "}
          {renderExternalLink(
            BrowserLinks.Firefox.link,
            BrowserLinks.Firefox.name
          )}
          , or{" "}
          {renderExternalLink(BrowserLinks.Edge.link, BrowserLinks.Edge.name)}.
        </p>
        <p>
          To read this article with the help of <s.Strong>Zeeguu</s.Strong> on
          your current browser, click
          <s.Strong> Add&nbsp;to&nbsp;Saves</s.Strong> to save it first.
        </p>
      </Body>
      <Footer>
        <Checkbox
          label={"Don't show this message"}
          checked={redirectCheckbox}
          onChange={toggleRedirectCheckbox}
        />
        <s.ButtonsContainer moreButtons>
          <GoToButton
            target={"_blank"}
            href={article.url}
            onClick={handleSaveVisibilityPreferences}
          >
            Enter the article's website
          </GoToButton>
          <s.SaveArticleButton
            role="button"
            onClick={handleSaveArticleFromTheModal}
          >
            <BookmarkBorderIcon fontSize="small" />
            Add to Saves
          </s.SaveArticleButton>
        </s.ButtonsContainer>
      </Footer>
    </Modal>
  );
}
