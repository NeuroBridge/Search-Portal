
import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import loadable from '@loadable/component'
import { useOntology } from '../ontology'

const ForceGraph2D = loadable(() => import('./force-graph'))

export const TermGraph = ({ rootTerm, width, height, onNodeClick }) => {
  const graphRef = useRef()
  const ontology = useOntology()
  const [graphData, setGraphData] = useState({ nodes: [rootTerm], links: [] })

  const getColor = useCallback(id => id === rootTerm.id ? '#1976d2' : '#abc', [rootTerm])

  const nodePaint = useCallback((node, color, ctx) => {
    ctx.strokeStyle = '#234'
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false)
    ctx.stroke()
    ctx.fill()
  }, [])

  useEffect(() => {
    let descendants = ontology.descendantsOf(rootTerm.id)
    const rootIndex = descendants.findIndex(term => term.id === rootTerm.id)
    descendants[rootIndex] = { ...rootTerm, parentId: null }
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
      height={ height }
      onNodeClick={ onNodeClick }
      nodeCanvasObject={ (node, ctx) => nodePaint(node, getColor(node.id), ctx) }
      nodePointerAreaPaint={ nodePaint }
    />
  )
}

TermGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rootTerm: PropTypes.object,
  onNodeClick: PropTypes.func,
}

TermGraph.defaultProps = {
  rootTerm: [],
  width: 500,
  height: 500,
}
