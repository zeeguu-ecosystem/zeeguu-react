import { useState, useRef, useEffect } from "react";
import Select from "../components/Select";

import redirect from "../utils/routing/routing";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import InputField from "./info_page_shared/InputField";
import SelectOptions from "./info_page_shared/SelectOptions";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";

import validator from "../assorted/validator";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import { CEFR_LEVELS } from "../assorted/cefrLevels";

import * as s from "../components/FormPage.sc";
import PrivacyNotice from "./PrivacyNotice";
import * as EmailValidator from "email-validator";

export default function CreateAccount({ api, handleSuccessfulSignIn }) {
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [learned_language, setLearned_language] = useState("");
  const [native_language, setNative_language] = useState("en");
  const [learned_cefr_level, setLearned_cefr_level] = useState("");

  const [systemLanguages, setSystemLanguages] = useState();

  const [errorMessage, setErrorMessage] = useState("");

  let inviteCodeInputDOM = useRef();

  useEffect(() => {
    api.getSystemLanguages((languages) => {
      languages.learnable_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      languages.native_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      setSystemLanguages(languages);
      // inviteCodeInputDOM.current.focus();
    });
    // eslint-disable-next-line
  }, []);

  if (!systemLanguages) {
    return <LoadingAnimation />;
  }

  let validatorRules = [
    [name === "", strings.nameIsRequired],
    [!EmailValidator.validate(email), strings.plsProvideValidEmail],
    [learned_language === "", strings.learnedLanguageIsRequired],
    [learned_cefr_level === "", strings.languagelevelIsRequired],
    [native_language === "", strings.plsSelectBaseLanguage],
    [password.length < 4, strings.passwordMustBeMsg],
  ];

  function handleCreate(e) {
    e.preventDefault();

    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }

    let userInfo = {
      name: name,
      email: email,
      learned_language: learned_language,
      native_language: native_language,
      learned_cefr_level: learned_cefr_level,
    };

    api.addUser(
      inviteCode,
      password,
      userInfo,
      (session) => {
        api.getUserDetails((userInfo) => {
          handleSuccessfulSignIn(userInfo);
          redirect("/select_interests");
        });
      },
      (error) => {
        setErrorMessage(error);
      },
    );
  }

  return (
    <InfoPage>
      <Header>
        <Heading>{strings.createAccount}</Heading>
      </Header>
      <Main>
        <Form action={""}>
          <p>
            {strings.thankYouMsgPrefix}
            <a
              href="mailto:zeeguu.team@gmail.com?subject=Invitation Code Request&body=Dear Zeeguu Team,
              %0D%0A%0D%0AI would like to request the Invitation Code to register for Zeeguu.%0D%0A%0D%0AThank you!"
            >
              <b> zeeguu.team@gmail.com</b>
            </a>
            {strings.thankYouMsgSuffix}
          </p>

          <InputField
            type={"text"}
            label={strings.inviteCode}
            id={"invite-code"}
            name={"invite-code"}
            placeholder={strings.code}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />

          <InputField
            type={"text"}
            label={strings.name}
            id={"name"}
            name={"name"}
            placeholder={strings.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputField
            type={"email"}
            label={strings.email}
            id={"email"}
            name={"email"}
            placeholder={strings.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            type={"password"}
            label={strings.password}
            id={"password"}
            name={"password"}
            placeholder={strings.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <SelectOptions
            placeholder={"select a language"}
            label={(e) => e.name}
            val={(e) => e.code}
            id={"practiced-languages"}
            selectLabel={strings.learnedLanguage}
            options={systemLanguages.learnable_languages}
            onChange={setLearned_language}
          />

          <SelectOptions
            placeholder={"select your level"}
            label={(e) => e.label}
            val={(e) => e.value}
            id={"level-of-practiced-languages"}
            selectLabel={strings.levelOfLearnedLanguage}
            options={CEFR_LEVELS}
            onChange={setLearned_cefr_level}
          />

          <SelectOptions
            placeholder={"select a language"}
            label={(e) => e.name}
            val={(e) => e.code}
            id={"translation-languages"}
            selectLabel={strings.baseLanguage}
            options={systemLanguages.native_languages}
            onChange={setNative_language}
            current={"en"}
          />

          {/* <div className="inputField">
            <label>{strings.learnedLanguage}</label>

            <Select
              elements={systemLanguages.learnable_languages}
              label={(e) => e.name}
              val={(e) => e.code}
              updateFunction={setLearned_language}
            />
          </div>

          <div className="inputField">
            <label>{strings.levelOfLearnedLanguage}</label>

            <Select
              elements={CEFR_LEVELS}
              label={(e) => e.label}
              val={(e) => e.value}
              updateFunction={setLearned_cefr_level}
            />
          </div>

          <div className="inputField">
            <label>{strings.baseLanguage}</label>

            <Select
              elements={systemLanguages.native_languages}
              label={(e) => e.name}
              val={(e) => e.code}
              updateFunction={setNative_language}
              current={"en"}
            />
          </div> */}

          <PrivacyNotice />

          {errorMessage && <div className="error">{errorMessage}</div>}

          <div className="inputField">
            <Button onClick={handleCreate}>{strings.createAccount}</Button>
          </div>
        </Form>
      </Main>
      <Footer>
        <p>
          <a className="links" href="/login">
            {strings.alreadyHaveAccount}
          </a>
        </p>
      </Footer>
    </InfoPage>
  );
}
