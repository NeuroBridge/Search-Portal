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
import { api } from '../../../api'
import ForceGraph2D from 'react-force-graph-2d'
import { useSearchContext } from '../context'
import { useDialogContext } from './'
import { SizeMe } from 'react-sizeme'

const SELECTED_NODE_COLOR = '#378f91'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 'calc(100% - 11rem)',
    width: '100%',
    height: '100%',
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
    borderRadius: '4px',
    fontSize: '75%',
  },
  tooltipTitle: {
    margin: 0,
    fontSize: '120%',
  },
  tooltipDetail: {
    margin: 0,
    fontSize: 'inherit',
  },
  tooltipDescription: {
    fontSize: 'inherit',
    borderTop: '1px solid #ffffff66',
    paddingTop: theme.spacing(1),
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
  const {
    nodeLabelVisibility, selectedNodes, setSelectedNodes, selectionPalette, toggleNodeSelection,
    graphMode, graphRankDistance, setGraphRankDistance,
    graphForce, setGraphForce,
  } = useDialogContext()
  const classes = useStyles()
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const container = useRef()
  const fgRef = useRef()

  const visibleNodes = useMemo(() => graphData ? graphData.nodes.map(node => node.id) : [], [graphData.nodes])

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge')
        .strength(-graphForce)
        .distanceMax(1000)
    }
  }, [fgRef.current, graphForce])

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
          let nodes = [
            { id: term.short_form, name: term.label, val: 15, color: '#333', iri: term.iri, hasChildren: term.has_children, description: term.comment_annotation } // current term node
          ]
          if (parents.length) {
            const parent = parents[0]
            nodes = [...nodes, { id: parent.short_form, name: parent.label, val: 15, color: 'indianred', iri: parent.iri, hasChildren: parent.has_children, description: parent.comment_annotation }] // add parent term
          }
          const childNodes = children.map(child => ({ id: child.short_form, name: child.label, val: 15, color: 'indianred', iri: child.iri, hasChildren: child.has_children, description: child.comment_annotation })) // current term's children
          if (childNodes.length) {
            nodes = [...nodes, ...childNodes]
          }
          const links = [
            ...parents.map(parent => ({ source: parent.short_form, target: term.short_form })), // parent-current term edge
            ...children.map(child => ({ source: term.short_form, target: child.short_form })), // children-current term edge
          ]
          setGraphData({ nodes, links })
        }).catch(error => console.log(error))
    }
  }, [term])

  const tooltip = ({ id, name, description, color, hasChildren }) => `
    <div class="${ classes.tooltip }" style="background-color: ${ color }">
      <h3 class="${ classes.tooltipTitle }">${ name }</h3>
      <p class="${ classes.tooltipDetail }"><em>${ id }</em></p>
      <p class="${ classes.tooltipDescription }">comment_annotation: ${ description || 'none provided' }</p>
    </div>`

  const handleNodeRightClick = async (node, event) => {
    const children = await api.hierarchicalChildren(encodeURIComponent(encodeURIComponent(node.iri)))
    const newNodes = children
      .filter(child => !visibleNodes.includes(child.short_form))
      .map(child => ({ id: child.short_form, name: child.label, val: 10, color: 'slategrey', iri: child.iri, hasChildren: child.has_children, description: child.comment_annotation }))
    const newLinks = newNodes.map(newNode => ({ source: node.id, target: newNode.id }))
    setGraphData({
      nodes: [...graphData.nodes, ...newNodes],
      links: [...graphData.links, ...newLinks]
    })
  }

  const handleNodeLeftClick = (node, event) => toggleNodeSelection(node.id)

  const nodePaint = ({ id, x, y, color, hasChildren }, ctx, globalScale) => {
    if (nodeLabelVisibility) {
      const fontSize = 12 / globalScale
      ctx.beginPath()
      ctx.rect(x + 4, y - 4, ctx.measureText(id).width + 2, -(fontSize + 2))
      ctx.fillStyle = '#ddd'
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 0.1
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#222'
      ctx.font = `${ fontSize }px sans-serif`;
      ctx.fillText(id, x + 5, y - 5);
    }
    if (id in selectedNodes) {
      ctx.beginPath()
      ctx.strokeStyle = selectionPalette[selectedNodes[id]]
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
    <div className={ classes.root } ref={ container }>
      <SizeMe monitorHeight>
        {
          ({ size }) => graphData.nodes.length > 0 && graphData.links && (
            <ForceGraph2D
              ref={ fgRef }
              width={ size.width }
              height={ container?.current.clientHeight }
              graphData={ graphData }
              dagMode={ graphMode }
              dagLevelDistance={ graphRankDistance }
              backgroundColor="transparent"
              linkColor={ () => 'rgba(0,0,0,0.2)' }
              nodeRelSize={ 1 }
              nodeId="id"
              d3VelocityDecay={ 0.5 }
              onNodeClick={ handleNodeLeftClick }
              onNodeRightClick={ (node, event) => handleNodeRightClick(node, event) }
              nodeLabel={ node => tooltip({ ...node }) }
              nodeCanvasObject={ nodePaint }
              linkDirectionalParticleWidth={ 2 }
              linkDirectionalParticleColor={ link => link.source.color }
              onLinkClick={ link => fgRef.current.emitParticle(link) }
            />
          )
        }
      </SizeMe>
    </div>
  )
}
