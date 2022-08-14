import { Box, CardContent, MenuItem, Select, Stack, Typography } from '@mui/material'
import { Add as PlusIcon } from '@mui/icons-material'
import { useInterfaceContext } from './interface'

export const TermSelects = () => {
  const { handleChangeTermLabel, terms, termLabels } = useInterfaceContext()

  return (
    <CardContent>
      <Stack
        direction="row"
        divider={ <PlusIcon color="disabled" /> }
        spacing={ 0 }
        alignItems="center"
        sx={{ flexWrap: 'wrap', padding: '0.5rem' }}
      >
        {
          terms.map(term => term.labels.length === 1
            ? (
              <Box
                key={ `${ term.id }-select-box` }
                sx={{
                  border: '1px solid #c4c4c4',
                  borderRadius: '4px',
                  padding: '0.4rem 0.5rem',
                  margin: '0 0.5rem',
                }}
              >
                <Typography>{ term.id }</Typography>
              </Box>
            ) : (
              <Box key={ `${ term.id }-select-box` } sx={{ padding: '0.5rem' }}>
                <Select
                  id={ `${ term.id }-select` }
                  value={ termLabels[term.id] || 0 }
                  onChange={ handleChangeTermLabel(term.id) }
                  sx={{ '.MuiSelect-select': { padding: '0.5rem' } }}
                >
                  {
                    term.labels.map((label, i) => (
                      <MenuItem key={ `${ term.id }-label-${ i }` } value={ i }>{ label }</MenuItem>
                    ))
                  }
                </Select>
              </Box>
            )
          )
        }
      </Stack>
    </CardContent>
  )
}