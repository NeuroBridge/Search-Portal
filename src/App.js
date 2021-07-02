import { useState } from "react"
import { Container, Header, Grid, Input, Loader, Dimmer, List } from "semantic-ui-react"
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
        console.log("this is data", data._embedded.terms)
        setLoading(false)
        setResults(data._embedded.terms)
      } catch (err) {
        console.log(err)
        setLoading(false)
        setErrMsg(err)
      }
    }

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
              <p style={{marginTop: "2rem"}}><b>Enter an ontology id/short name</b> (<a href="https://www.ebi.ac.uk/ols/ontologies" target="_blank" rel="noreferrer">List of all ontologies</a>)</p>
              <Input 
                id="search-field"
                action={{icon: "search", onClick: handleSubmit}}
                size="large"
                placeholder="e.g. Chemical Methods = chmo"
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
                    //console.log("this is results", results)
                    <span>
                      <Header size="medium" className="App-intro">Here are all the terms associated with the <b>{searchVal}</b> ontology:</Header>
                      <List className="results">
                        {results.map(result => <Results term={result} />)}
                      </List>
                    </span>
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
