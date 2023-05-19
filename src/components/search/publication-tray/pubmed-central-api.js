import { useEffect, useState } from "react";
import { localStorageCache } from "../../../util/localstorage-cache";

const cache = localStorageCache("cached-associated-data");

export const usePubMedCentralAPI = (pmcid) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [article, setArticle] = useState({
    dataAvailability: null,
    supplementaryMaterials: null,
  });

  const fetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const api = new PubMedCentralAPI(pmcid);
      await api.fetch();

      const article = {
        dataAvailability: api.getDataAvailability(),
        supplementaryMaterials: api.getSupplementaryMaterials(),
      };
      setArticle(article);
      setLoading(false);
      cache.set(pmcid, article);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    setLoading(false);
    (async () => {
      if (!pmcid) return;

      const cachedPublication = cache.get(pmcid);
      if (cachedPublication !== null) {
        setArticle(cachedPublication);
        return;
      }

      await fetch();
    })();
  }, [pmcid]);

  return {
    error,
    loading,
    fetch,
    article,
  };
};

export class PubMedCentralAPI {
  #pmcid;
  #url;
  #pubmedcentralXML;

  constructor(pmcid) {
    if (typeof pmcid === "undefined") {
      throw new PubMedCentralAPIError("No PCMID was provided.");
    }
    this.#pmcid = pmcid;
    this.#url = this.#urlFromPMCID(this.#pmcid);
  }

  async fetch() {
    await this.#fetchXML();
    return this;
  }

  /**
   * @returns {string | null}
   */
  getDataAvailability() {
    if (!this.#pubmedcentralXML) return null;

    const paragraphEls = this.#pubmedcentralXML.querySelectorAll(
      'sec[sec-type="data-availability"] p'
    );
    if (paragraphEls.length === 0) {
      return (
        this.#pubmedcentralXML.querySelector(
          'custom-meta[id="data-availability"] > meta-value'
        )?.textContent ?? null
      );
    }

    return [...paragraphEls].reduce(
      (acc, cur) => (cur.textContent ? acc + " " + cur.textContent : acc),
      ""
    );
  }

  /**
   * @returns {{
   *   title?: string,
   *   materials: {
   *     intro?: string,
   *     label?: string,
   *     caption?: string,
   *     href?: string,
   *   }[]} | null}
   */
  getSupplementaryMaterials() {
    if (!this.#pubmedcentralXML) return null;

    const sectionTitle = this.#pubmedcentralXML.querySelector(
      'sec[sec-type="supplementary-material"] > title'
    );
    const title = sectionTitle?.textContent ?? null;

    const smEls = this.#pubmedcentralXML.querySelectorAll(
      "supplementary-material"
    );

    const materials = [...smEls].reduce((acc, cur) => {
      const intro = cur.querySelector("p:not(caption p)")?.textContent;
      const label = cur.querySelector("label")?.textContent;

      let caption = cur.querySelector("caption")?.textContent;
      if (typeof caption === "string")
        caption = caption.replaceAll(/\n */g, "");

      const mediaEl = cur.querySelector("media");
      const href = mediaEl?.getAttribute("xlink:href");

      if (!intro && !label && !caption && !href) return acc;

      acc.push({
        ...(intro && { intro }),
        ...(label && { label }),
        ...(caption && { caption }),
        ...(href && { href }),
      });
      return acc;
    }, []);

    return {
      ...(title && { title }),
      materials,
    };
  }

  // ========== PRIVATE METHODS ==========
  #urlFromPMCID() {
    return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=${
      this.#pmcid
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
    this.#pubmedcentralXML = new window.DOMParser().parseFromString(
      text,
      "text/xml"
    );

    const error = this.#pubmedcentralXML
      .getElementsByTagName("eFetchResult")[0]
      ?.getElementsByTagName("ERROR")[0]?.textContent;
    if (error) {
      throw new PubMedCentralAPIError(error);
    }
  }
  // ======================================
}

export class PubMedCentralAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = "PubMedCentralAPIError";
  }
}
