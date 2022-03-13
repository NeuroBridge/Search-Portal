import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link as ReachLink } from '@reach/router'

export const ExternalLinkIcon = ({ size, ...rest }) => {
  return (
    <svg
      { ...rest }
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 24 24"
      width={ `${ size }px` }
      height={ `${ size }px` }
    >
      <path fill="#789" d="M 0,15.609374 V 7.2187491 H 5.1505597 10.30112 L 10.910188,6.6093432 11.519255,5.9999371 10.564316,5.044784 9.6093751,4.0896309 V 2.044815 -3.0028053e-7 H 16.804688 24 V 7.1953116 14.390624 h -2.044815 -2.044817 l -0.955152,-0.954941 -0.955154,-0.954939 -0.609406,0.609067 -0.609405,0.609069 V 18.84944 24 H 8.3906251 0 Z m 14.414062,3.246094 c 0,-1.514648 -0.0079,-2.753907 -0.01753,-2.753907 -0.0096,0 -0.821756,0.804184 -1.80471,1.787076 l -1.787189,1.787076 -3.2401772,-3.240177 -3.240177,-3.240177 1.7870754,-1.787191 c 0.9828914,-0.982954 1.7870754,-1.7950739 1.7870754,-1.8047105 0,-0.00961 -1.2392579,-0.017522 -2.7539062,-0.017522 H 2.3906249 v 6.0117185 6.011719 h 6.0117189 6.0117182 z m -0.01685,-6.146047 3.603002,-3.6030772 1.446496,1.4468272 1.446495,1.446828 h 0.358088 0.358085 V 7.1953116 2.3906241 H 16.804688 12 v 0.3577821 0.3577821 l 1.025391,1.028297 c 0.563964,0.5655636 1.209333,1.2172855 1.434153,1.4482713 L 14.8683,6.0027304 11.272086,9.5990023 7.675871,13.195274 9.2343514,14.753887 c 0.8571646,0.857237 1.5587886,1.558612 1.5591656,1.558612 3.77e-4,0 1.622035,-1.621385 3.603688,-3.603078 z" />
    </svg>
  )
}

ExternalLinkIcon.propTypes = {
  size: PropTypes.number.isRequired,
}

export const ExternalLink = ({ to, children }) => {
  return (
    <Fragment>
      <a
        href={ to }
        target="_blank"
        rel="noopener noreferrer"
      >
        { children }
      </a>
      <ExternalLinkIcon size={ 10 } style={{ marginLeft: '4px' }} />
    </Fragment>
  )
}

export const Link = ({ to, children, ...props }) => {
  const mailtoPattern = new RegExp(/^mailto:/)
  const externalUrlPattern = new RegExp(/^https?:\/\//)
  const externalUrlMatch = externalUrlPattern.exec(to)
  const mailtoMatch = mailtoPattern.exec(to)
  const LinkComponent = externalUrlMatch || mailtoMatch ? ExternalLink : ReachLink
  return <LinkComponent to={to} { ...props }>{children}</LinkComponent>
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

ExternalLink.propTypes = Link.propTypes
