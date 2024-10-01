import useUnwantedContentPreferences from "../../hooks/useUnwantedContentPreferences";
import useFormField from "../../hooks/useFormField";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import { Heading } from "../_pages_shared/Heading.sc";
import { Main } from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form";
import { Button } from "../_pages_shared/Button.sc";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

import InputField from "../../components/InputField";
import Tag from "../_pages_shared/Tag";
import TagContainer from "../_pages_shared/TagContainer";

import strings from "../../i18n/definitions";
import BackArrow from "./settings_pages_shared/BackArrow";

export default function KeywordExclusions({ api }) {
  const { unwantedKeywords, addUnwantedKeyword, removeUnwantedKeyword } =
    useUnwantedContentPreferences(api);

  const [excludedWord, handleExcludedWordsChange, resetExcludedWords] =
    useFormField("");

  function handleAddNewSearchFilter(e) {
    e.preventDefault();
    if (excludedWord) {
      addUnwantedKeyword(excludedWord);
      resetExcludedWords();
    }
  }
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>Keyword Exclusions</Heading>
      </Header>
      <Main>
        <Form>
          <InputField
            value={excludedWord}
            onChange={handleExcludedWordsChange}
            helperText={strings.addUnwantedWordHelperText}
            placeholder={strings.unwantedWordPlaceholder}
          >
            <Button
              className="small-square-btn"
              onClick={handleAddNewSearchFilter}
            >
              <AddRoundedIcon />
            </Button>
          </InputField>
        </Form>
        <TagContainer>
          {unwantedKeywords.map((keyword) => (
            <div key={keyword.id} id={keyword.id}>
              <Tag
                className={"outlined-blue small"}
                onClick={() => removeUnwantedKeyword(keyword)}
              >
                {keyword.search}
                <HighlightOffRoundedIcon fontSize="small" />
              </Tag>
            </div>
          ))}
        </TagContainer>
      </Main>
    </PreferencesPage>
  );
}