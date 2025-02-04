import { useState } from "react";
import { FEEDBACK_OPTIONS } from "../../FeedbackConstants";
import LanguageModal from "../LanguageModal";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";

export default function SideNavLanguageOption() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  return (
    <>
      <NavOption
        icon={<NavIcon name={"language"} />}
        text={"Current Language"}
        onClick={(e) => {
          e.stopPropagation();
          setShowLanguageModal(!showLanguageModal);
        }}
      />
      <LanguageModal
        prefixMsg={"Sidebar"}
        open={showFeedbackModal}
        setOpen={() => {
          setShowLanguageModal(!showFeedbackModal);
        }}
        feedbackOptions={FEEDBACK_OPTIONS.ALL}
      ></LanguageModal>
    </>
  );
}
