import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UiLanguageSelector from "../components/UiLanguageSelector";
import { UserContext } from "../contexts/UserContext";
import { setTitle } from "../assorted/setTitle";
import LocalStorage from "../assorted/LocalStorage";
import LoadingAnimation from "../components/LoadingAnimation";
import * as s from "../components/FormPage.sc";
import * as scs from "./Settings.sc";
import strings from "../i18n/definitions";
import { Error } from "../teacher/sharedComponents/Error";
import Select from "../components/Select";
import { CEFR_LEVELS } from "../assorted/cefrLevels";
import { saveUserInfoIntoCookies } from "../utils/cookies/userInfo";
import { PageTitle } from "../components/PageTitle";
import Feature from "../features/Feature";
import SessionStorage from "../assorted/SessionStorage";

export default function Settings({ api, setUser }) {
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const user = useContext(UserContext);
  const [languages, setLanguages] = useState();
  const [inviteCode, setInviteCode] = useState("");
  const [showJoinCohortError, setShowJoinCohortError] = useState(false);
  const [currentCohort, setCurrentCohort] = useState("");
  const [cefr, setCEFR] = useState("");
  const [audioExercises, setAudioExercises] = useState(true);

  let preferenceNotSet =
    LocalStorage.getProductiveExercisesEnabled() === undefined;

  const [productiveExercises, setProductiveExercises] = useState(
    preferenceNotSet || LocalStorage.getProductiveExercisesEnabled(),
  );
  //TODO: Refactor using Zeeguu project logic

  const [uiLanguage, setUiLanguage] = useState();

  useEffect(() => {
    const language = LocalStorage.getUiLanguage();
    setUiLanguage(language);
    setTitle(strings.settings);
    // eslint-disable-next-line
  }, []);

  function onSysChange(lang) {
    setUiLanguage(lang);
  }

  function setCEFRlevel(data) {
    const levelKey = data.learned_language + "_cefr_level";
    const levelNumber = data[levelKey];
    setCEFR("" + levelNumber);
  }

  const modifyCEFRlevel = (languageID, cefrLevel) => {
    api.modifyCEFRlevel(
      languageID,
      cefrLevel,
      (res) => {
        console.log("Update '" + languageID + "' CEFR level to: " + cefrLevel);
        console.log("API returns update status: " + res);
      },
      () => {
        console.log("Connection to server failed...");
      },
    );
  };

  useEffect(() => {
    api.getUserDetails((data) => {
      setUserDetails(data);
      setCEFRlevel(data);
    });
    api.getUserPreferences((preferences) => {
      setAudioExercises(
        (preferences["audio_exercises"] === undefined ||
          preferences["audio_exercises"] === "true") &&
          SessionStorage.isAudioExercisesEnabled(),
      );
    });
    api.getSystemLanguages((systemLanguages) => {
      setLanguages(systemLanguages);
    });
    api.getStudent((student) => {
      if (student.cohort_id !== null) {
        api.getCohortName(student.cohort_id, (cohort) =>
          setCurrentCohort(cohort.name),
        );
      }
    });
  }, [user.session, api]);

  const studentIsInCohort = currentCohort !== "";

  function updateUserInfo(info) {
    LocalStorage.setUserInfo(info);
    setUser({
      ...user,
      name: info.name,
      learned_language: info.learned_language,
      native_language: info.native_language,
    });

    saveUserInfoIntoCookies(info);
  }

  function nativeLanguageUpdated(e) {
    let code = e.target[e.target.selectedIndex].getAttribute("code");
    setUserDetails({
      ...userDetails,
      native_language: code,
    });
  }

  function handleSave(e) {
    e.preventDefault();

    strings.setLanguage(uiLanguage.code);
    LocalStorage.setUiLanguage(uiLanguage);

    modifyCEFRlevel(userDetails.learned_language, cefr);

    console.log("saving: productiveExercises: " + productiveExercises);
    SessionStorage.setAudioExercisesEnabled(audioExercises);
    api.saveUserDetails(userDetails, setErrorMessage, () => {
      api.saveUserPreferences(
        {
          audio_exercises: audioExercises,
          productive_exercises: productiveExercises,
        },
        () => {
          updateUserInfo(userDetails);
          if (history.length > 1) {
            history.goBack();
          } else {
            window.close();
          }
        },
      );
    });
  }

  function handleInviteCodeChange(event) {
    setShowJoinCohortError(false);
    setInviteCode(event.target.value);
  }

  function saveStudentToClass() {
    api.joinCohort(
      inviteCode,
      (status) => {
        status === "OK"
          ? history.push("/articles/classroom")
          : setShowJoinCohortError(true);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  function handleAudioExercisesChange(e) {
    setAudioExercises((state) => !state);
  }

  function handleProductiveExercisesChange(e) {
    // Toggle the state locally
    setProductiveExercises((state) => !state);

    // Update local storage
    const newProductiveValue = !productiveExercises;
    localStorage.setItem(
      "productiveExercisesEnabled",
      JSON.stringify(newProductiveValue),
    );
  }

  if (!userDetails || !languages) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <PageTitle>{strings.settings}</PageTitle>

      <s.FormContainer>
        <scs.StyledSettings>
          <form className="formSettings">
            <h5>{errorMessage}</h5>

            <label>{strings.name}</label>
            <input
              name="name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
            />
            <br />

            <label>{strings.email}</label>
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />

            <br />
            <br />
            <label>{strings.learnedLanguage}</label>
            <UiLanguageSelector
              languages={languages.learnable_languages}
              selected={language_for_id(
                userDetails.learned_language,
                languages.learnable_languages,
              )}
              onChange={(e) => {
                let code =
                  e.target[e.target.selectedIndex].getAttribute("code");
                setUserDetails({
                  ...userDetails,
                  learned_language: code,
                });
              }}
            />

            {/*<label>{strings.levelOfLearnedLanguage}</label>*/}
            <Select
              elements={CEFR_LEVELS}
              label={(e) => e.label}
              val={(e) => e.value}
              updateFunction={setCEFR}
              current={cefr}
            />

            <br />
            <br />

            <label>{strings.nativeLanguage}</label>
            <UiLanguageSelector
              languages={languages.native_languages}
              selected={language_for_id(
                userDetails.native_language,
                languages.native_languages,
              )}
              onChange={nativeLanguageUpdated}
            />

            {/*<label>{strings.systemLanguage}</label>*/}
            {/*<UiLanguageSelector*/}
            {/*  languages={uiLanguages}*/}
            {/*  selected={uiLanguage.name}*/}
            {/*  onChange={(e) => {*/}
            {/*    let lang = uiLanguages.find(*/}
            {/*      (lang) =>*/}
            {/*        lang.code ===*/}
            {/*        e.target[e.target.selectedIndex].getAttribute("code")*/}
            {/*    );*/}
            {/*    onSysChange(lang);*/}
            {/*  }}*/}
            {/*/>*/}

            <br />
            <br />

            <label>Exercise Type Preferences</label>
            <div style={{ display: "flex" }} className="form-group">
              <input
                style={{ width: "1.5em" }}
                type={"checkbox"}
                checked={audioExercises}
                onChange={handleAudioExercisesChange}
              />
              <label>
                Include Audio Exercises{" "}
                {SessionStorage.isAudioExercisesEnabled()
                  ? ""
                  : "(Temporaly Disabled)"}
              </label>
            </div>
            {Feature.merle_exercises() && (
              <div style={{ display: "flex" }} className="form-group">
                <input
                  style={{ width: "1.5em" }}
                  type={"checkbox"}
                  checked={productiveExercises}
                  onChange={handleProductiveExercisesChange}
                />
                <label>Enable productive exercises</label>
              </div>
            )}
            <div>
              <s.FormButton onClick={handleSave}>{strings.save}</s.FormButton>
            </div>
          </form>

          {!user.is_teacher && (
            <div>
              <p className="current-class-of-student">
                <b>
                  {studentIsInCohort
                    ? strings.yourCurrentClassIs + currentCohort
                    : strings.youHaveNotJoinedAClass}
                </b>
              </p>
              <label className="change-class-string">
                {studentIsInCohort ? strings.changeClass : strings.joinClass}
              </label>
              <input
                type="text"
                placeholder={
                  studentIsInCohort
                    ? strings.insertNewInviteCode
                    : strings.insertInviteCode
                }
                value={inviteCode}
                onChange={(event) => handleInviteCodeChange(event)}
              />

              {showJoinCohortError && (
                <Error message={strings.checkIfInviteCodeIsValid} />
              )}

              <s.FormButton onClick={saveStudentToClass}>
                {studentIsInCohort ? strings.changeClass : strings.joinClass}
              </s.FormButton>
            </div>
          )}
        </scs.StyledSettings>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </s.FormContainer>
    </>
  );
}

function language_for_id(id, language_list) {
  for (let i = 0; i < language_list.length; i++) {
    if (language_list[i].code === id) {
      return language_list[i].name;
    }
  }
}
