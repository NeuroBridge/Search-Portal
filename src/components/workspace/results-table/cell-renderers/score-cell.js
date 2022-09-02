import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import lerp from 'lerp'

const Root = styled('div')(({ theme }) => ({
  border: `1px solid ${ theme.palette.divider }`,
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '34px',
  borderRadius: 2,
}))

const Value = styled('div')({
  position: 'absolute',
  lineHeight: '34px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  fontSize: '85%',
})

const Bar = styled('div')({
  height: '100%',
  backgroundColor: '#1565c0',
})

const ScoreBar = React.memo(function ScoreBar(props) {
  const { value } = props
  const valueAsPercent = value * 100
  const hueRotation = lerp(90, 0, value)
  const filter = useMemo(() => `opacity(0.2) hue-rotate(${ hueRotation - 30 }deg)`, [])

  return (
    <Root>
      <Value>{`${valueAsPercent.toLocaleString()} %`}</Value>
      <Bar sx={{
        maxWidth: `${ valueAsPercent }%`,
        filter: filter,
      }} />
    </Root>
  )
})

ScoreBar.propTypes = {
  value: PropTypes.number,
}

export function renderScoreCell(params) {
  if (params.value == null) {
    return ''
  }

  return <ScoreBar value={ params.value } />
}