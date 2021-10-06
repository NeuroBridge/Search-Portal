import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

export const Tree = ({ relations, height, width }) => {
  const svgContainer = useRef()

  useEffect(async () => {
    if (!relations || !svgContainer.current) {
      return
    }

    // construct hierarchical tree data from flat list of child-parent relations
    const tree = data => {
      const root = d3.hierarchy(relations)
      root.dx = 10
      root.dy = width / (root.height + 1)
      return d3.tree().nodeSize([root.dx, root.dy])(root)
    }
    const treeData = tree(relations)
    console.log(treeData)

    //

    let x0 = Infinity
    let x1 = -x0
    treeData.each(d => {
      if (d.x > x1) { x1 = d.x }
      if (d.x < x0) { x0 = d.x }
    })

    const svg = d3.create('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, x1 - x0 + treeData.dx * 2])

    const g = svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('transform', `translate(${ treeData.dy / 3 },${ treeData.dx - x0 })`)

    const link = g.append('g')
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
        .attr('fill', d => d.children ? '#555' : '#999')
        .attr('r', 2.5)

    node.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d.children ? -6 : 6)
        .attr('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name)
      .clone(true).lower()
        .attr('stroke', 'white')

      svgContainer.current.appendChild(svg.node())
  }, [relations])

  return (
    <Fragment>
      <div ref={ svgContainer } />
    </Fragment>
  )
}

Tree.propTypes = {
  relations: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}