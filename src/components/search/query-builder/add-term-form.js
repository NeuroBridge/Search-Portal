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
  OpenInBrowser as InspectTermIcon,
} from '@mui/icons-material'
import { useBasket } from '../../basket'
import { useDrawer } from '../../drawer'
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

const ConceptSelectDialog = ({ open, closeHandler, cancelHandler, ...rest }) => {
  const drawer = useDrawer()
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

  const handleClickSelectTerm = id => () => {
    closeHandler(id)
  }

  const handleClickInspectTerm = id => () => {
    drawer.setTermId(id)
    closeHandler()
  }

  const renderRow = useCallback(({ index, style }) => (
    <ListItem
      key={ `option-${ index }` }
      disablePadding
      sx={{
        ...style,
        '& svg': {
          transform: 'rotate(90deg)',
          filter: 'opacity(0.25)',
        },
        '&:hover svg': {
          filter: 'opacity(1.0)',
        },
      }}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="view in browser"
          onClick={ handleClickInspectTerm(filteredTerms[index].id) }
        ><InspectTermIcon /></IconButton>
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
      onClose={ () => closeHandler() }
    >
      <DialogTitle>Add Term</DialogTitle>
      <TextField
        fullWidth
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
        >{ renderRow }</FixedSizeList>
      </DialogContent>
      <Divider />
      <DialogActions>
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
          '.label': { pt: '4px', margin: 'auto', }
        }
      }}
    >
      <Button
        variant="outlined"
        startIcon={ <AddIcon /> }
        className="add-term-button"
        onClick={ () => setOpen(true) }
      ><Box component="span" className="label">Add Term</Box></Button>
      <ConceptSelectDialog
        open={ open }
        closeHandler={ handleClose }
        cancelHandler={ handleClose }
      />
    </Stack>
  )
}
