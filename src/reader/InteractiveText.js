import LinkedWordList from "./LinkedWordListClass";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { tokenize } from "../utils/text/preprocessing";
import { removePunctuation } from "../utils/text/preprocessing";
import isNullOrUndefinied from "../utils/misc/isNullOrUndefinied";

// We try to capture about a full sentence around a word.
const MAX_WORD_EXPANSION_COUNT = 14;
function wordShouldSkipCount(word) {
  //   When building context, we do not count for the context limit punctuation,
  // symbols, and numbers.
  return word.token.is_punct || word.token.is_symbol || word.token.is_like_num;
}
export default class InteractiveText {
  constructor(
    tokenizedParagraphs,
    articleID,
    isArticleContent,
    api,
    previousBookmarks,
    translationEvent = api.TRANSLATE_TEXT,
    language,
    source = "",
    zeeguuSpeech,
  ) {
    function _updateTokensWithBookmarks(bookmarks, paragraphs) {
      for (let i = 0; i < bookmarks.length; i++) {
        let bookmark = bookmarks[i];
        let target_p_i, target_s_i, target_t_i;
        let target_token;
        target_p_i = bookmark["context_paragraph"];
        target_s_i = bookmark["context_sent"] + bookmark["t_sentence_i"];
        target_t_i = bookmark["context_token"] + bookmark["t_token_i"];

        // If any the coordinates are null / undefined, we skip.
        if (
          isNullOrUndefinied(target_p_i) ||
          isNullOrUndefinied(target_s_i) ||
          isNullOrUndefinied(target_t_i)
        )
          continue;
        target_token = paragraphs[target_p_i][target_s_i][target_t_i];
        /*
        Before we update the target token we want to check two cases:
         1. The bookmark isn't defined. 
         If the bookmark is defined it means a bookmark is trying to override another
         previous bookmark.
         2. The bookmark text, doesn't match the token.
         In this case, we might have an error in the coordinates, and for that reason
         we don't update the original text.
         */
        if (target_token.bookmark) {
          continue;
        }
        let bookmarkTokensSimplified = tokenize(bookmark["origin"]);
        // Text and Bookmark will have different tokenization.
        let bookmark_i = 0;
        let text_i = 0;
        let shouldSkipBookmarkUpdate = false;
        while (bookmark_i < bookmarkTokensSimplified.length) {
          let bookmark_word = removePunctuation(bookmarkTokensSimplified[0]);
          let text_word = removePunctuation(
            paragraphs[target_p_i][target_s_i][target_t_i + text_i].text,
          );
          while (text_word.length === 0 && text_word) {
            text_word = removePunctuation(
              paragraphs[target_p_i][target_s_i][target_t_i + text_i].text,
            );
            text_i++;
          }
          if (bookmark_word !== text_word) {
            shouldSkipBookmarkUpdate = true;
            break;
          }
          bookmark_i++;
        }
        if (shouldSkipBookmarkUpdate) continue;
        target_token.bookmark = bookmark;
        /*
          When rendering the words in the frontend, we alter the word object to be composed
          of multiple tokens.
          In case of deleting a bookmark, we need to make sure that all the tokens are 
          available to re-render the original text. 
          To do this, we need to ensure that the stored token is stored without a bookmark,
          so when those are retrieved the token is seen as a token rather than a bookmark. 
         */
        target_token.mergedTokens = [{ ...target_token, bookmark: null }];
        for (let i = 1; i < bookmark["t_total_token"]; i++) {
          target_token.mergedTokens.push({
            ...paragraphs[target_p_i][target_s_i][target_t_i + i],
          });
          paragraphs[target_p_i][target_s_i][target_t_i + i].skipRender = true;
        }
      }
    }
    this.api = api;
    this.article_id = articleID;
    this.language = language;
    this.isArticleContent = articleID && isArticleContent;
    this.translationEvent = translationEvent;
    this.source = source;

    // Might be worth to store a flag to keep track of wether or not the
    // bookmark / text are part of the content or stand by themselves.
    this.previousBookmarks = previousBookmarks.filter(
      (each) =>
        (isArticleContent && each.in_content) ||
        (!isArticleContent && !each.in_content),
    );
    this.paragraphs = tokenizedParagraphs;
    _updateTokensWithBookmarks(this.previousBookmarks, this.paragraphs);
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      (sent) => new LinkedWordList(sent),
    );
    if (language !== zeeguuSpeech.language) {
      this.zeeguuSpeech = new ZeeguuSpeech(api, language);
    } else {
      this.zeeguuSpeech = zeeguuSpeech;
    }
  }

  getParagraphs() {
    return this.paragraphsAsLinkedWordLists;
  }

  translate(word, fuseWithNeighbours, onSuccess) {
    let context, cParagraph_i, cSent_i, cToken_i, leftEllipsis, rightEllipsis;

    [context, cParagraph_i, cSent_i, cToken_i, leftEllipsis, rightEllipsis] =
      this.getContextAndCoordinates(word);
    if (fuseWithNeighbours) word = word.fuseWithNeighborsIfNeeded(this.api);
    let wordSent_i = word.token.sent_i - cSent_i;
    let wordToken_i = word.token.token_i - cToken_i;
    console.log(word);
    this.api
      .getOneTranslation(
        this.language,
        localStorage.native_language,
        word.word,
        [wordSent_i, wordToken_i, word.total_tokens],
        context,
        [cParagraph_i, cSent_i, cToken_i],
        this.article_id,
        this.isArticleContent,
        leftEllipsis,
        rightEllipsis,
      )
      .then((response) => response.json())
      .then((data) => {
        word.updateTranslation(
          data.translation,
          data.service_name,
          data.bookmark_id,
        );
        onSuccess();
      })
      .catch((e) => {
        console.log("could not retreive translation");
      });

    this.api.logReaderActivity(
      this.translationEvent,
      this.article_id,
      word.word,
      this.source,
    );
  }

  selectAlternative(word, alternative, preferredSource, onSuccess) {
    let context;
    [context] = this.getContextAndCoordinates(word);
    this.api.updateBookmark(
      word.bookmark_id,
      word.word,
      alternative,
      context,
      this.isArticleContent,
    );
    word.translation = alternative;
    word.service_name = "Own alternative selection";

    let alternative_info = `${word.translation} => ${alternative} (${preferredSource})`;
    this.api.logReaderActivity(
      this.api.SEND_SUGGESTION,
      this.article_id,
      alternative_info,
      this.source,
    );

    onSuccess();
  }

  alternativeTranslations(word, onSuccess) {
    let context;
    [context] = this.getContextAndCoordinates(word);
    this.api
      .getMultipleTranslations(
        this.language,
        localStorage.native_language,
        word.word,
        context,
        -1,
        word.service_name,
        word.translation,
        this.article_id,
      )
      .then((response) => response.json())
      .then((data) => {
        word.alternatives = data.translations;
        onSuccess();
      });
  }

  playAll() {
    console.log("playing all");
    this.zeeguuSpeech.playAll(this.article_id);
  }

  pause() {
    console.log("pausing");
    this.zeeguuSpeech.pause();
  }

  resume() {
    console.log("resuming");
    this.zeeguuSpeech.resume();
  }

  pronounce(word, callback) {
    this.zeeguuSpeech.speakOut(word.word);

    this.api.logReaderActivity(
      this.api.SPEAK_TEXT,
      this.article_id,
      word.word,
      this.source,
    );
  }

  getContextAndCoordinates(word) {
    function getLeftContextAndStartIndex(word, maxLeftContextLength) {
      let currentWord = word;
      let contextBuilder = "";
      let count = 0;
      while (count < maxLeftContextLength && currentWord.prev) {
        currentWord = currentWord.prev;
        contextBuilder =
          currentWord.word +
          (currentWord.token.has_space ? " " : "") +
          contextBuilder;
        if (
          currentWord.token.is_sent_start ||
          currentWord.token.token_i === 0
        ) {
          break;
        }
        if (!wordShouldSkipCount(currentWord)) count++;
      }
      return [
        contextBuilder,
        currentWord.token.paragraph_i,
        currentWord.token.sent_i,
        currentWord.token.token_i,
      ];
    }

    function getRightContext(word, maxRightContextLength) {
      let currentWord = word;
      let contextBuilder = "";
      let hasRightEllipsis = true;
      let count = 0;
      while (count < maxRightContextLength && currentWord) {
        if (
          currentWord.token.is_sent_start &&
          currentWord.token.sent_i !== currentWord.prev.token.sent_i
        ) {
          break;
        }

        contextBuilder =
          contextBuilder +
          (currentWord.prev.token.has_space ? " " : "") +
          currentWord.word;
        if (!wordShouldSkipCount(currentWord))
          // If it's not a punctuation or symbol we count it.
          count++;
        currentWord = currentWord.next;
      }
      // We broke early, or we didn't have more tokens in the link early.
      // We are at the end of paragraph (currentWord undefined),
      // or we broke early (found end of sent.)
      if (count < maxRightContextLength) hasRightEllipsis = false;
      return [contextBuilder, hasRightEllipsis];
    }

    let [leftContext, paragraph_i, sent_i, token_i] = [
      "",
      word.token.paragraph_i,
      word.token.sent_i,
      word.token.token_i,
    ];
    // Do not get left context, if we are starting a sentence
    // at the token.
    if (word.prev && !word.token.is_sent_start)
      [leftContext, paragraph_i, sent_i, token_i] = getLeftContextAndStartIndex(
        word,
        MAX_WORD_EXPANSION_COUNT,
      );
    let leftEllipsis = token_i !== 0;
    let [rightContext, rightEllipsis] = getRightContext(
      word.next,
      MAX_WORD_EXPANSION_COUNT,
    );
    let context = leftContext + word.word + rightContext;
    console.log("Final context: ", context);
    return [context, paragraph_i, sent_i, token_i, leftEllipsis, rightEllipsis];
  }
}
