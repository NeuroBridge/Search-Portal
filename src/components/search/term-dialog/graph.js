import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'
import { Tree } from '../../tree'
import { api } from '../../../api'
import * as d3 from 'd3'

const useStyles = makeStyles(() => ({
  root: {
    minHeight: 'calc(100% - 11rem)',
    width: '100%',
    height: '100%',
    position: 'relative',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
  },
}))

const stratify = d3.stratify()
  .id(d => d.id)
  .parentId(d => d.parentId)

export const TermGraph = ({ term }) => {
  const { setBusy, setSelectedNodes } = useDialogContext()
  const classes = useStyles()
  const [relations, setRelations] = useState(null)

  useEffect(() => {
    setSelectedNodes([])
    
    if (!term) {
      return
    }

    const buildHierarchicalData = async root => {
      setBusy(true)

      api.descendants(root)
        .then(async descendants => {
          let rels = [{ id: root.short_form, parentId: '' }]
          const nonLeaves = await descendants.filter(descendant => descendant.has_children)
          let queue = [root]
          while (queue.length > 0) {
            const t = queue.pop()
            const children = await api.children(t)
            queue = [...children, ...queue]
            rels = [...rels, ...children.map(child => ({ id: child.short_form, parentId: t.short_form }))]
          }
          setRelations(rels)
          setBusy(false)
        })
        .catch(error => {
          console.log(error)
          setBusy(false)
        })
    }
    
    buildHierarchicalData(term)
    
  }, [term])

  if (!relations) {
    return 'Loading...'
  }

  return (
    <div className={ classes.root }>
      <Tree
        relations={ relations }
        width={ 500 }
        height={ 500 }
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