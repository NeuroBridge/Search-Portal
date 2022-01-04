import PropTypes from 'prop-types'

export const Container = ({ children, maxWidth }) => {
  return (
    <div style={{
      maxWidth: maxWidth,
      margin: 'auto',
    }}>
      { children }
    </div>
  )
}

Container.propTypes = {
  maxWidth: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

Container.defaultProps = {
  maxWidth: '1080px',
}

