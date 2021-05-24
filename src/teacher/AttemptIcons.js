import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import PriorityHighRoundedIcon from "@material-ui/icons/PriorityHighRounded";
import { v4 as uuid } from "uuid";

const CorrectAttempt = () => {
  return (
    <CheckRoundedIcon
      style={{ color: "green", margin: "12px -3px 0 -2px", fontSize: 18 }}
    />
  );
};

const WrongAttempt = () => {
  return (
    <ClearRoundedIcon
      style={{ color: "red", margin: "12px -3px 0 -2px", fontSize: 18 }}
    />
  );
};

const SolutionShown = () => {
  return (
    <PriorityHighRoundedIcon
      style={{ margin: "13px -5px 0 -3.5px", fontSize: "15px" }}
    />
  );
};

const HintUsed = () => {
  return (
    <p style={{ color: "orange", fontWeight: 600, margin: "12px 0px 0 1.5px", fontSize: "14px" }}>
      ?
    </p>
  );
};

export const AttemptIcons = ({ attemptString }) => {
  const setIcon = (char) => {
    switch (char) {
      case "w":
        return <WrongAttempt key={uuid()}/>;
      case "h":
        return <HintUsed key={uuid()}/>;
      case "s":
        return <SolutionShown key={uuid()}/>;

      default:
        return <CorrectAttempt key={uuid()}/>;
    }
  };

  const attemptChars = attemptString.split("");
  return(
    <div style={{display:"flex", flexDirection:"row", marginLeft:".5em", marginRight:"1em"}}>
    {attemptChars.map((char) => setIcon(char))}
    </div>
  );
};
