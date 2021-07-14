import { useState } from "react"
import { Input, PageHeader, Row, Col, Spin } from "antd"
import './App.css';
import axios from 'axios'

import ResultCard from "./components/ResultCard";

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
        <Col span={18} offset={3}>
          <div id="results-container">
            <Row gutter={10}>
              {loading && !errMsg ? (
                <Col span={12} offset={6}>
                  <Spin tip="Getting Results..." />
                </Col>
              // ) : !loading && searchVal.length > 0 ? (
              //   <div>
              //     <Spin tip="Waiting to search..." />
              //   </div>
              ) : errMsg ? (
                  <Col span={12} offset={6} className="errorMessage">{errMsg}</Col>
              ) : !loading && results === [] ? (
                <Col span={12} offset={6}>
                  <Spin tip="Enter a search term..." />
                </Col>
              ) : (
                <>
                  <Col span={18}>
                    <p id="results-header">Here are all the terms associated with your search:</p>
                  </Col>
                  
                  {results.map(result => 
                    <Col span={8} key={result.label}>
                      <ResultCard term={result} />
                    </Col>
                  )}
                </>
              )
            }
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
