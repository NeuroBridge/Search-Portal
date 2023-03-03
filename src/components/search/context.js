import { createContext, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useLocalStorage } from '../../hooks'
import { useAppContext } from '../../context'

//

axios.defaults.timeout = 5000
const NB_API_URL = `https://neurobridges-ml.renci.org/nb_translator`
const NQ_API_URL = `https://neurobridges.renci.org:13374/query`

const getPubMedCentralLink = (pmcid) => `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/`;
const getPubMedLink = (pmid) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

//

const SearchContext = createContext({ })
export const useSearch = () => useContext(SearchContext)

//

export const SearchProvider = ({ children }) => {
  const { notify } = useAppContext()
  const [results, setResults] = useState({
    NeuroBridge: [],
    NeuroQuery: [], 
  })
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
        NB_API_URL,
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

  const nqFetchResults = (query) => {
    return axios.get(NQ_API_URL, { params: { searchTerms: query } })
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
        console.log(error)
        return []
      })
  };

  const fetchResults = async (nbQuery, nqQuery) => {
    clearResults()
    setLastRequestTime(Date.now())
    setLoading(true)
    Promise.all([
      nbFetchResults(nbQuery),
      nqFetchResults(nqQuery),
    ])
      .then(([nbResults, nqResults]) => {
        setResults({
          NeuroBridge: nbResults,
          NeuroQuery: nqResults,
        })
      })
      .catch(error => {
        console.error(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const clearResults = () => {
    setResults({ NeuroBridge: [], NeuroQuery: [] })
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
    }}>
      { children }
    </SearchContext.Provider>
  )
}

SearchProvider.propTypes = {
  children: PropTypes.node,
}
