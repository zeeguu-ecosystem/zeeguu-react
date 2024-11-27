import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { isMobile } from "../../../utils/misc/browserDetection";
import Sidebar from "./SideBar/Sidebar";
import BottomNav from "./BottomNav/BottomNav";

export default function MainNav({ isCollapsed, setIsCollapsed }) {
  const { is_teacher: isTeacher } = useContext(UserContext);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);

  const path = useLocation().pathname;
  const defaultPage = isTeacher ? "/teacher/classes" : "articles";

  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  return (
    <>
      {isMobile() ? (
        <BottomNav isOnStudentSide={isOnStudentSide} isTeacher={isTeacher} />
      ) : (
        <Sidebar
          isOnStudentSide={isOnStudentSide}
          isTeacher={isTeacher}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      )}
    </>
  );
}
