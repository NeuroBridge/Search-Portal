import PropTypes from 'prop-types'
import {
  FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { subjectOptions } from './config'

//

export const TokenField = ({ value }) => {
  return (
    <input
      type="hidden"
      name="token"
      value={ value }
    />
  )
}

TokenField.propTypes = {
  value: PropTypes.string.isRequired,
}

//

export const NameField = () => {
  const { formState, register } = useFormContext()
  return (
    <FormControl>
      <TextField
        name="name"
        label="Name"
        variant="outlined"
        { ...register('name') }
        error={ !!formState.errors.name }
      />
      {
        'name' in formState.errors && <FormHelperText>{ formState.errors.name.message }</FormHelperText>
      }
    </FormControl>
  )
}

//

export const EmailField = () => {
  const { formState, register } = useFormContext()
  return (
    <FormControl>
      <TextField
        name="email"
        label="Email"
        variant="outlined"
        { ...register('email') }
        error={ !!formState.errors.email }
      />
      {
        'email' in formState.errors && <FormHelperText>{ formState.errors.email.message }</FormHelperText>
      }
    </FormControl>
  )
}

//

export const SubjectField = () => {
  const { control, formState } = useFormContext()
  return (
    <FormControl>
      <InputLabel id="subject-select-label">Subject</InputLabel>
      <Controller
        name="subject"
        control={ control }
        render={ ({ field }) => (
          <Select
            labelId="subject-select-label"
            name="subject"
            label="Subject"
            variant="outlined"
            { ...field }
            error={ !!formState.errors.subject }
          >
            {
              subjectOptions.map(option => (
                <MenuItem
                  key={ `subject-option-${ option.value }` }
                  value={ option.value }
                >{ option.displayText }</MenuItem>
              ))
            }
          </Select>
        ) }
      />
      {
        'subject' in formState.errors && <FormHelperText>{ formState.errors.subject.message }</FormHelperText>
      }
    </FormControl>
  )
}

//

export const MessageField = () => {
  const { formState, register } = useFormContext()
  return (
    <FormControl>
      <TextField
        name="message"
        label="Message"
        variant="outlined"
        { ...register('message') }
        error={ !!formState.errors.message }
        multiline rows={ 5 }
      />
      {
        'message' in formState.errors && <FormHelperText>{ formState.errors.message.message }</FormHelperText>
      }
    </FormControl>
  )
}
