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
  // const searchValRef = useRef(searchVal)

  // const setMyRef = status => {
  //   searchValRef.current = status
  //   setSearchVal(status)
  // }

  // const listener = () => {
  //   console.log(`current search value is ${searchValRef.current}`)
  // }

  const handleInputChange = e => {
    setSearchVal(e.target.value)
  }

  const handleSubmit = () => {
    setLoading(true)
    setErrMsg(null)

    const fetchTerms = async () => {
      try {
        const { data } = await axios.get(`http://beast.europa.renci.org:8080/api/search?q=${searchVal}&ontology=neurobridges_ontology`)
        if(!data) {
          throw new Error('an error occurred while trying to get the results')
        }
        console.log("this is data", data.response)
        setLoading(false)
        setResults(data.response.docs)
      } catch (err) {
        console.log(err)
        setLoading(false)
        setErrMsg(err)
      }
    }
    fetchTerms()
  }

  // useEffect(() => {
  //   document.getElementsByClassName("ant-input-clear-icon")[0].addEventListener("click", listener)

  // }, [])
  
  

  return (
    <div className="App">
      <PageHeader title="OLS Terms" ghost={false} />
      <Row>
        <Col span={12} offset={6}>
          <p style={{marginTop: "2rem"}}><b>Enter a term from the Neurobridge ontology</b></p>
          <Search id="search-field" placeholder="e.g. Spectroscopy" onSearch={handleSubmit} onChange={handleInputChange} value={searchVal} allowClear enterButton />
        </Col>
      </Row>

      <Row>
        <Col span={12} offset={6}>
          <div id="results-container">
            {loading && !errMsg ? (
              <div>
                <Spin tip="Getting Results..." />
              </div>
            // ) : !loading && searchVal.length > 0 ? (
            //   <div>
            //     <Spin tip="Waiting to search..." />
            //   </div>
            ) : errMsg ? (
                <div className="errorMessage">{errMsg}</div>
            ) : !loading && searchVal.length === 0 ? (
              <div>
                <Spin tip="Enter a search term..." />
              </div>
            ) : (
              <div>
                <p className="App-intro">Here are all the terms associated with your search for "{searchVal}":</p>
                <List className="results">
                  {results.map(result => <Results term={result} key={result.label} />)}
                </List>
              </div>
            )
          }
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
