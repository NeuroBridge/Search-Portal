import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'
import { Tree } from '../../tree'
import { api } from '../../../api'
import ResizeObserver from 'react-resize-observer'

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    minHeight: 'calc(100% - 11rem)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
  },
}))

export const TermGraph = ({ term }) => {
  const {
    busy, setBusy, graphSettings,
    selectedNodes, emptySelectedNodes, selectionPalette,
    toggleNodeSelection, graphOffset, setGraphOffset
  } = useDialogContext()
  const classes = useStyles()
  const [relations, setRelations] = useState(null)
  const [svgDimensions, setSvgDimensions] = useState({ width: 500, height: 500 })
  const [percentComplete, setPercentComplete] = useState(0)

  console.log('\nrendering graph\n')

  useEffect(() => {
    emptySelectedNodes()
    
    if (!term) {
      return
    }

    const buildHierarchicalData = async root => {
      setBusy(true)

      api.descendants(root)
        .then(async descendants => {
          let rels = [{ id: root.short_form, parentId: '' }]
          let queue = [root]
          while (queue.length > 0) {
            const t = queue.pop()
            const children = await api.children(t)
            queue = [...children, ...queue]
            rels = [...rels, ...children.map(child => ({ id: child.short_form, parentId: t.short_form }))]
            setPercentComplete(100 * rels.length / (descendants.length + 1))
          }
          setRelations(rels)
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          setBusy(false)
        })
    }
    buildHierarchicalData(term)
  }, [term])

  const nodeColor = useCallback(d => d.data.id in selectedNodes ? selectionPalette[selectedNodes[d.data.id]] : '#a9abb0', [selectedNodes, selectionPalette])

  if (busy) {
    return `Loading... ${ percentComplete > 0 ? `${ Math.floor(percentComplete) }%` : '' }`
  }

  return (
    <div className={ classes.root }>
      <Tree
        key={ JSON.stringify({ graphSettings, relations, selectedNodes }) } // changing these will trigger a rerender
        { ...svgDimensions }
        relations={ relations }
        onNodeLeftClick={ toggleNodeSelection }
        nodeColor={ nodeColor }
        settings={ graphSettings }
        offset={ graphOffset }
        setOffset={ setGraphOffset }
      />
      <ResizeObserver
        onResize={ container => {
          setSvgDimensions({ width: container.width, height: container.height })
        }}
      />
    </div>
  )
}

TermGraph.propTypes = {
  term: PropTypes.shape({
    iri: PropTypes.string.isRequired,
    short_form: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    has_children: PropTypes.bool.isRequired,
    comment_annotation: PropTypes.array,
  }).isRequired,
}