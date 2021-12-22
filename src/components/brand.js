import { Link } from '@reach/router'
import { Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useSearchContext } from './search/context'

const useStyles = makeStyles(theme => ({
  title: {
    width: '100%',
    fontVariant: 'small-caps',
    letterSpacing: '1px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& a': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      filter: 'saturate(0.0) brightness(2)',
      transition: 'filter 250ms',
      '&:hover': {
        filter: 'saturate(1.0) brightness(1.0)',
      }
    },
  },
}))


export const Brand = () => {
  const classes = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { resetSearch } = useSearchContext()
  
  return (
    <Typography variant="h6" align={ mobile ? 'center' : 'left' } className={ classes.title }>
      <Link to="/" onClick={ resetSearch }>NeuroBridge</Link>
    </Typography>
  )
}
