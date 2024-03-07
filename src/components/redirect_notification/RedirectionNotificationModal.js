import {
  isSupportedBrowser,
  isMobile,
} from "../../utils/misc/browserDetection";
import MobileNotification from "./MobileNotification";
import UnsupportedNotification from "./UnsupportedNotification";
import SupportedNotification from "./SupportedNotification";
import SupportedNotification_NotInstalled from "./SupportedNotification_NotInstalled";

//This modal is used in the ArticlePreview component

export default function RedirectionNotificationModal({
  api,
  hasExtension,
  article,
  open,
  handleCloseRedirectionModal,
  setDoNotShowRedirectionModal_UserPreference,
  setIsArticleSaved, // related to the article's state
}) {
  const MOBILE_NOTIFICATION = (
    <MobileNotification
      article={article}
      api={api}
      setIsArticleSaved={setIsArticleSaved}
      handleCloseRedirectionModal={handleCloseRedirectionModal}
      setDoNotShowRedirectionModal_UserPreference={
        setDoNotShowRedirectionModal_UserPreference
      }
      open={open}
    />
  );

  const SUPPORTED_NOTIFICATION = (
    <SupportedNotification
      article={article}
      handleCloseRedirectionModal={handleCloseRedirectionModal}
      setDoNotShowRedirectionModal_UserPreference={
        setDoNotShowRedirectionModal_UserPreference
      }
      open={open}
    />
  );

  const SUPPORTED_NOT_INSTALLED = (
    <SupportedNotification_NotInstalled
      handleCloseRedirectionModal={handleCloseRedirectionModal}
      open={open}
    />
  );

  const UNSUPPORTED_NOTIFICATION = (
    <UnsupportedNotification
      article={article}
      api={api}
      setIsArticleSaved={setIsArticleSaved}
      handleCloseRedirectionModal={handleCloseRedirectionModal}
      setDoNotShowRedirectionModal_UserPreference={
        setDoNotShowRedirectionModal_UserPreference
      }
      open={open}
    />
  );

  function adaptNotificationType() {
    if (isSupportedBrowser() && hasExtension) {
      return SUPPORTED_NOTIFICATION;
    } else if (isSupportedBrowser() && !hasExtension) {
      return SUPPORTED_NOT_INSTALLED;
    } else if (isMobile()) {
      return MOBILE_NOTIFICATION;
    } else if (!isSupportedBrowser() && !isMobile()) {
      return UNSUPPORTED_NOTIFICATION;
    }
  }

  return adaptNotificationType();
}
