import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

export const Tree = ({
  relations,
  height = 500,
  width = 500,
  onNodeLeftClick,
  nodeColor,
  settings,
  offset,
  setOffset,
}) => {
  const svgElement = useRef()

  console.log('rendering tree')

  useEffect(() => {
    if (!relations || !svgElement.current) {
      return
    }

    // construct hierarchical tree data from flat list of child-parent relations
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
        setOffset(event.originalTarget.__zoom)
      })

    const svg = d3.select(svgElement.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, x1 - x0 + treeData.dx * 2])
        .style('z-index', '-1')
        .style('border', '1px dashed red') // temp
        .call(drag)

    const gTransform = svg.append('g')
        .attr('class', 'transform-group')

    const g = gTransform.append('g')
        .attr('class', 'wrapper')
        .attr('transform', offset)
        // .attr('transform', `translate(${ treeData.dy },${ treeData.dx - x0 })`)

    g.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
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
  }, [relations])

  return (
    <svg ref={ svgElement } />
  )
}

Tree.propTypes = {
  relations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      parentId: PropTypes.string,
    })
  ),
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onNodeLeftClick: PropTypes.func,
  nodeColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  settings: PropTypes.object,
  offset: PropTypes.object,
  setOffset: PropTypes.func,
}

Tree.defaultProps = {
  offset: { x: 0, y: 0, z: 0 },
}
