import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Card, CardActionArea, CardContent,
  Fade, IconButton,
  TextField, Typography,
} from '@mui/material'
import {
  AccessTime as HistoryIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import TimeAgo from 'react-timeago'
import { useLocalStorage } from '../hooks'
import { useBasket } from './basket'
import { TermActionButtons } from './term-action-buttons'

//

const SearchBar = ({ value, onChange, clearSearch, inputRef, onFocus }) => {
  return (
    <TextField
      className="search-field"
      fullWidth
      inputRef={ inputRef }
      value={ value }
      onChange={ onChange }
      placeholder="Search…"
      onFocus={ onFocus }
      InputProps={{
        style: {
          height: '5rem',
          fontSize: '150%',
        },
        startAdornment: <SearchIcon fontSize="small" sx={{ margin: '1rem'}} />,
        endAdornment: (
          <IconButton
            title="Clear"
            aria-label="Clear"
            size="small"
            sx={{
              margin: '1rem',
              visibility: value ? 'visible' : 'hidden',
            }}
            onClick={ clearSearch }
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ),
      }}
    />
  )
}

SearchBar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  value: PropTypes.string.isRequired,
  inputRef: PropTypes.object,
}

//

const LabelList = ({ labels }) => {
  if (!labels.length) {
    return 'no labels'
  }
  return (
    <Box>
      {
        labels
          .filter(label => typeof label === 'string')
          .sort((l, m) => l.toLowerCase() < m.toLowerCase() ? -1 : 1)
          .map(label => (
            <div key={ label }>
              <Typography variant="caption"> &bull; { label }</Typography>
            </div>
          ))
      }
    </Box>
  )
}

LabelList.propTypes = {
  labels: PropTypes.array.isRequired,
}

//

export const TermCard = ({ term, selected, compact, onClick }) => {
  return (
    <Card sx={{
      border: `1px solid #1976d2${ selected ? 'ff' : '11' }`,
      transition: 'border-color 250ms',
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        border: `1px solid #1976d2${ selected ? 'ff' : '66' }`,
        cursor: 'pointer',
      },
    }}>
      <CardActionArea onClick={ onClick } sx={{ flex: 1 }}>
        <CardContent>
          <Typography>{ term.id }</Typography>
          { !compact && <LabelList labels={ term.labels } /> }
        </CardContent>
      </CardActionArea>
      <CardContent>
        <TermActionButtons termId={ term.id} />
      </CardContent>
    </Card>
  )
}

TermCard.propTypes = {
  term: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  compact: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

TermCard.defaultProps = {
  selected: false,
  compact: false,
}

//

const HistoryItemCard = ({ termId, timestamp, onClick }) => {
  return (
    <Card sx={{
      border: `1px solid #1976d211`,
      display: 'flex',
    }}>
      <CardActionArea onClick={ onClick } >
        <CardContent sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <HistoryIcon />
          <Box>
            <Typography>{ termId }</Typography>
            <Typography variant="caption">
              <TimeAgo date={ timestamp } />
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardContent>
        <TermActionButtons termId={ termId } />
      </CardContent>
    </Card>
  )
}

HistoryItemCard.propTypes = {
  termId: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

//

export const SearchForm = ({ inputRef, searchText, searchHandler, matches }) => {
  const basket = useBasket()
  const [open, setOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useLocalStorage('search-history', [])

  const addToSearchHistory = id => {
    const newHistoryItem = {
      timestamp: new Date(),
      termId: id,
    }
    setSearchHistory([newHistoryItem, ...searchHistory].slice(0, 10))
  }

  const handleClickTerm = id => () => {
    if (!basket.contains(id)) {
      addToSearchHistory(id)
    }
    basket.toggle(id)
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
                !searchText && searchHistory.length ? (
                  // history list.
                  // renders before search text has been entered.
                  // ...unless there is no history yet.
                  <Fragment>
                    <Typography variant="caption" align="right">
                      Recently selected terms
                    </Typography>

                    {
                      searchHistory
                        .slice(0, 10)
                        .map(({ timestamp, termId }) => (
                          <HistoryItemCard
                            key={ timestamp }
                            termId={ termId }
                            timestamp={ timestamp }
                            onClick={ handleClickTerm(termId) }
                          />
                        ))
                    }
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

              <br />
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
