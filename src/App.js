import { useState } from "react"
import { Container, Header, Grid, Form, Input, Button } from "semantic-ui-react"
import './App.css';
import axios from 'axios'

import Results from "./components/Results";

function App() {
  const [searchVal, setSearchVal] = useState("")
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [errMsg, setErrMsg] = useState(null)

  const handleKeyDown = event => {
    if (event.keyCode === 13) {
      handleSubmit()
    }
  }
  const handleInputChange = e => {
    setSearchVal(e.target.value)
  }


  const handleSubmit = () => {
    setLoading(true)
    setErrMsg(null)

    const fetchTerms = async () => {
      try {
        const { data } = await axios.get(`http://www.ebi.ac.uk/ols/api/ontologies/${searchVal}/terms`)
        if(!data) {
          throw new Error('an error occured while trying to get the results')
        }
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }

    setResults([])
    fetchTerms()

  }

  return (
    <div className="App">
      <header className="App-header">
        <Header inverted content="OLS terms" />
      </header>
      <Container>
        <Grid centered>
          <Grid.Row>
            <Form>
              <Form.Field 
                  id="search-field"
                  control={Input}
                  label="Enter an ontology id (e.g. Cardiovascular Disease = cdvo"
                  placeholder="type an ontology id here"
                  value={searchVal}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
              />
              <Form.Field 
                  id="submit"
                  control={Button}
                  content="Search"
                  onClick={handleSubmit}
              />
            </Form>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <p className="App-intro">Here are all the terms associated with the ontology you searched for</p>
              <div className="results">
                {loading && !errMsg ? (
                  <span>Loading ...</span>
                ) : errMsg ? (
                  <div className="errorMessage">{errMsg}</div>
                ) : (
                  console.log(results)
                )
              }
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
