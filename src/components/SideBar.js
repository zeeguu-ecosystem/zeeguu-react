import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import StudentSpecificSidebarOptions from "./StudentSpecificSidebarOptions";
import TeacherSpecificSidebarOptions from "./TeacherSpecificSidebarOptions";
import { setColors } from "../components/colors";
import * as s from "./SideBar.sc";
import { APIContext } from "../contexts/APIContext";

export default function SideBar(props) {
  const user = useContext(UserContext);
  const api = useContext(APIContext);
  const [initialSidebarState, setInitialSidebarState] = useState(true);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);

  //deducting whether we are on student or teacher side for colouring
  const path = useLocation().pathname;
  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  const defaultPage = user.is_teacher ? "/teacher/classes" : "articles";

  const { light_color, dark_color } = setColors(isOnStudentSide);

  function SidebarLink({ text, to }) {
    // if path starts with to, then we are on that page
    const active = path.startsWith(to);
    const fontWeight = active ? "700" : "500";

    return (
      <Link className="navigationLink" to={to} onClick={resetSidebarToDefault}>
        <small style={{ fontWeight: fontWeight }}>{text}</small>
      </Link>
    );
  }

  function toggleSidebar(e) {
    e.preventDefault();
    setInitialSidebarState(!initialSidebarState);
  }

  function resetSidebarToDefault(e) {
    setInitialSidebarState(true);
  }

  let sidebarContent = (
    <>
      <div className="logo">
        <a href={defaultPage} rel="external">
          <img
            src="/static/images/zeeguuWhiteLogo.svg"
            alt="Zeeguu Logo - The Elephant"
          />
        </a>
      </div>
      <div className="arrowHolder">
        <span className="toggleArrow" onClick={toggleSidebar}>
          ▲
        </span>
      </div>

      {isOnStudentSide && (
        <StudentSpecificSidebarOptions
          SidebarLink={SidebarLink}
          user={user}
          api={api}
        />
      )}

      {!isOnStudentSide && (
        <TeacherSpecificSidebarOptions
          SidebarLink={SidebarLink}
          user={user}
          setIsOnStudentSide={setIsOnStudentSide}
        />
      )}
    </>
  );

  if (!initialSidebarState) {
    return (
      <s.SideBarToggled light={light_color} dark={dark_color}>
        {sidebarContent}
        <s.MainContentToggled id="scrollHolder">
          {props.children}
        </s.MainContentToggled>
      </s.SideBarToggled>
    );
  }

  return (
    <s.SideBarInitial light={light_color} dark={dark_color}>
      {sidebarContent}
      <s.MainContentInitial id="scrollHolder">
        {props.children}
      </s.MainContentInitial>
    </s.SideBarInitial>
  );
}
