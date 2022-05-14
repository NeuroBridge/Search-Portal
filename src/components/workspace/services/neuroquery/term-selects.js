import { Box, CardContent, MenuItem, Select, Stack } from '@mui/material'
import { Add as PlusIcon } from '@mui/icons-material'
import { useInterfaceContext } from './'

export const TermSelects = () => {
  const { handleChangeTermLabel, terms, termLabels } = useInterfaceContext()

  return (
    <CardContent>
      <Stack
        direction="row"
        divider={ <PlusIcon color="disabled" /> }
        spacing={ 0 }
        alignItems="center"
        sx={{ flexWrap: 'wrap', padding: '0.5rem', }}
      >
        {
          terms.map(term => (
            <Box key={ `${ term.id }-select` } sx={{ padding: '0.5rem' }}>
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
          ))
        }
      </Stack>
    </CardContent>
  )
}