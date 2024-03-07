import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

export default function StudentSpecificSidebarOptions({ SidebarLink, user }) {
  const is_teacher = user.is_teacher === "true" || user.is_teacher === true;

  return (
    <>
      <SidebarLink text={strings.articles} to="/articles" />

      <SidebarLink text={strings.words} to="/words" />

      <SidebarLink text={strings.exercises} to="/exercises" />

      <br />

      <SidebarLink text={strings.history} to="/history" />

      <SidebarLink text={strings.userDashboard} to="/user_dashboard" />

      <br />

      {is_teacher && (
        <SidebarLink text={strings.teacherSite} to="/teacher/classes" />
      )}

      <SidebarLink text={strings.settings} to="/account_settings" />

      <Link
        className="navigationLink"
        to="/"
        onClick={() => {
          user.logoutMethod();
        }}
      >
        <small>{strings.logout}</small>
      </Link>
    </>
  );
}
