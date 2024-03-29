import { createContext, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useLocalStorage } from '../../hooks'
import { useAppContext } from '../../context'
import translatedTermsList from '../../data/nb-nq-translations.json';
import { PubMedAPIError } from './publication-tray/pubmed-api'

//

axios.defaults.timeout = 5000

const getPubMedCentralLink = (pmcid) => `${process.env.PUBMED_CENTRAL_URL}/${pmcid}/`;
const getPubMedLink = (pmid) => `${process.env.PUBMED_URL}/${pmid}/`;

//

const SearchContext = createContext({ })
export const useSearch = () => useContext(SearchContext)

//

export const SearchProvider = ({ children }) => {
  const { notify } = useAppContext()
  const [results, setResults] = useState({
    NeuroBridge: [],
    NeuroQuery: [], 
    Flywheel: [], 
  })
  const [translatedTerms, setTranslatedTerms] = useState([]);
  const [lastRequestTime, setLastRequestTime] = useState(null)
  const [loading, setLoading] = useState(false)
  /*
    the term `search` is overloaded in the code base.
    there are really _two_ searches:
    - one searches the ontology for terms
    - the other hits the NB and NQ APIs, searching for publications.
    this context provider was started to encompass the latter. however, the
    fact that these `searchHistory`-related variables ended up here indicates
    that there is some confusion and we could stand to benefit from drawing
    some hard lines to keep these two notions separate.
  */
  const [searchHistory, setSearchHistory] = useLocalStorage('nb-search-history', {})
  
  const addToSearchHistory = id => {
    let newSearchHistory = { ...searchHistory }
    newSearchHistory[id] = Date.now()
    setSearchHistory({ ...newSearchHistory })
  }

  const resetSearchHistory = () => {
    setSearchHistory({})
  }

  const totalResultCount = useMemo(() => Object.values(results).reduce((sum, someResults) => {
    return sum + someResults.length
  }, 0))

  // the query, which is kept in QueryBuilder state,
  // is passed into this function.
  const nbFetchResults = query => {
    return axios.post(
        process.env.NB_API_URL,
        JSON.stringify({ query: { expression: query }, max_res: 100 }),
        { headers: { 'Content-Type': 'text/html;charset=utf-8' } },
      )
      .then(({ data }) => {
        if (!data?.docs) {
          throw new Error('An error occurred while fetching NeuroBridge results.')
        }
        return data.docs.map(result => ({
          title: result.title,
          snippet: result.snippet,
          score: result.score,
          pmid: result.pmid,
          pubmed_url: getPubMedLink(result.pmid),
          pmcid: result.pmcid,
          pmc_url: getPubMedCentralLink(result.pmcid),
        }))
      })
      .catch(error => {
        notify('There was an error communicating with the NeuroBridge API.', 'error')
        console.log(error)
        return []
      })
  };

  const fwFetchResults = query => {
    return axios.post(
        process.env.FW_API_URL,
        JSON.stringify({ query: { expression: query }, max_res: 100 }),
        { headers: { 'Content-Type': 'text/html;charset=utf-8' } },
      )
      .then(({ data }) => {
        if (!data?.docs) {
          throw new Error('An error occurred while fetching Flywheel results.')
        }
        return data.docs.map((res) => ({
          ...res,
          pmid: res.id,
        }));
      })
      .catch(error => {
        notify('There was an error communicating with the Flywheel API.', 'error')
        console.log(error)
        return []
      })
  };

  const nqFetchResults = async (selectedTerms) => {
    if(!Array.isArray(selectedTerms) || selectedTerms?.length === 0) return [];
    
    const translated = selectedTerms.reduce((acc, cur) => {
      const currentTermSynonym = translatedTermsList[cur]?.[0]?.[cur]?.[0]?.term;
      if(!currentTermSynonym) return acc;

      acc.push(currentTermSynonym);
      return acc;
    }, []);
    setTranslatedTerms(translated);

    if(translated?.length === 0) return [];

    return await axios.get(process.env.NQ_API_URL, { params: { searchTerms: translated.join('+') } })
      .then(({ data }) => {
        if (!data?.data) {
          throw new Error('An error occurred while fetching NeuroQuery results.')
        }
        return data.data.map(result => ({
          title: result.title,
          snippet: result.snippet,
          pubmed_url: result.pubmed_url,
          pmid: result.pmid,
          score: result.similarity,
        }))        
      })
      .catch(error => {
        notify('There was an error communicating with the NeuroQuery API.', 'error')
        console.error(error)
        return []
      })
  };

  // convert the NQ pmids into PMCIDs using the Pubmed API, if they exist
  const translatePMIDs = async (nqResults) => {
    if (!Array.isArray(nqResults)) return;
    
    // the PubMed API only allows 200 ids to be translated at a time. For now,
    // since we only every have 100 ids maximum, we can trim the request to the
    // first 200 and throw an warning just to be safe.
    const MAX_IDS = 200;
    if(nqResults.length > 200) {
      throw new PubMedAPIError(`You requested that ${nqResults.length} NeuroQuery IDs be translated, but the API only supports ${MAX_IDS}`)
    }
    
    const ids = nqResults
      .map(({ pmid }) => pmid)
      .filter(pmid => typeof pmid === 'number')
      .slice(0, MAX_IDS)
      .join(',');

    let res;
    try {
      res = await axios.get('https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/', {
        params: {
          tool: 'neurobridge',
          email: 'comms@renci.org',
          idtype: 'pmid',
          format: 'json',
          versions: 'no',
          ids
        }
      });
    }
    catch (error) {
      throw new PubMedAPIError(`Error contacting the PubMed ID translation API`);
    }
    if(res.status !== 200) {
      throw new PubMedAPIError(`Error translating NeuroQuery PMIDs: ${res.statusText}`);
    }

    // create pmid => pmcid map, since the PubMed API response isn't ordered
    const translationList = res?.data?.records;
    if(!Array.isArray(translationList)) return;
    const translationMap = new Map();

    translationList.forEach(({pmid, pmcid}) => {
      translationMap.set(pmid, pmcid);
    });

    // now update the results object with the translationMap:
    setResults((prev) => ({
      ...prev,
      NeuroQuery: nqResults.map((article) => ({
        ...article,
        pmcid: translationMap.get(`${article.pmid}`),
        pmc_url: getPubMedCentralLink(translationMap.get(`${article.pmid}`))
      }))
    }))
  }

  const fetchResults = async (nbQuery, nqQuery) => {
    clearResults()
    setLastRequestTime(Date.now())
    setLoading(true)
    Promise.all([
      nbFetchResults(nbQuery),
      nqFetchResults(nqQuery),
      fwFetchResults(nbQuery), // this is in the same solr db and has the same input format as NB
    ])
      .then(([nbResults, nqResults, fwResults]) => {
        setResults({
          NeuroBridge: nbResults,
          NeuroQuery: nqResults,
          Flywheel: fwResults,
        })
        setLoading(false);
        return nqResults;
      })
      .then((nqResults) => {
        translatePMIDs(nqResults).catch((error) => {
          console.error(error);
          notify(error.message);
        });
      })
      .catch(error => {
        console.error(error.message)
      })
  };

  const clearResults = () => {
    setResults({ NeuroBridge: [], NeuroQuery: [], Flywheel: [] })
  }

  return (
    <SearchContext.Provider value={{
      clearResults,
      fetchResults,
      lastRequestTime,
      loading,
      results,
      searchHistory, addToSearchHistory, resetSearchHistory,
      totalResultCount,
      translatedTerms,
    }}>
      { children }
    </SearchContext.Provider>
  )
}

SearchProvider.propTypes = {
  children: PropTypes.node,
}
