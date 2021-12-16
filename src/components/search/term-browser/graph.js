import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'
import { useSearchContext } from '../context'
import { TermTree } from '../../term-tree'
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

export const Graph = () => {
  const { graphSettings, busy, setBusy, selectedNodes, setSelectedNodes, selectionPalette, toggleNodeSelection } = useDialogContext()
  const { currentTerm, setCurrentTerm, previousTerm, nextTerm } = useSearchContext()
  const classes = useStyles()
  const [relations, setRelations] = useState(null)
  const [svgDimensions, setSvgDimensions] = useState({ width: 500, height: 500 })
  const [percentComplete, setPercentComplete] = useState(0)

  useEffect(() => {
    setSelectedNodes({})
    
    if (!currentTerm) {
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
    
    buildHierarchicalData(currentTerm)
    
  }, [currentTerm])

  if (busy) {
    return `Loading... ${ percentComplete > 0 ? `${ Math.floor(percentComplete) }%` : '' }`
  }

  return (
    <div className={ classes.root }>
      <TermTree
        term={ currentTerm }
        { ...svgDimensions }
        settings={ graphSettings }
      />
      <ResizeObserver
        onResize={ container => {
          setSvgDimensions({ width: container.width, height: container.height })
        }}
      />
    </div>
  )
}

Graph.propTypes = {
  term: PropTypes.shape({
    iri: PropTypes.string.isRequired,
    short_form: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    has_children: PropTypes.bool.isRequired,
    comment_annotation: PropTypes.array,
  }).isRequired,
}