import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Button, Card, CardContent,
  Fade, Typography,
} from '@mui/material'
import { useLocalStorage } from '../../hooks'
import { useBasket } from '../basket'
import { SearchBar } from './search-bar'
import { TermCard } from './term-card'
import { HistoryItemCard } from './history-item-card'

//

export const SearchForm = ({ inputRef, searchText, searchHandler, matches }) => {
  const basket = useBasket()
  const [open, setOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useLocalStorage('nb-search-history', {})

  const addToSearchHistory = id => {
    let newSearchHistory = { ...searchHistory }
    newSearchHistory[id] = Date.now()
    setSearchHistory({ ...newSearchHistory })
  }

  const resetSearchHistory = () => {
    setSearchHistory({})
  }

  const handleClickTerm = id => () => {
    basket.add(id)
    addToSearchHistory(id)
    setOpen(false)
  }

  return (
    <Fragment>
      {/*
        this is the overlay, which activates when search form is active.
        this allows the user to close the search tray by clicking outside
        of it, on the overlay.
      */}
      <Fade in={ open }>
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: 'linear-gradient(180deg, #9c99a333 10%, #9c99a3cc 25%, #5c5963 90%)',
            zIndex: 99,
          }}
          onClick={ () => setOpen(false) }
        />
      </Fade>
      <Box sx={{
        border: `1px solid ${ open ? '#1976d2' : '#ccc' }`,
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '6px',
        transform: `scale(${ open ? 1.0 : 0.95 })`,
        filter: `opacity(${ open ? 1.0 : 0.5 })`,
        transition: `
          filter 200ms,
          transform 250ms cubic-bezier(.8, .5, .2, 1.4),
          border-color 500ms
        `,
        '&:focus-within': {
          transform: 'scale(1.0)',
          filter: 'opacity(1.0)',
        },
        zIndex: 999,
      }}>
        <SearchBar
          value={ searchText }
          onChange={ event => searchHandler(event.target.value) }
          clearSearch={ () => searchHandler('') }
          inputRef={ inputRef }
          onFocus={ () => setOpen(true) }
        />
        <Fade in={ open }>
          <Card sx={{
            border: '3px solid #1976d2',
            maxHeight: '500px !important',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            overflowY: 'scroll',
            position: 'absolute',
            top: 'calc(100% + 1rem)',
            backgroundColor: '#fff',
          }}>
            {/* this wrapping Box is our scrollable surface inside the dropdown panel.*/}
            <CardContent sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '0 !important',
            }}>
              {
                !searchText && Object.keys(searchHistory).length ? (
                  // history list.
                  // renders before search text has been entered.
                  // ...unless there is no history yet.
                  <Fragment>
                    <Typography variant="caption" align="right">
                      Recently selected terms
                    </Typography>

                    {
                      Object.keys(searchHistory)
                        .sort((a, b) => searchHistory[a] < searchHistory[b] ? 1 : -1)
                        .map(id => (
                          <HistoryItemCard
                            key={ searchHistory[id] }
                            termId={ id }
                            timestamp={ searchHistory[id] }
                            onClick={ handleClickTerm(id) }
                          />
                        ))
                    }
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end'  }}>
                      <Button onClick={ resetSearchHistory } size="small" variant="text">
                        Clear search history
                      </Button>
                    </Box>
                  </Fragment>
                ) : (
                  // matching terms.
                  // renders after search text has been entered.
                  // ...and before if there's no recent history to show.
                  <Fragment>
                    <Typography variant="caption" align="right">
                      {
                        matches.length > 0
                        ? `Showing 1 to ${ matches.length >= 15 ? '15' : matches.length }
                          of ${ matches.length } terms ${ searchText !== '' ? `matching "${ searchText }"` : '' }`
                        : 'No matching terms'
                      }
                    </Typography>
                    
                    {
                      matches
                        // we'll only show 15 of the matching items
                        .slice(0, 15)
                        .map(term => (
                          <TermCard
                            key={ term.id }
                            term={ term }
                            selected={ basket.contains(term.id) }
                            onClick={ handleClickTerm(term.id) }
                          />
                        ))
                    }
                  </Fragment>
                )
              }
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </Fragment>
  )
}

SearchForm.propTypes = {
  inputRef: PropTypes.object,
  searchText: PropTypes.string.isRequired,
  searchHandler: PropTypes.func,
  matches: PropTypes.array,
}
