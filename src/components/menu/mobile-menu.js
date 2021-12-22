import { Fragment, useState } from 'react'
import { Link } from "@reach/router";
import { Button, Fade, Slide } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  Close as CloseIcon,
  Menu as HamburgerIcon,
} from '@mui/icons-material'

const useStyles = makeStyles(theme => ({
  nav: {
    position: 'absolute',
    right: 0,
    top: 0,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: '4rem',
    backgroundColor: theme.palette.primary.dark,
    width: '300px',
    maxWidth: '100vw',
    zIndex: 3,
    filter: 'drop-shadow(0 0 1rem #00000033)',
  },
  toggler: {
    zIndex: 4,
  },
  overlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: '#ffffff99',
    zIndex: 2,
  },
  link: {
    padding: '1rem',
    color: '#fff',
    textDecoration: 'none',
    textTransform: 'uppercase',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 250ms',
    '&:hover': {
      backgroundColor: '#ffffff33',
    }
  },
  activeLink: {
    backgroundColor: '#ffffff33',
  },
}))

const NavLink = props => {
  const { link, activeLink } = useStyles()
  return (
    <Link
      { ...props }
      getProps={
        ({ isCurrent }) => ({ className: `${ link } ${ isCurrent ? activeLink : undefined }` })
      }
    />
  )
}

export const MobileMenu = () => {
  const classes = useStyles()
  const [visibility, setVisibility] = useState(false)
  
  const handleClickToggleMobileMenu = () => setVisibility(!visibility)

  return (
    <Fragment>
      <Button className={ classes.toggler } onClick={ handleClickToggleMobileMenu }>
        { visibility ? <CloseIcon color="error" /> : <HamburgerIcon color="secondary" /> }
      </Button>

      <Fade in={ visibility }>
        <div className={ classes.overlay } onClick={ handleClickToggleMobileMenu }/>
      </Fade>

      <Slide in={ visibility } direction="left">
        <nav className={ classes.nav } onClick={ handleClickToggleMobileMenu }>
          <NavLink to="/">Search</NavLink>
        </nav>
      </Slide>
    </Fragment>
  )

}