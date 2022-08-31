import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import axios from 'axios'
import { useWorkspace } from '../../workspace'

axios.defaults.timeout = 5000

const API_URL = `https://neurobridges-ml.renci.org/nb_translator`

const initialQuery = `{
  "and": [
    "Depression"
  ]
}`

export const Form = () => {
  const [query, setQuery] = useState(initialQuery)
  const { register } = useWorkspace()

  const handleChangeQuery = event => setQuery(event.target.value)

  useEffect(() => {
    const fetchResults = () => axios.post(
        API_URL, // url
        { query: { expression: JSON.parse(query) } }, // data
        { headers: { 'content-type': 'application/json' } }, // options
      ).then(response => {
        const { data } = response
        if (!data) {
          throw new Error('An error occurred while fetching results.')
        }
        const results = Object.values(data).map(result => ({
          title: result.title,
          snippet: result.snippet,
          pmc_link: result.pmc_link,
          url: result.pmc_link,
          score: result.score,
          pmid: result.pmid,
          pmcid: result.pmcid,
        }))
        return results
      }).catch(error => {
        console.error(error.message)
        return []
      })
    register('example', fetchResults)
  }, [query])

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
