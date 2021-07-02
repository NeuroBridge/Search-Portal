import { useState } from "react"
import { Container, Header, Grid, Input, Loader, Dimmer } from "semantic-ui-react"
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
        const { data } = await axios.get(`https://www.ebi.ac.uk/ols/api/ontologies/${searchVal}/terms`)
        if(!data) {
          throw new Error('an error occurred while trying to get the results')
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
        <Header inverted content="OLS Terms" />
      </header>
      <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column>
              <p style={{marginTop: "2rem"}}><b>Enter an ontology id/short name</b></p>
              <Input 
                id="search-field"
                action={{icon: "search", onClick: handleSubmit}}
                size="large"
                placeholder="e.g. Cardiovascular Disease = cvdo"
                value={searchVal}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                fluid
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <div className="results">
                {loading && !errMsg ? (
                  <Dimmer active inverted>
                    <Loader inverted>Waiting for Results...</Loader>
                  </Dimmer>
                ) : errMsg ? (
                  <div className="errorMessage">{errMsg}</div>
                  ) : (
                  <p className="App-intro">Here are all the terms associated with the ontology you searched for:</p>

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
