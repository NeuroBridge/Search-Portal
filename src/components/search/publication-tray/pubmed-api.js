import { useEffect, useState } from "react";
import { localStorageCache } from "../../../util/localstorage-cache";

const cache = localStorageCache("cached-publications");

export const usePubMedAPI = (pmid) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [article, setArticle] = useState({
    title: null,
    abstract: null,
    authors: null,
    date: null,
    journal: null,
    articleIds: null,
  });

  const fetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const api = new PubMedAPI(pmid);
      await api.fetch();

      const article = {
        title: api.getTitle(),
        abstract: api.getAbstract(),
        authors: api.getAuthors(),
        date: api.getDate(),
        journal: api.getJournal(),
        articleIds: api.getArticleIds(),
      };
      setArticle(article);
      setLoading(false);
      cache.set(pmid, article);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (!pmid) return;
      setLoading(false);

      const cachedPublication = cache.get(pmid);
      if (cachedPublication !== null) {
        setArticle(cachedPublication);
        return;
      }

      await fetch();
    })();
  }, [pmid]);

  return {
    error,
    loading,
    fetch,
    article,
  };
};

export class PubMedAPI {
  #pmid;
  #url;
  #pubmedXML;

  constructor(pmid) {
    if (typeof pmid === "undefined") {
      throw new PubMedAPIError("No PMID was provided.");
    }
    this.#pmid = pmid;
    this.#url = this.#urlFromPMID(this.#pmid);
  }

  async fetch() {
    await this.#fetchXML();
    return this;
  }

  /**
   *
   * @returns {string | null}
   */
  getTitle() {
    if (!this.#pubmedXML) return null;
    return this.#pubmedXML.querySelector("ArticleTitle")?.textContent ?? null;
  }

  /**
   * @returns {Array<{heading?: string, text: string}> | null}
   */
  getAbstract() {
    if (!this.#pubmedXML) return null;
    const abstractEl = this.#pubmedXML.querySelector("Abstract");
    if (!abstractEl) return null;
    const abstractTextEls = [...abstractEl.querySelectorAll("AbstractText")];
    if (abstractTextEls.length === 0) return null;

    return abstractTextEls.map((abstractTextEl) => ({
      ...(abstractTextEl.hasAttribute("Label") && {
        heading: abstractTextEl.getAttribute("Label"),
      }),
      text: abstractTextEl.textContent,
    }));
  }

  /**
   * @returns {Array<{lastName?: string, firstName?: string, initials?: string, affiliations?: Array<string>}> | null}
   */
  getAuthors() {
    if (!this.#pubmedXML) return null;
    const authorEls = [
      ...this.#pubmedXML.querySelectorAll("Author[ValidYN=Y]"),
    ];
    if (authorEls.length === 0) return null;
    return authorEls.map((authorEl) => {
      const firstName = authorEl.querySelector("ForeName")?.textContent;
      const lastName = authorEl.querySelector("LastName")?.textContent;
      const initials = authorEl.querySelector("Initials")?.textContent;
      const affiliations = [
        ...authorEl.querySelectorAll("AffiliationInfo > Affiliation"),
      ].map((a) => a.textContent);

      return {
        ...(Boolean(firstName) && { firstName }),
        ...(Boolean(lastName) && { lastName }),
        ...(Boolean(initials) && { initials }),
        ...(Boolean(affiliations) && { affiliations }),
      };
    });
  }

  /**
   * @returns {string | null}
   */
  getDate() {
    if (!this.#pubmedXML) return null;
    const pubDateEl = this.#pubmedXML.querySelector("PubDate");
    if (!pubDateEl) return null;

    const month = pubDateEl.querySelector("Month")?.textContent;
    const day = pubDateEl.querySelector("Day")?.textContent;
    const year = pubDateEl.querySelector("Year")?.textContent;

    let result = "";
    if (month) {
      result += `${month}. `;
    }
    if (day) {
      result += `${day}, `;
    }
    if (year) {
      result += year;
    }
    return result;
  }

  /**
   * @returns {string | null}
   */
  getJournal() {
    if (!this.#pubmedXML) return null;
    const journalEl = this.#pubmedXML.querySelector("ISOAbbreviation");
    if (!journalEl) return null;
    return journalEl.textContent;
  }

  /**
   * @returns {{ pubmed?: string, pmc?: string, mid?: string, doi?: string }}
   */
  getArticleIds() {
    if (!this.#pubmedXML) return null;
    const articleIdListEl = this.#pubmedXML.querySelector("ArticleIdList");
    if (!articleIdListEl) return null;
    const articleIdEls = [...articleIdListEl.querySelectorAll("ArticleId")];
    if (articleIdEls.length === 0) return null;

    const idTypes = ["pubmed", "mid", "pmc", "doi"];

    return articleIdEls.reduce((accum, articleEl) => {
      if (!articleEl.hasAttribute("IdType")) return accum;

      const idType = articleEl.getAttribute("IdType");
      if (!idTypes.includes(idType)) return accum;

      return {
        ...accum,
        [idType]: articleEl.textContent,
      };
    }, {});
  }

  // ========== PRIVATE METHODS ==========
  #urlFromPMID() {
    return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${
      this.#pmid
    }`;
  }
  async #fetchXML() {
    const response = await fetch(this.#url, {
      method: "GET",
      headers: {
        Accept: "application/xml",
      },
    });

    const text = await response.text();
    this.#pubmedXML = new window.DOMParser().parseFromString(text, "text/xml");

    const error = this.#pubmedXML
      .getElementsByTagName("eFetchResult")[0]
      ?.getElementsByTagName("ERROR")[0]?.textContent;
    if (error) {
      throw new PubMedAPIError(error);
    }
  }
  // ======================================
}

export class PubMedAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = "PubMedAPIError";
  }
}
