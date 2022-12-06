import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, InputAdornment, 
  ListItem, ListItemButton, ListItemText, Stack, TextField, Typography, useTheme,
} from '@mui/material'
import {
  Add as AddIcon,
  Backspace as ClearIcon,
  OpenInBrowser as InspectTermIcon,
  AccessTime as HistoryIcon,
} from '@mui/icons-material'
import { useBasket } from '../../basket'
import { useDrawer } from '../../drawer'
import { useOntology } from '../../ontology'
import { useSearch } from '../context'
import elasticlunr from 'elasticlunr'
import { FixedSizeList } from 'react-window'
import TimeAgo from 'react-timeago'

//

let index = elasticlunr(function () {
  this.addField('id')
  this.addField('labels')
  this.setRef('id')
})

//

const ConceptSelectDialog = ({ open, closeHandler, cancelHandler, ...rest }) => {
  const theme = useTheme()
  const drawer = useDrawer()
  const ontology = useOntology()
  const [searchText, setSearchText] = useState('')
  const [filteredTerms, setFilteredTerms] = useState(ontology.terms)
  const queryField = useRef(null)
  const { addToSearchHistory, resetSearchHistory, searchHistory } = useSearch()

  useEffect(() => {
    if (ontology.terms.length === 0) {
      return
    }
    ontology.terms.forEach(term => {
      index.addDoc(term)
    })
    setFilteredTerms(Object.values(index.documentStore.docs))
  }, [ontology.terms])

  const clearSearchText = () => {
    setSearchText('')
    setFilteredTerms(Object.values(index.documentStore.docs))
  }

  const handleEntering = () => {
      if (!open || !queryField?.current) {
        return
      }
      queryField.current.focus()
      queryField.current.select()
  }

  // this function uses the incoming query to filter terms to those that match.
  // currently, this fires with every keypress in the search input field.
  const requestSearch = event => {
    const newSearchText = event.target.value || ''
    setSearchText(newSearchText)
    const results = index.search(newSearchText, { expand: true })
    if (newSearchText === '') {
      setFilteredTerms(Object.values(index.documentStore.docs))
      return
    }
    const newFilteredTerms = results.map(result => ontology.find(result.ref))
    setFilteredTerms(newFilteredTerms)
  }

  const handleClickSelectTerm = id => () => {
    closeHandler(id)
    addToSearchHistory(id)
  }

  const handleClickInspectTerm = id => () => {
    drawer.setTermId(id)
    closeHandler()
  }

  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': { height: '80%', maxHeight: 600 },
        '& .MuiDialogTitle-root': { color: 'text.primary' },
      }}
      maxWidth="sm"
      TransitionProps={{ onEntering: handleEntering }}
      open={ open }
      { ...rest }
      onClose={ () => closeHandler() }
    >
      <DialogTitle>Add Concept</DialogTitle>
      <TextField
        fullWidth
        placeholder="Enter search text.."
        onChange={ requestSearch }
        value={ searchText }
        inputRef={ queryField }
        InputProps={{ 
          sx: { borderRadius: 0 },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear input"
                onClick={ clearSearchText }
                edge="end"
              ><ClearIcon /></IconButton>
            </InputAdornment>
          ),
        }}
      />
      <DialogContent sx={{ p: 0 }}>
        <FixedSizeList
          height={ 420 }
          width={ 600 }
          itemSize={ 68 }
          itemCount={ filteredTerms.length }
          overscanCount={ 36 }
        >{
          ({ index, style }) => (
            <ListItem
              key={ `option-${ index }` }
              disablePadding
              sx={{ ...style }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="view ontology context"
                  onClick={ handleClickInspectTerm(filteredTerms[index].id) }
                  sx={{ '& svg': { transform: 'rotate(90deg)' } }}
                ><InspectTermIcon color="disabled" /></IconButton>
              }
            >
              <ListItemButton onClick={ handleClickSelectTerm(filteredTerms[index].id) }>
                <ListItemText
                  primary={ filteredTerms[index].id }
                  secondary={ filteredTerms[index].labels.join(', ') }
                  secondaryTypographyProps={{ sx: {
                    maxHeight: '1rem',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  } }}
                />
                {
                  filteredTerms[index].id in searchHistory && (
                    <Fragment>
                      <Typography
                        component={ TimeAgo }
                        date={ searchHistory[filteredTerms[index].id] }
                        variant="caption"
                        sx={{ color: theme.palette.grey[500], pt: '4px', pr: 1 }}
                      />
                      <HistoryIcon color="disabled" fontSize="small" />
                    </Fragment>
                  )
                }
              </ListItemButton>
            </ListItem>
          )
        }</FixedSizeList>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{
        display: 'flex', justifyContent: 'space-between'
      }}>
        <Button
          onClick={ resetSearchHistory }
          variant="outlined"
        >Clear search history</Button>
        <Button
          autoFocus
          onClick={ cancelHandler }
          variant="outlined"
        >Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

ConceptSelectDialog.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

//

export const AddTermForm = () => {
  const basket = useBasket()
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(newValue => {
    setOpen(false)

    if (typeof newValue === 'string') {
      basket.add(newValue)
    }
  }, [basket.ids])

  return (
    <Stack
      direction="row"
      justifyContent="center"
    >
      <Button
        startIcon={ <AddIcon /> }
        className="add-term-button"
        onClick={ () => setOpen(true) }
        variant={ basket.ids.length === 0 ? 'contained' : 'text' }
      ><Box component="span" className="label">Add Concept</Box></Button>
      <ConceptSelectDialog
        open={ open }
        closeHandler={ handleClose }
        cancelHandler={ handleClose }
      />
    </Stack>
  )
}
