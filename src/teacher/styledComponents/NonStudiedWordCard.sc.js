import styled from "styled-components";
import { darkBlue, lightBlue, darkGrey } from "../../components/colors";

export const StyledNonStudiesWordCard = styled.div`
  .non-studied-word-container {
    border-left: solid 3px ${darkBlue};
    min-width: 250px;
    min-height: 78px;
    user-select: none;
  }

  .non-studied-word {
    margin-bottom: 0;
    padding: 0.4em 2em 0 1em;
  }

  .non-studied-word-translation {
    color: ${lightBlue};
    margin: 0 1em;
  }

  .red-reason {
    margin: 0.5em 0 0 1.2em;
    font-size: smaller;
    color: red;
  }

  .grey-reason {
    margin: 0.5em 0 0 1.2em;
    font-size: smaller;
    color: ${darkGrey};
  }
`;
