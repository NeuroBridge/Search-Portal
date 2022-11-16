import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

//

axios.defaults.timeout = 5000
const API_URL = `https://neurobridges-ml.renci.org/nb_translator`

//

const SearchContext = createContext({ })
export const useSearch = () => useContext(SearchContext)

//

export const SearchProvider = ({ children }) => {
  const [results, setResults] = useState({ })

  const fetchResults = async query => {
    try {
      const { data } = await axios.post(
        API_URL,
        JSON.stringify({ query: { expression: query }, max_res: 100 }),
        { headers: { 'Content-Type': 'text/html;charset=utf-8' } },
      )
      if (!data?.docs) {
        throw new Error('An error occurred while fetching results.')
      }
      const newResults = data.docs
        .map(result => ({
          title: result.title,
          snippet: result.snippet,
          score: result.score,
          pmid: result.pmid,
          pubmed_url: result.pmc_link,
          pmcid: result.pmcid,
          pmc_url: result.pmc_link,
        }))
      setResults(newResults)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <SearchContext.Provider value={{ fetchResults, results }}>
      { children }
    </SearchContext.Provider>
  )
}

SearchProvider.propTypes = {
  children: PropTypes.node,
}
