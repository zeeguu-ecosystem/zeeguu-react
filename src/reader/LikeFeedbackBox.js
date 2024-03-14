import { UMR_SOURCE } from "./ArticleReader";
import * as s from "./ArticleReader.sc";
import strings from "../i18n/definitions";

export default function LikeFeedbackBox({
  api,
  articleID,
  articleInfo,
  setArticleInfo,
  source,
}) {
  function setLikedState(state) {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setArticleInfo(newArticleInfo);
    });
    api.logReaderActivity(api.LIKE_ARTICLE, articleID, state, source);
  }

  return (
    <s.InvisibleBox>
     
      <h4>{strings.didYouEnjoyMsg}</h4>

      <s.CenteredContent>
        <s.WhiteButton
          onClick={(e) => setLikedState(true)}
          className={articleInfo.liked === true && "selected"}
        >
          {strings.yes}
        </s.WhiteButton>
        <s.WhiteButton
          onClick={(e) => setLikedState(false)}
          className={articleInfo.liked === false && "selected"}
        >
          {strings.no}
        </s.WhiteButton>
      </s.CenteredContent>
    </s.InvisibleBox>
  );
}
