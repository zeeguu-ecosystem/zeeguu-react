import styled from "styled-components";
import {
  almostBlack,
  zeeguuLightYellow,
  zeeguuOrange,
  zeeguuTransparentLightOrange,
} from "../components/colors";

const TranslatableText = styled.div`
  z-tag {
    white-space: break-spaces;
    cursor: pointer;
    /* margin-right: 1em; 
    padding-right: 0.3em;*/
    display: inline-block;
    margin: 0;
    line-height: 29px;
    /* background-color: greenyellow; */
  }

  z-tag.loading {
    animation: blink 1.5s linear infinite;
    color: ${zeeguuOrange};
  }

  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }

  /*  z-tag tag hover changes color, translated word hover no underline or color*/

  z-tag:hover {
    background-color: ${zeeguuTransparentLightOrange};
  }

  /* the translation - above the origin word
   the font is thin until the user contributes or selects an alternative
   highlights the fact that we are not sure of the translation ...
   */

  z-tag z-tran {
    margin-top: 0.2em;
    margin-bottom: -0.1em;
    margin-left: -0.3em;
    padding: 2px;
    padding-left: 0.3em;
    border-radius: 0.3em 0.3em 0.3em 0.3em;
    background-clip: padding-box;
    background-color: ${zeeguuLightYellow};
    font-size: medium;
    line-height: 1em;
    max-width: 100%;
    font-weight: 600;
    color: ${almostBlack};
    text-transform: lowercase;
    text-align: left;
    display: flex;
  }

  z-tag z-tran:hover {
    color: black;
  }

  z-tag z-orig {
    border-bottom: 1px dashed ${zeeguuOrange};
    width: 100%;
    color: ${zeeguuOrange};
    font-weight: 600;
  }

  z-tran > .arrow {
    padding: 0;
    margin-left: auto;
    color: rgba(0, 0, 0, 0.2);
  }

  z-tran:hover > .arrow {
    visibility: visible;
  }

  z-tag z-tran[chosen]:before {
    content: attr(chosen);
  }

  .handSelected,
  .handContributed {
    width: 1.5em;
    text-align: center;
  }

  .handSelected:after,
  .handContributed:after {
    display: none;
    opacity: 0.1;
    transition:
      visibility 0s 2s,
      opacity 2s linear;
  }

  .handSelected:after {
    content: " ";
    color: white;
  }

  .handContributed:after {
    content: " ";
    color: white;
  }

  /* When an alternative is selected or a translation is uploaded
we highlight this by changing the style of both the translation
(normal font weight) and origin (solid underline)

why? there are two selectedAltenative and contributedAlternative
classes for the origin... because at some point we were considering
distinguishing between the two types of contribution... eventually
that made the UI too heavy ... */

  .selectedAlternative,
  .contributedAlternativeTran {
  }

  .selectedAlternativeOrig,
  .contributedAlternativeOrig {
  }
`;

export { TranslatableText };
