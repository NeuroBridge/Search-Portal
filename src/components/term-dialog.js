import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Slide, useMediaQuery
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { api } from '../api'
import ReactJson from 'react-json-view'
import ForceGraph2D from 'react-force-graph-2d'

const useStyles = makeStyles(theme => ({
  root: {
    margin: '9rem 2rem 2rem 2rem',
  },
  termDialog: {
    height: '100%',
  },
  dialogTitle: {
    width: '100%',
    textAlign: 'center',
  },
  content: {
    '& div': {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
}))

const DialogTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ ref } {...props} />
})

export const TermDialog = ({ open, term, closeHandler }) => {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [children, setChildren] = useState([])
  const [parents, setParents] = useState([])
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
    <Dialog
      fullScreen={ fullScreen }
      maxWidth={ 'lg' }
      open={ open }
      onClose={ closeHandler }
      TransitionComponent={ DialogTransition }
      classes={{ root: classes.root, paper: classes.termDialog }}
    >
      <DialogTitle className={ classes.dialogTitle }>
        { term && term.short_form }
      </DialogTitle>
      <DialogContent className={ classes.content }>
        <pre>{ JSON.stringify(term, null, 2) }</pre>
        <Divider />
        {
          graphData.nodes && graphData.links && (
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
              d3VelocityDecay={ 0.75 }
            />
          )
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={ closeHandler }>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
