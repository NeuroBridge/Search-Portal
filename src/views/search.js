import { useCallback, useMemo } from 'react'
import { useSearchContext } from '../components/search/context'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import { TermCard } from '../components/search/term-card'
import { TermDialog } from '../components/search/term-dialog'

const useStyles = makeStyles(theme => ({
  main: {
    margin: theme.spacing(4),
  },
  terms: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: theme.spacing(2),
  },
}))

export const SearchView = () => {
  const classes = useStyles()
  const { busy, doSearch, terms, currentTerm, setCurrentTerm, previousTerm, nextTerm, searchedQuery } = useSearchContext()
  const dialogOpen = useMemo(() => !!currentTerm, [currentTerm])

  const handleClickTerm = index => event => {
    if (0 <= index && index < terms.length) {
      setCurrentTerm(terms[index])
    }
  }

  const MemoizedResultsHeader = useCallback(() => <Typography>"{ searchedQuery }" returned { terms.length } results</Typography>, [searchedQuery, terms])

  return (
    <main className={ classes.main }>
      { searchedQuery && <MemoizedResultsHeader /> }
      <br />
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 } className={ classes.terms }>
          {
            !!terms.length && terms.map((term, index) => <TermCard term={ term } key={ term.label } clickHandler={ handleClickTerm(index) }/>)
          }
          <TermDialog open={ dialogOpen } term={ currentTerm } closeHandler={ handleClickTerm(null) } />
        </Grid>
      </Grid>
    </main>
  )
}