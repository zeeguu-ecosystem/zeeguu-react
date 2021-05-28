import PractisedWordsList from "./PractisedWordsList";
import LearnedWordsList from "./LearnedWordsList";
import NonStudiedWordsList from "./NonStudiedWordsList";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { StyledTooltip } from "./StyledTooltip.sc";
import { IconExplanation } from "./AttemptIcons";

const WordsDropDown = ({ words, card }) => {
  const setHeadline = () => {
    switch (card) {
      case "non-studied":
        return "Words translated by the student but not studied in Zeeguu STRINGS";
      case "learned":
        return "Word practised correctly on four DIFFERENT days STRINGS";
      default:
        return "Practised words - translated and exercised by the student STRINGS";
    }
  };

  return (
    <div
      style={{
        padding: 20,
        width: "95%",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
        borderRadius: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ color: "#5492b3" }}>{setHeadline()}</h3>
        <StyledTooltip label={IconExplanation}>
          <InfoOutlinedIcon style={{ color: "#5492b3", fontSize: "45px" }} />
        </StyledTooltip>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {card === "practised" && <PractisedWordsList words={words} />}
        {card === "learned" && <LearnedWordsList words={words} />}
        {card === "non-studied" && <NonStudiedWordsList words={words} />}
      </div>
    </div>
  );
};
export default WordsDropDown;
