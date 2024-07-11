import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import * as s from "../components/TopMessage.sc";
import * as d from "./MySearches.sc";
import ArticlePreview from "./ArticlePreview";
import { setTitle } from "../assorted/setTitle";
import useSelectInterest from "../hooks/useSelectInterest";
import redirect from "../utils/routing/routing.js";
import SubscribeSearchButton from "./SubscribeSearchButton.js";

export default function MySearches({ api }) {
  const { subscribedSearches } = useSelectInterest(api);
  const [articlesBySearchTerm, setArticlesBySearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (subscribedSearches) {
      setTitle("Saved Searches");
      fetchData();
    }

    return () => {
      setIsLoading(true);
    };
  }, [subscribedSearches]);

  async function processItem(searchTerm) {
    return new Promise((resolve) => {
      api.search(searchTerm, (articles) => {
        const limitedArticles = articles.slice(0, 2);
        resolve({ searchTerm, articles: limitedArticles });
      });
    });
  }

  async function processArray(subscribedSearches) {
    const promises = subscribedSearches.map((searchTerm) =>
      processItem(searchTerm.search),
    );
    return Promise.all(promises);
  }

  async function fetchData() {
    processArray(subscribedSearches).then((results) => {
      setArticlesBySearchTerm(results);
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (subscribedSearches && subscribedSearches.length === 0) {
    return <s.TopMessage>{strings.NoSavedSearches}</s.TopMessage>;
  }

  return (
    <>
      {articlesBySearchTerm.map(({ searchTerm, articles }) => (
        <div key={searchTerm}>
          <d.HeadlineSavedSearches>{searchTerm}</d.HeadlineSavedSearches>
          <SubscribeSearchButton api={api} query={searchTerm} />

          {articles.map((each) => (
            <ArticlePreview key={each.id} api={api} article={each} />
          ))}
          <d.buttonMoreArticles
            onClick={(e) => redirect(`/search?search=${searchTerm}`)}
          >
            See more articles
          </d.buttonMoreArticles>
        </div>
      ))}
    </>
  );
}
