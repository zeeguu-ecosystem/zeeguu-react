import styled, { css } from "styled-components";


export const StudentActivityDataCircleWrapper = styled.div`
  display: flex;
  width: 30em;
  padding: 0.5vw;
  

${(props) =>
    props.isFirst &&
    css`
 background-color: pink;
 width:30em;
      
    `}

`;

