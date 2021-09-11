import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Slide, Paper, Typography } from '@material-ui/core'
import {
  ChevronLeft as PreviousTermIcon,
  ChevronRight as NextTermIcon,
  Close as DeleteIcon,
  ArrowForward as ActionIcon,
} from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { api } from '../../api'
import ReactJson from 'react-json-view'
import ForceGraph2D from 'react-force-graph-2d'
import { useSearchContext } from '../../context'
import { useDialogContext } from './'
import { SizeMe } from 'react-sizeme'

const SELECTED_NODE_COLOR = '#378f91'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '86%',
    width: '100%',
    position: 'relative',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    '& > div': {
      width: '100%',
    }
  },
  tooltip: {
    padding: theme.spacing(1),
    backgroundColor: 'grey',
  },
  tooltipTitle: {
    margin: 0,
    fontSize: '90%',
  },
  tooltipDetail: {
    margin: 0,
    fontSize: '65%',
  },
  selection: {
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'none',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(1),
    backgroundColor: 'transparent',
  },
  summary: {
    fontSize: '95%',
    backgroundColor: 'transparent',
    padding: '4px 5px',
    fontWeight: 'bold',
  },
  chips: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
  },
  chip: {
    marginBottom: theme.spacing(1) / 2,
    '&:hover $deleteIcon': {
      filter: 'opacity(1.0)',
    },
  },
  chipLabel: {
    fontSize: '85%',
    textTransform: 'none',
  },
  deleteIcon: {
    filter: 'opacity(0.25)',
    transition: 'filter 250ms',
  },
}))

export const TermGraph = ({ term, height, width }) => {
  const { selectedNodes, setSelectedNodes, toggleNodeSelection } = useDialogContext()
  const classes = useStyles()
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const container = useRef()

  const visibleNodes = useMemo(() => graphData ? graphData.nodes.map(node => node.id) : [], [graphData.nodes])

  useEffect(() => {
    if (term) {
      setSelectedNodes([])
      const promises = [
        api.hierarchicalChildren(encodeURIComponent(encodeURIComponent(term.iri))),
        api.hierarchicalParents(encodeURIComponent(encodeURIComponent(term.iri))),
      ]
      Promise.all(promises)
        .then(responses => {
          const [children, parents] = responses
          const parent = parents[0]
          const nodes = [
            { id: parent.short_form, name: parent.short_form, val: 15, color: 'indianred', iri: parent.iri, hasChildren: parent.has_children }, // add parent term node
            { id: term.short_form, name: term.short_form, val: 15, color: 'indianred', iri: term.iri, hasChildren: term.has_children }, // add current term node
            ...children.map(child => ({ id: child.short_form, name: child.short_form, val: 15, color: 'indianred', iri: child.iri, hasChildren: child.has_children })), // add current term's children nodes
          ]
          const links = [
            ...parents.map(parent => ({ source: parent.short_form, target: term.short_form })), // parent-current term edge
            ...children.map(child => ({ source: term.short_form, target: child.short_form })), // children-current term edge
          ]
          setGraphData({ nodes, links })
        }).catch(error => console.log(error))
    }
  }, [term])

  const tooltip = ({ name, iri, color, hasChildren }) => `
    <div class="${ classes.tooltip }" style="background-color: ${ color }">
      <h3 class="${ classes.tooltipTitle }">${ name }</h3>
      <p class="${ classes.tooltipDetail }">${ iri }</p>
      <p class="${ classes.tooltipDetail }">${ hasChildren ? 'Has children' : 'No children' }</p>
    </div>`

  const handleNodeRightClick = async (node, event) => {
    const children = await api.hierarchicalChildren(encodeURIComponent(encodeURIComponent(node.iri)))
    console.log(`"${ node.id }" has ${ children.length } children:`)
    console.table(children.map(child => child.short_form))
    const newNodes = children
      .filter(child => !visibleNodes.includes(child.short_form))
      .map(child => ({ id: child.short_form, name: child.short_form, val: 10, color: 'slategrey', iri: child.iri, hasChildren: child.has_children }))
    const newLinks = newNodes.map(newNode => ({ source: node.id, target: newNode.id }))
    setGraphData({
      nodes: [...graphData.nodes, ...newNodes],
      links: [...graphData.links, ...newLinks]
    })
  }

  const handleNodeLeftClick = (node, event) => toggleNodeSelection(node.id)

  const nodePaint = ({ id, x, y, color, hasChildren }, ctx) => {
    if (selectedNodes.includes(id)) {
      ctx.beginPath()
      ctx.strokeStyle = SELECTED_NODE_COLOR
      ctx.fillStyle = 'transparent'
      ctx.lineWidth = 1
      ctx.arc(x, y, 6, 0, 2 * Math.PI, false)
      ctx.stroke()
      ctx.fill()
    }
    ctx.beginPath()
    ctx.fillStyle = hasChildren ? color : '#eee'
    ctx.strokeStyle = hasChildren ? '#eee' : color
    ctx.lineWidth = hasChildren ? 0.25 : 1
    ctx.arc(x, y, 4, 0, 2 * Math.PI, false)
    ctx.stroke()
    ctx.fill()
  }

  const nodePointerAreaPaint = ({ id, x, y, hasChildren }, color, ctx) => {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x, y, 4, 0, 2 * Math.PI, false)
    ctx.fill()
  }

  return (
    <Paper className={ classes.root } elevation={ 0 } square ref={ container }>
      <SizeMe monitorHeight>
        {
          ({ size }) => graphData.nodes.length > 0 && graphData.links && (
            <ForceGraph2D
              width={ size.width }
              height={ container?.current.clientHeight }
              graphData={ graphData }
              dagMode="td"
              dagLevelDistance={ 50 }
              backgroundColor="transparent"
              linkColor={ () => 'rgba(0,0,0,0.2)' }
              nodeRelSize={1}
              nodeId="id"
              linkDirectionalParticles={ 2 }
              linkDirectionalParticleWidth={ 2 }
              d3VelocityDecay={ 0.5 }
              onNodeClick={ handleNodeLeftClick }
              onNodeRightClick={ (node, event) => handleNodeRightClick(node, event) }
              nodeLabel={ node => tooltip({ ...node }) }
              nodeCanvasObject={ nodePaint }
            />
          )
        }
      </SizeMe>
    </Paper>
  )
}
