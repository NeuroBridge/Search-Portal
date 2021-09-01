import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Paper
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  ChevronLeft as PreviousTermIcon,
  ChevronRight as NextTermIcon,
} from '@material-ui/icons'
import { api } from '../api'
import ReactJson from 'react-json-view'
import ForceGraph2D from 'react-force-graph-2d'
import { useSearchContext } from '../context'
import { TermDetails } from './term-details'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '400px',
    width: '100%',
  },
  tooltip: {
    padding: theme.spacing(1),
    backgroundColor: 'grey',
    border: '1px solid #333',
  },
  tooltipTitle: {
    margin: 0,
    fontSize: '90%',
  },
  tooltipDetail: {
    margin: 0,
    fontSize: '65%',
  }
}))

export const TermGraph = ({ term }) => {
  const classes = useStyles()
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })

  const visibleNodes = useMemo(() => graphData ? graphData.nodes.map(node => node.id) : [], [graphData.nodes])

  useEffect(() => {
    if (term) {
      const promises = [
        api.hierarchicalChildren(encodeURIComponent(encodeURIComponent(term.iri))),
        api.hierarchicalParents(encodeURIComponent(encodeURIComponent(term.iri))),
      ]
      Promise.all(promises)
        .then(responses => {
          const [children, parents] = responses
          const parent = parents[0]
          const nodes = [
            { id: parent.short_form, name: parent.short_form, val: 10, color: 'maroon', iri: parent.iri, hasChildren: parent.has_children },
            { id: term.short_form, name: term.short_form, val: 15, color: 'orangered', iri: term.iri, hasChildren: term.has_children },
            ...children.map(child => ({ id: child.short_form, name: child.short_form, val: 10, color: 'indianred', iri: child.iri, hasChildren: child.has_children })),
          ]
          const links = [
            ...parents.map(parent => ({ source: parent.short_form, target: term.short_form })),
            ...children.map(child => ({ source: term.short_form, target: child.short_form })),
          ]
          setGraphData({ nodes, links })
        }).catch(error => console.log(error))
    }
  }, [term])

  const tooltip = ({ name, iri, color }) => `
    <div class="${ classes.tooltip }" style="background-color: ${ color }">
      <h3 class="${ classes.tooltipTitle }">${ name }</h3>
      <p class="${ classes.tooltipDetail }">${ iri }</p>
    </div>`

  const handleNodeClick = async (node, event) => {
    const children = await api.hierarchicalChildren(encodeURIComponent(encodeURIComponent(node.iri)))
    console.log(`"${ node.id }" has ${ children.length } children:`)
    console.table(children.map(child => child.short_form))
    const newNodes = children
      .filter(child => !visibleNodes.includes(child.short_form))
      .map(child => ({ id: child.short_form, name: child.short_form, val: 10, color: 'indianred', iri: child.iri }))
    const newLinks = newNodes.map(newNode => ({ source: node.id, target: newNode.id }))
    setGraphData({
      nodes: [...graphData.nodes, ...newNodes],
      links: [...graphData.links, ...newLinks]
    })
  }

  return (
    <Paper className={ classes.root } elevation={ 0 }>
      {
        graphData.nodes.length > 0 && graphData.links && (
          <ForceGraph2D
            width={ 700 }
            height={ 400 }
            graphData={ graphData }
            dagMode="td"
            dagLevelDistance={ 50 }
            backgroundColor="transparent"
            linkColor={ () => 'rgba(0,0,0,0.2)' }
            nodeRelSize={1}
            nodeId="id"
            nodeLabel="name"
            nodeVal={ node => node.val }
            nodeColor={ node => node.hasChildren ? node.color : 'lightslategrey' }
            linkDirectionalParticles={ 2 }
            linkDirectionalParticleWidth={ 2 }
            d3VelocityDecay={ 0.5 }
            onNodeClick={ (node, event) => handleNodeClick(node, event) }
            nodeLabel={ node => tooltip({ ...node }) }
          />
        )
      }
    </Paper>
  )
}
