import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, InputAdornment, 
  ListItem, ListItemButton, ListItemText, Stack, TextField,
} from '@mui/material'
import {
  Add as AddIcon,
  Backspace as ClearIcon,
} from '@mui/icons-material'
import { useBasket } from '../../basket'
import { useOntology } from '../../ontology'
import elasticlunr from 'elasticlunr'
import { FixedSizeList } from 'react-window'

//

let index = elasticlunr(function () {
  this.addField('id')
  this.addField('labels')
  this.setRef('id')
})

//

const ConceptSelectDialog = ({ open, onClose, onCancel, ...rest }) => {
  const ontology = useOntology()
  const [searchText, setSearchText] = useState('')
  const [filteredTerms, setFilteredTerms] = useState(ontology.terms)
  const queryField = useRef(null)

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

  const renderRow = useCallback(({ index, style }) => (
    <ListItem key={ `option-${ index }` } component="div" disablePadding sx={ style }>
      <ListItemButton onClick={ () => onClose(filteredTerms[index].id) }>
        <ListItemText primary={ filteredTerms[index].id } />
      </ListItemButton>
    </ListItem>
  ), [filteredTerms])

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { height: '80%', maxHeight: 600 } }}
      maxWidth="sm"
      TransitionProps={{ onEntering: handleEntering }}
      open={ open }
      { ...rest }
      onClose={ () => onClose() }
    >
      <DialogTitle>Add term</DialogTitle>
      <TextField
        fullWidth
        onChange={ requestSearch }
        value={ searchText }
        inputRef={ queryField }
        InputProps={{ 
          sx: { borderRadius: 0 },
          endAdornment:
            <InputAdornment position="end">
              <IconButton
                aria-label="clear input"
                onClick={ clearSearchText }
                edge="end"
              ><ClearIcon /></IconButton>
            </InputAdornment>
        }}
      />
      <DialogContent sx={{ p: 0 }}>
        <FixedSizeList
          height={ 480 }
          width={ 600 }
          itemSize={ 48 }
          itemCount={ filteredTerms.length }
          overscanCount={ 50 }
        >
          { renderRow }
        </FixedSizeList>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          autoFocus
          onClick={ onCancel }
          variant="outlined"
        >Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

ConceptSelectDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

//

export const AddTermForm = () => {
  const basket = useBasket()
  const [open, setOpen] = useState(false)

  const handleClose = newValue => {
    setOpen(false)

    if (typeof newValue === 'string') {
      basket.add(newValue)
    }
  }

  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{
        '.add-term-button': {
          borderWidth: '2px !important',
          '.label': {
            pt: '4px',
            margin: 'auto'
          }
        }
      }}
    >
      <Button
        variant="outlined"
        startIcon={ <AddIcon /> }
        className="add-term-button"
        onClick={ () => setOpen(true) }
      ><Box component="span" className="label">Add term</Box></Button>
      <ConceptSelectDialog
        open={ open }
        onClose={ handleClose }
        onCancel={ handleClose }
      />
    </Stack>
  )
}
