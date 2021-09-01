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
}))

export const TermGraph = ({ term }) => {
  const classes = useStyles()
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })

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
            { id: parent.short_form, name: parent.short_form, val: 10, color: 'slategrey' },
            { id: term.short_form, name: term.short_form, val: 15, color: 'salmon' },
            ...children.map(child => ({ id: child.short_form, name: child.short_form, val: 10, color: 'slategrey' })),
          ]
          const links = [
            ...parents.map(parent => ({ source: parent.short_form, target: term.short_form })),
            ...children.map(child => ({ source: term.short_form, target: child.short_form })),
          ]
          return { nodes, links }
        }).then(({ nodes, links }) => {
          setGraphData({ nodes, links })
        })
        .catch(error => console.log(error))
    }
  }, [term])

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
            nodeColor={ node => node.color }
            linkDirectionalParticles={ 2 }
            linkDirectionalParticleWidth={ 2 }
            d3VelocityDecay={ 0.5 }
          />
        )
      }
    </Paper>
  )
}
