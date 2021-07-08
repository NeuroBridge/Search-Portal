import { useState } from "react"
import { Input, PageHeader, Row, Col, Spin, List } from "antd"
import './App.css';
import axios from 'axios'

import Results from "./components/Results";

const { Search } = Input

function App() {
  const [searchVal, setSearchVal] = useState("")
  const [loading, setLoading] = useState()
  const [results, setResults] = useState([])
  const [errMsg, setErrMsg] = useState(null)

  // const handleKeyDown = event => {
  //   if (event.keyCode === 13) {
  //     handleSubmit()
  //   }
  // }
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
      <PageHeader title="OLS Terms" ghost={false} />
      <Row>
        <Col span={12} offset={6}>
          <p style={{marginTop: "2rem"}}><b>Enter an ontology id/short name</b> (<a href="https://www.ebi.ac.uk/ols/ontologies" target="_blank" rel="noreferrer">List of all ontologies</a>)</p>
          <Search id="search-field" placeholder="e.g. Chemical Methods = chmo" onSearch={handleSubmit} onChange={handleInputChange} value={searchVal} allowClear enterButton />
        </Col>
      </Row>

      <Row>
        <Col span={12} offset={6}>
          <div className="results">
            {loading && !errMsg ? (
                <Spin tip="Getting Results..." />
            ) : errMsg ? (
              <div className="errorMessage">{errMsg}</div>
            ) : !loading && searchVal === "" ? (
                <Spin tip="Enter a search term..." />
            ) : (
              //console.log("this is results", results)
              <span>
                <p className="App-intro">Here are all the terms associated with the <b>{searchVal}</b> ontology:</p>
                <List className="results">
                  {results.map(result => <Results term={result} />)}
                </List>
              </span>
            )
          }
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
