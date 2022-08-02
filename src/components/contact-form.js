import { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const subjectOptions = [
  { value: 'question', displayText: 'I have a question' },
  { value: 'suggestion', displayText: 'I have a suggestion' },
  { value: 'bug', displayText: 'I found a bug!' },
  { value: 'other', displayText: 'Other' },
]

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Please enter your name.'),
  email: yup
    .string()
    .email('Invalid email format'),
  subject: yup
    .string()
    .oneOf(subjectOptions.map(option => option.value))
    .required('Please select the most applicable subject.'),
  message: yup
    .string()
    .required('Please enter a message.'),
})

//

const defaults = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

//

export const ContactForm = ({ presets }) => {
  const {
    control,
    handleSubmit,
    formState,
    register,
    setFocus,
  } = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults, ...presets },
  })

  useEffect(() => {
    setFocus('name')
  }, [])

  const onSubmit = data => {
    console.log('SUBMIT')
    console.table(data)
  }

  return (
    <Stack spacing={ 4 } m={ 2 }>
      { /* NAME */ }
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

      { /* EMAIL */ }
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

      { /* SUBJECT */ }
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

      { /* MESSAGE */ }
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
      <Button
        onClick={ handleSubmit(onSubmit) }
        variant="contained"
        disabled={ Object.keys(formState.errors).length > 0 }
      >Submit</Button>
    </Stack>
  )
}

ContactForm.propTypes = {
  presets: PropTypes.object,
}
