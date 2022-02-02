import { Link } from "@reach/router";
import { makeStyles } from '@mui/styles'
import { Badge } from '@mui/material'
import { useSearchContext } from '../search'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
  },
  link: {
    padding: `0 ${ theme.spacing(2) }`,
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
  const { rootsCount } = useSearchContext()

  return (
    <nav className={ classes.root }>
      <NavLink to="/">
        <Badge badgeContent={ rootsCount } color="secondary">
          Workspace 
        </Badge>
      </NavLink>
    </nav>
  )

}