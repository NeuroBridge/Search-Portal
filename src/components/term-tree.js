import { useState } from 'react'
import PropTypes from 'prop-types'
import { useD3 } from '../hooks'
import * as d3 from 'd3'

const nodeColor = d => 'red' // d.data.id in selectedNodes ? selectionPalette[selectedNodes[d.data.id]] : '#a9abb0'
const onNodeLeftClick = d => console.log(d)

export const TermTree = ({ term, height, width, settings }) => {
  const [relations, setRelations] = useState(null)
  const [percentComplete, setPercentComplete] = useState(0)
  const [svgDimensions, setSvgDimensions] = useState({ width: 500, height: 500 })

  const svgElement = useD3(svg => {
    if (!term || !relations) {
      console.table('no term')
      console.table('or no relations')
      return
    }
    console.table(term)
    console.table(relations)
    // build data for tree from flat list of
    // child-parent relations from buildRelations below
    const tree = () => {
      const root = d3.stratify()(relations)
      root.dx = settings.node.separation
      root.dy = settings.level.separation
      return d3.tree().nodeSize([root.dx, root.dy])(root)
    }
    const treeData = tree(relations)
    //

    let x0 = Infinity
    let x1 = -x0
    treeData.each(d => {
      if (d.x > x1) { x1 = d.x }
      if (d.x < x0) { x0 = d.x }
    })
    const drag = d3.zoom()
      .on('zoom', () => {
        d3.select('.transform-group').attr('transform', event.originalTarget.__zoom)
      })

    const svgElement = d3.select(svgElement.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, x1 - x0 + treeData.dx * 2])
        .style('z-index', '-1')
        .style('border', '1px dashed red') // temp
        .call(drag)

    const gTransform = svgElement.append('g')
        .attr('class', 'transform-group')

    const g = gTransform.append('g')
        .attr('class', 'wrapper')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        // .attr('transform', `translate(${ treeData.dy },${ treeData.dx - x0 })`)

    g.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
      .selectAll('path')
        .data(treeData.links())
        .join('path')
          .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
  
    const node = g.append('g')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
      .selectAll('g')
        .data(treeData.descendants())
        .join('g')
          .attr('transform', d => `translate(${ d.y },${ d.x })`)

    node.append('circle')
        .attr('fill', nodeColor)
        .attr('stroke', '#333')
        .attr('stroke-width', 1)
        .attr('r', settings.node.size)
        .style('cursor', 'pointer')
        .on('click', (event, d) => onNodeLeftClick(d.data.id))

    node.append('text')
        .attr('y', -6)
        .attr('x', d => d.children ? -6 - settings.node.size : 6 + settings.node.size)
        .attr('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.id)
        .attr('fill', '#333')
      .clone(true).lower()
        .attr('stroke', nodeColor)
        .style('filter', 'opacity(0.33)')
        .attr('stroke-width', 8)    

  }, [term, relations])

  //

  return (
    <svg ref={ svgElement } />
  )
}

TermTree.propTypes = {
  term: PropTypes.shape({
    iri: PropTypes.string.isRequired,
    short_form: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    has_children: PropTypes.bool.isRequired,
    comment_annotation: PropTypes.array,
  }).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  settings: PropTypes.object.isRequired,
}

TermTree.defaultProps = {
  height: 500,
  width: 500,
 }