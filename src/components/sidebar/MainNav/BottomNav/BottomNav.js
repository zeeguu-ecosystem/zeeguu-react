import * as s from "./BottomNav.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState } from "react";
import NavIcon from "../NavIcon";
import FeedbackButton from "../../../FeedbackButton";
import NavOption from "../NavOption";
import NotificationIcon from "../../../NotificationIcon";
import useExerciseNotification from "../../../../hooks/useExerciseNotification";

export default function BottomNav({ isOnStudentSide, isTeacher }) {
  const path = useLocation().pathname;
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);
  const { hasExerciseNotification, notificationMsg } =
    useExerciseNotification();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (path.includes("/exercises") || path.includes("/read")) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [path]);

  return (
    <>
      {isVisible && (
        <>
          {isMoreOptionsVisible && (
            <s.MoreOptionsPanel isOnStudentSide={isOnStudentSide}>
              <button
                onClick={() => {
                  setIsMoreOptionsVisible(false);
                }}
              >
                Close
              </button>

              {isOnStudentSide && (
                <>
                  <NavOption
                    isOnStudentSide={isOnStudentSide}
                    linkTo={"/user_dashboard"}
                    icon={<NavIcon name="statistics" />}
                    text={"Statistics"}
                    currentPath={path}
                    onClick={() => {
                      setIsMoreOptionsVisible(false);
                    }}
                  />

                  <NavOption
                    isOnStudentSide={isOnStudentSide}
                    linkTo={"/history"}
                    icon={<NavIcon name="history" />}
                    text={"History"}
                    currentPath={path}
                    onClick={() => {
                      setIsMoreOptionsVisible(false);
                    }}
                  />

                  {isTeacher && (
                    <NavOption
                      linkTo={"/teacher/classes"}
                      icon={<NavIcon name="teacherSite" />}
                      text={"Teacher Site"}
                      currentPath={path}
                      onClick={() => {
                        setIsMoreOptionsVisible(false);
                      }}
                    />
                  )}
                </>
              )}

              {!isOnStudentSide && (
                <>
                  <NavOption
                    isOnStudentSide={isOnStudentSide}
                    linkTo={"/articles"}
                    icon={<NavIcon name="studentSite" />}
                    text={"Student Site"}
                    currentPath={path}
                    onClick={() => {
                      setIsMoreOptionsVisible(false);
                    }}
                  />
                </>
              )}

              <FeedbackButton isOnStudentSide={isOnStudentSide} />
            </s.MoreOptionsPanel>
          )}
          <s.BottomNav isOnStudentSide={isOnStudentSide}>
            {isOnStudentSide && (
              <>
                <s.BottomNavOption>
                  <s.StyledLink to="/articles">
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/articles")}
                    >
                      <NavIcon name="home" />
                    </s.IconSpan>
                    Home
                  </s.StyledLink>
                </s.BottomNavOption>

                <s.BottomNavOption>
                  <s.StyledLink to="/exercises">
                    {hasExerciseNotification && (
                      <NotificationIcon text={notificationMsg} />
                    )}
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/exercises")}
                    >
                      <NavIcon name="exercises" />
                    </s.IconSpan>
                    Exercises
                  </s.StyledLink>
                </s.BottomNavOption>

                <s.BottomNavOption>
                  <s.StyledLink to="/words">
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/words")}
                    >
                      <NavIcon name="words" />
                    </s.IconSpan>
                    Words
                  </s.StyledLink>
                </s.BottomNavOption>
              </>
            )}

            {!isOnStudentSide && (
              <>
                <s.BottomNavOption>
                  <s.StyledLink to="/teacher/classes">
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/teacher/classes")}
                    >
                      <NavIcon name="myClassrooms" />
                    </s.IconSpan>
                    My Classrooms
                  </s.StyledLink>
                </s.BottomNavOption>

                <s.BottomNavOption>
                  <s.StyledLink to="/teacher/texts">
                    <s.IconSpan
                      isOnStudentSide={isOnStudentSide}
                      isActive={path && path.includes("/teacher/texts")}
                    >
                      <NavIcon name="myTexts" />
                    </s.IconSpan>
                    My Texts
                  </s.StyledLink>
                </s.BottomNavOption>
              </>
            )}

            <s.BottomNavOption>
              <s.StyledLink to="/account_settings">
                <s.IconSpan
                  isOnStudentSide={isOnStudentSide}
                  isActive={path && path.includes("/account_settings")}
                >
                  <NavIcon name="settings" />
                </s.IconSpan>
                Settings
              </s.StyledLink>
            </s.BottomNavOption>

            <s.BottomNavOption>
              <s.StyledButton
                onClick={() => {
                  setIsMoreOptionsVisible(true);
                }}
              >
                <s.IconSpan isOnStudentSide={isOnStudentSide}>
                  <NavIcon name="more" />
                </s.IconSpan>
                More
              </s.StyledButton>
            </s.BottomNavOption>
          </s.BottomNav>
        </>
      )}
    </>
  );
}

// Todo:
// - make the bottom bar not visible on the article’s page and the exercise page
//
// - make the top bar with a back button on mobile (for some pages such as articles)
//
// - adapt options in the bottom bar (remove the teacher’s view, replace with settings,
// add additional options in the expandible bar)
//
// - The app automatically zooms in when user enters input, this makes the navbar invisible.
// Do something about it
//
// - Make a theme
//
// - Prevent bg from scrolling when "more" is open