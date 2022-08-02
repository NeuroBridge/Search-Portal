import PropTypes from 'prop-types'
import {
  Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const subjectOptions = [
  { value: 'question', displayText: 'I have a question' },
  { value: 'suggestion', displayText: 'I have a suggestion' },
  { value: 'technical-difficulties', displayText: 'I found a bug!' },
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

export const ContactForm = ({ presetSubject }) => {
  const {
    handleSubmit,
    formState,
    register,
  } = useForm({
    schema,
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    console.log('SUBMIT')
    console.table(data)
  }

  return (
    <Stack spacing={ 2 }>
      { /* NAME */ }
      <TextField
        name="name"
        label="Name"
        variant="outlined"
        fullWidth
        { ...register('name') }
        error={ !!formState.errors.name }
      />
      {
        'name' in formState.errors && <FormHelperText>{ formState.errors.name.message }</FormHelperText>
      }

      { /* EMAIL */ }
      <TextField
        name="email"
        label="Email"
        variant="outlined"
        fullWidth
        { ...register('email') }
        error={ !!formState.errors.email }
      />
      {
        'email' in formState.errors && <FormHelperText>{ formState.errors.email.message }</FormHelperText>
      }

      { /* SUBJECT */ }
      <FormControl fullWidth>
        <InputLabel id="subject-select-label">Subject</InputLabel>
        <Select
          labelId="subject-select-label"
          name="subject"
          label="Subject"
          variant="outlined"
          defaultValue={ presetSubject }
          { ...register('subject') }
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
      </FormControl>
      {
        'subject' in formState.errors && <FormHelperText>{ formState.errors.subject.message }</FormHelperText>
      }

      { /* MESSAGE */ }
      <TextField
        name="message"
        label="Message"
        variant="outlined"
        fullWidth
        { ...register('message') }
        error={ !!formState.errors.message }
        multiline rows={ 5 }
      />
      {
        'message' in formState.errors && <FormHelperText>{ formState.errors.message.message }</FormHelperText>
      }
      <Button onClick={ handleSubmit(onSubmit) } variant="contained">Submit</Button>
    </Stack>
  )
}

ContactForm.propTypes = {
  presetSubject: PropTypes.string.isRequired,
}

ContactForm.defaultProps = {
  presetSubject: 'general',
}
