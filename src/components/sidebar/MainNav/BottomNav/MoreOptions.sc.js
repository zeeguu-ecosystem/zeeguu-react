import styled from "styled-components";
import { blue700, orange600 } from "../../../colors";
import { fadeIn, fadeOut, slideIn, slideOut } from "../../../transitions";

const MoreOptionsWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
  animation: ${({ isOverlayVisible }) => (isOverlayVisible ? fadeIn : fadeOut)}
    0.3s ease-in-out forwards;
`;

const MoreOptionsPanel = styled.nav`
  opacity: 1;
  box-sizing: border-box;
  width: 100%;
  background-color: ${({ isOnStudentSide }) =>
    isOnStudentSide ? `${orange600}` : `${blue700}`};
  position: fixed;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  border-radius: 1rem 1rem 0 0;
  padding: 1rem 1rem 2rem 1rem;
  box-shadow: 0 -0.25rem 1.25rem rgba(0, 0, 0, 0.1);
  animation: ${({ isMoreOptionsVisible }) =>
      isMoreOptionsVisible ? slideIn : slideOut}
    0.3s ease-in-out forwards;
`;

const CloseSection = styled.div`
  width: 100%;
  display: flex;
`;

const CloseButton = styled.button`
  background-color: inherit;
  border: none;
  padding: 0;
  margin: 0 0 0 auto;
  color: white;
`;

export { MoreOptionsWrapper, MoreOptionsPanel, CloseSection, CloseButton };