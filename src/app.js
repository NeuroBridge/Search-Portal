import React, { useCallback, useEffect, useState } from 'react'
import { Layout } from './components/layout'
import { config } from './config'
import { Select } from './components/select'
import { Selections, Selection } from './components/selections'
import './app.css'

const generateId = () => Math.random().toString(36).substr(2, 9)

const randomCriterion = table => table.criteria[Math.floor(Math.random() * table.criteria.length)]
const randomTable = () => config.tables[Math.floor(Math.random() * config.tables.length)]
const randomSelection = () => {
  const t = randomTable()
  const c = randomCriterion(t)
  return { table: t, criterion: c, id: generateId() }  
}
const randomSelections = n => Array.from(Array(n), (_, i) => i).map(i => randomSelection())

export const App = () => {
  const [table, setTable] = useState('')
  const [criterion, setCriterion] = useState('')
  const [selections, setSelections] = useState([])

  const handleChangeTable = useCallback(event => {
    const tbl = config.tables.find(t => t.id === event.target.value)
    setTable(tbl || '')
  }, [])

  const handleChangeCriterion = useCallback(event => {
    if (table) {
      const crit = table.criteria.find(c => c.id === event.target.value)
      if (crit) {
        setCriterion(crit)
      }
    } else {
      setCriterion('')
    }
  }, [table])

  const handleClickAdd = () => {
    if (table && criterion) {
      setTable('')
      setSelections([ { table, criterion, id: generateId() }, ...selections ])
    }
  }

  const handleClickAddRandomSelection = () => {
    const newSelection = randomSelection()
    setSelections([ newSelection, ...selections ])
  }

  const handleDeleteSelection = id => {
    setSelections(selections.filter(selection => selection.id !== id))
  }

  return (
    <Layout>
      <h1>Query</h1>
      
      <hr/>
      
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', gap: '1rem' }}>
        <Select value={ table.id || '' } onChange={ handleChangeTable }>
          <option key="no-table" value="">Select Table</option>
          {
            config.tables.map(t => {
              return <option key={ t.id } value={ t.id }>{ t.name }</option>
            })
          }
        </Select>

        <Select value={ criterion.id || '' } onChange={ handleChangeCriterion } disabled={ table === '' }>
          <option key="no-criterion" value="">Select Criterion</option>
          {
            table === ''
              ? null
              : table.criteria.map(c => <option key={ `${ table.id }_${ c.id }` } value={ c.id }>{ c.name }</option>)
          }
        </Select>

        <button onClick={ handleClickAdd } disabled={ !table || !criterion }>+ Add Selection</button>
        <button onClick={ handleClickAddRandomSelection }>+ Add Random Selection</button>
      </div>

      <Selections>
        { selections.map(selection => <Selection key={ selection.id } selection={ selection } onDelete={ handleDeleteSelection } />) }
      </Selections>

    </Layout>
  );
}
