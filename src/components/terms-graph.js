import { useMemo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import loadable from '@loadable/component'
import { useDrawer } from './drawer'
import { useOntology } from './ontology'

const ForceGraph2D = loadable(() => import('./force-graph'))

export const TermsGraph = ({ rootTerm, width, height }) => {
  const graphRef = useRef()
  const ontology = useOntology()
  const [graphData, setGraphData] = useState({ nodes: [rootTerm], links: [] })

  useEffect(() => {
    let descendants = ontology.descendantsOf(rootTerm.id)
    console.log(descendants)
    const rootIndex = descendants.findIndex(term => term.id === rootTerm.id)
    descendants[rootIndex] = { ...rootTerm, parentId: null }
    console.log(descendants)
    setGraphData(ontology.generateGraph(descendants))
  }, [rootTerm])

  return (
    <ForceGraph2D
      ref={ graphRef }
      graphData={ graphData }
      linkDirectionalArrowLength={ 3 }
      linkDirectionalArrowRelPos={ 0.5 }
      linkCurvature={ 0 }
      linkWidth={ 1 }
      nodeLabel="id"
      width={ width }
      height={ width }
    />
  )
}

TermsGraph.propTypes = {
  rootTerm: PropTypes.object,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

TermsGraph.defaultProps = {
  rootTerm: [],
  width: 500,
  height: 500,
}
