import { Link, Match } from "@reach/router";
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
  },
  link: {
    padding: `0 ${ theme.spacing(2) }px`,
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

export const Menu = () => {
  const classes = useStyles()
  return (
    <nav className={ classes.root }>
      <NavLink to="/search">Search</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </nav>
  )

}