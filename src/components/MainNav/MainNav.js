import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import SideNav from "./SideNav/SideNav";
import BottomNav from "./BottomNav/BottomNav";
import { MOBILE_WIDTH } from "./screenSize";
import { ThemeProvider } from "styled-components";
import { mainNavTheme } from "./mainNavTheme";
import { MainNavContext } from "../../contexts/MainNavContext";

export default function MainNav({ screenWidth }) {
  const { mainNav, setMainNav } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNav;

  const path = useLocation().pathname;
  useEffect(() => {
    setMainNav({
      ...mainNav,
      isOnStudentSide: !path.includes("teacher"),
    });
  }, [path]);

  return (
    <ThemeProvider
      theme={isOnStudentSide ? mainNavTheme.student : mainNavTheme.teacher}
    >
      {screenWidth <= MOBILE_WIDTH ? (
        <BottomNav />
      ) : (
        <SideNav screenWidth={screenWidth} />
      )}
    </ThemeProvider>
  );
}
