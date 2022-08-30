import { /*useCallback, */useState } from 'react'
import { TextField } from '@mui/material'
import axios from 'axios'

axios.defaults.timeout = 5000

// const API_URL = `https://neurobridges-ml.renci.org/nb_translator`

const initialQuery = `{
  "and": [
    "Depression"
  ]
}`

export const Form = () => {
  const [query, setQuery] = useState(initialQuery)

  const handleChangeQuery = event => setQuery(event.target.value)

  // const requestFunction = useCallback(async () => {
  //   try {
  //     const { data } = await axios.post(
  //       API_URL,
  //       JSON.stringify({ query: { expression: query } }),
  //       { headers: { 'content-type': 'text/html;charset=utf-8' } },
  //     )
  //     if (!data) {
  //       throw new Error('An error occurred while fetching results.')
  //     }
  //     console.log(data)
  //     const results = Object.values(data).map(result => ({
  //       title: result.title,
  //       snippet: result.snippet,
  //       pmc_link: result.pmc_link,
  //       url: result.pmc_link,
  //       score: result.score,
  //       pmid: result.pmid,
  //       pmcid: result.pmcid,
  //     }))
  //     return results
  //   } catch (error) {
  //     console.error(error.message)
  //     return []
  //   }
  // }, [query])

  return (
    <div>
      <TextField
        maxRows={ 10 }
        id="query-textarea"
        label="Query"
        fullWidth
        multiline
        value={ query }
        onChange={ handleChangeQuery }
        inputProps={{ sx: { fontFamily: 'monospace' } }}
      />
    </div>
  )
}
