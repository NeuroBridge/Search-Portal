import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { api } from '../../../api'
import ForceGraph2D from 'react-force-graph-2d'
import { useDialogContext } from './'
import { SizeMe } from 'react-sizeme'
import * as d3Force from 'd3-force'

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

export const TermGraph = ({ term }) => {
  const {
    selectedNodes, setSelectedNodes, selectionPalette, toggleNodeSelection,
    graphSettings,
  } = useDialogContext()
  const classes = useStyles()
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const container = useRef()
  const fgRef = useRef()

  const visibleNodes = useMemo(() => graphData ? graphData.nodes.map(node => node.id) : [], [graphData.nodes])

  const createNode = useCallback((color = '#334') => term => ({
    id: term.short_form,
    name: term.label,
    color: color,
    iri: term.iri,
    hasChildren: term.has_children,
    description: term.comment_annotation,
  }), [])
  const createRootNode = createNode('firebrick')
  const createLink = useCallback((parent, child) => ({ source: parent.short_form, target: child.short_form }), [])
  
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('collide', d3Force.forceCollide(graphSettings.node.size));
      fgRef.current.d3Force('charge')
        .strength(-graphSettings.force)
        .distanceMax(1000)
    }
  }, [fgRef.current, graphSettings.force])


  useEffect(() => {
    setSelectedNodes([])
    
    if (!term) {
      return
    }

    const graphDescendants = async root => {
      console.log(root.label)

      api.descendants(root)
        .then(async descendants => {
          let nodes = []
          let links = []

          // add node for each descendant term
          nodes = [createRootNode(root), ...descendants.map(createNode())]
          
          // construct root-children edges
          const children = await api.children(root)
          const childLinks = await children.map(child => createLink(root, child))
          links = [...childLinks]

          // dynamically construct edges between other descendants
          const nonLeaves = descendants.filter(descendant => descendant.has_children)
          const responses = await Promise.all(nonLeaves.map(api.children))
          responses.map((children, i) => {
            links = [...links, ...children.map(child => createLink(nonLeaves[i], child))]
          })
          setGraphData({ nodes, links })
        })
        .catch(error => console.log(error))
    }
    
    graphDescendants(term)
    
  }, [term])

  const tooltip = ({ id, name, description, color }) => `
    <div class="${ classes.tooltip }" style="background-color: ${ color }">
      <h3 class="${ classes.tooltipTitle }">${ name }</h3>
      <p class="${ classes.tooltipDetail }"><em>${ id }</em></p>
      <p class="${ classes.tooltipDescription }">comment_annotation: ${ description || 'none provided' }</p>
    </div>`

  const handleNodeRightClick = async node => {
    const children = await api.children(node)
    const newNodes = children
      .filter(child => !visibleNodes.includes(child.short_form))
      .map(createNode())
    const newLinks = newNodes.map(newNode => ({ source: node.id, target: newNode.id }))
    setGraphData({
      nodes: [...graphData.nodes, ...newNodes],
      links: [...graphData.links, ...newLinks]
    })
  }

  const handleNodeLeftClick = node => toggleNodeSelection(node.id)

  const nodePaint = ({ id, x, y, color, hasChildren }, ctx, globalScale) => {
    if (id in selectedNodes) {
      ctx.beginPath()
      ctx.strokeStyle = selectionPalette[selectedNodes[id]]
      ctx.fillStyle = 'transparent'
      ctx.lineWidth = 2
      ctx.arc(x, y, graphSettings.node.size + 2, 0, 2 * Math.PI, false)
      ctx.stroke()
      ctx.fill()
    }
    ctx.beginPath()
    ctx.fillStyle = hasChildren ? color : '#eee'
    ctx.strokeStyle = color
    ctx.lineWidth = 0.5
    ctx.arc(x, y, graphSettings.node.size, 0, 2 * Math.PI, false)
    ctx.stroke()
    ctx.fill()
    if (graphSettings.node.labels.on) {
      const fontSize = graphSettings.node.labels.font.size / globalScale
      const offset = {
        x: graphSettings.node.size + 2,
        y: -graphSettings.node.size / 2 - 1,
      }
      // label box
      ctx.beginPath()
      ctx.rect(x + offset.x, y - offset.y - graphSettings.node.labels.height, ctx.measureText(id).width + 2, -(fontSize + 2))
      ctx.fillStyle = '#ddd'
      ctx.strokeStyle = '#222'
      ctx.lineWidth = 0.1
      ctx.fill()
      ctx.stroke()
      // label text
      ctx.fillStyle = '#222'
      ctx.font = `${ fontSize }px sans-serif`;
      ctx.fillText(id, x + (offset.x + 1), y - (offset.y + 1) - graphSettings.node.labels.height);
    }
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
              dagMode={ graphSettings.mode }
              dagLevelDistance={ graphSettings.levelDistance }
              backgroundColor="transparent"
              linkColor={ () => 'rgba(0,0,0,0.2)' }
              nodeRelSize={ 1 }
              nodeId="id"
              d3VelocityDecay={ 0.5 }
              onNodeClick={ handleNodeLeftClick }
              onNodeRightClick={ (node, event) => handleNodeRightClick(node, event) }
              nodeLabel={ node => tooltip({ ...node }) }
              nodeCanvasObject={ nodePaint }
            />
          )
        }
      </SizeMe>
    </div>
  )
}

TermGraph.propTypes = {
  term: PropTypes.shape({
    iri: PropTypes.string.isRequired,
    short_form: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    has_children: PropTypes.bool.isRequired,
    comment_annotation: PropTypes.string,
  }).isRequired,
}