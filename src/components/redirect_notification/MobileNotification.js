import * as s from "./RedirectionNotificationModal.sc";
import { useState } from "react";
import Modal from "./modal_shared/Modal";
import Header from "./modal_shared/Header";
import Body from "./modal_shared/Body";
import Footer from "./modal_shared/Footer";
import Checkbox from "./modal_shared/Checkbox";
import GoToButton from "./modal_shared/GoToButton";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export default function MobileNotification({
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
    setRedirectCheckbox(false); //clear the redirectCheckbox state
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <Header>It looks like you are using&nbsp;a&nbsp;mobile device</Header>
      <Body>
        <p>
          If you want to read articles with the help of Zeeguu on your mobile
          device, you need to save them first by clicking the
          <s.Strong> Add&nbsp;to&nbsp;Saves</s.Strong> button.
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
            href={article.url}
            target={"_self"}
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
