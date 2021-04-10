import React, { useCallback, useEffect, useState } from 'react'
import { Layout } from './components/layout'
import { config } from './config'
import { Select } from './components/select'
import './app.css'

export const App = () => {
  const [table, setTable] = useState('')
  const [criterion, setCriterion] = useState('')

  const handleChangeTable = useCallback(event => {
    const tbl = config.tables.find(t => t.id === event.target.value)
    setTable(tbl || '')
  }, [])

  const handleChangeCriterion = useCallback(event => {
    const crit = table.criteria.find(c => c.id === event.target.value)
    if (crit) {
      setCriterion(crit)
    }
  }, [table])

  useEffect(() => setCriterion(''), [table])

  return (
    <Layout>
      <h1>Query</h1>
      
      <hr/>
      
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Select value={ table.id } onChange={ handleChangeTable }>
          <option key="no-table" value="">Select Table</option>
          {
            config.tables.map(t => {
              return <option key={ t.id } value={ t.id }>{ t.name }</option>
            })
          }
        </Select>

        <Select value={ criterion.id } onChange={ handleChangeCriterion } disabled={ table === '' }>
          <option key="no-criterion" value="">Select Criterion</option>
          {
            table === ''
              ? null
              : table.criteria.map(c => <option key={ `${ table.id }_${ c.id }` } value={ c.id }>{ c.name }</option>)
          }
        </Select>
      </div>

      <div style={{ backgroundColor: '#333', color: '#0ac', padding: '2rem' }}>
        <strong>TABLE:</strong> { table !== '' ? table.name : '...' }<br /><br />
        <strong>CRITERION:</strong> { criterion !== '' ? criterion.name : '...' }<br />
      </div>

    </Layout>
  );
}
