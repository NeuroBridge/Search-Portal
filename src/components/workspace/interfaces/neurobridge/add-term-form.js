import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Button, Dialog, DialogActions, DialogContent,
  ListItem, ListItemButton, ListItemText, TextField,
} from '@mui/material'
import {
  Add as AddIcon,
} from '@mui/icons-material'
import { useBasket } from '../../../basket'
import { useOntology } from '../../../ontology'
import elasticlunr from 'elasticlunr'
import { FixedSizeList } from 'react-window'

//

var index = elasticlunr(function () {
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
  }, [ontology.terms])

  const handleEntering = () => {
    console.log('entering...')
  }

  // this function uses the incoming query to filter terms to those that match.
  // currently, this fires with every keypress in the search input field.
  const requestSearch = event => {
    const results = index.search(event.target.value, { expand: true })
    setSearchText(event.target.value)
    const newFilteredTerms = results.map(result => ontology.find(result.ref))
    setFilteredTerms(newFilteredTerms)
  }

  const renderRow = ({ index }) => {
    // console.log(index)
    return (
      <ListItem key={ `option-${ index }` } component="div" disablePadding>
        <ListItemButton onClick={ () => onClose(filteredTerms[index].id) }>
          <ListItemText primary={ filteredTerms[index].id } />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': {  height: '80%', maxHeight: 600 } }}
      maxWidth="md"
      TransitionProps={{ onEntering: handleEntering }}
      open={ open }
      { ...rest }
    >
      <TextField
        fullWidth
        onChange={ requestSearch }
        value={ searchText }
        inputRef={ queryField }
        InputProps={{ 
          sx: { borderRadius: 0 },
        }}
      />
      <DialogContent>
        { searchText ? (
          <FixedSizeList
            height={ 450 }
            width={ 600 }
            itemSize={ 48 }
            itemCount={ filteredTerms.length }
            overscanCount={ 50 }
          >
            { renderRow }
          </FixedSizeList>
        ) : (
          <Box sx={{ width: '600px' }}>
            Enter search text
          </Box>
        )
      }
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={ onCancel }>Cancel</Button>
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
    <Box sx={{
      height: '100px',
      position: 'relative',
    }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={ <AddIcon /> }
        onClick={ () => setOpen(true) }
        sx={{
          height: '42px',
          borderWidth: '2px !important',
          mr: 5,
        }}
      ><Box component="span" sx={{ mt: '3px', }}>Add a concept</Box></Button>
      <ConceptSelectDialog
        open={ open }
        onClose={ handleClose }
        onCancel={ handleClose }
      />
    </Box>
  )
}
