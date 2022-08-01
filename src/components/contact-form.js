import { useEffect } from 'react'
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
  name: yup.string().required('Please enter your name.'),
  email: yup.string().email('Invalid email format'),
  subject: yup.string().oneOf(['question', 'other', 'suggestion', 'technical-difficulties']).required('Please select the most applicable subject.'),
  message: yup.string().required('Please enter a message.'),
})

export const ContactForm = () => {
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

  // debugging
  useEffect(() => {
    if (formState) {
      console.table(formState.errors)
    }
  })

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
          { ...register('subject') }
          error={ !!formState.errors.subject }
        >
          <MenuItem value="question">Question</MenuItem>
          <MenuItem value="suggestion">Suggestion</MenuItem>
          <MenuItem value="technical-difficulties">Technical difficulties</MenuItem>
          <MenuItem value="other">Other</MenuItem>
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