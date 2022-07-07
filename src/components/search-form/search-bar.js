import PropTypes from 'prop-types'
import {
  IconButton, TextField,
} from '@mui/material'
import {
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

//

export const SearchBar = ({ value, onChange, clearSearch, inputRef, onFocus }) => {
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
