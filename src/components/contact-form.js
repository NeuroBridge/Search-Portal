import { useCallback, useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'

const initialformValues = {
  name: '',
  email: '',
  message: '',
  submitted: false,
  success: false,
}

const useForm = () => {
  const [values, setValues] = useState(initialformValues)
  const [errors, setErrors] = useState({})
  
  const validate = useCallback(() => {
    // validate form field values
  }, [])

  const handleChangeValue = useCallback(event => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
  }, [values])

  const handleSubmit = useCallback(event => {
    console.log('submit!')
    console.table(values)
  }, [values])

  const isValid = () => {
    // check validity
  }

  return {
    handleChangeValue,
    handleSubmit,
    isValid,
    errors,
    values,
  }
}

export const ContactForm = () => {
  const { handleChangeValue, handleSubmit, values } = useForm()

  return (
    <form>
      <Stack spacing={ 2 }>
        <TextField
          name="name"
          label="Name"
          fullWidth
          onChange={ handleChangeValue }
        />
        <TextField
          name="email"
          label="Email"
          fullWidth
          onChange={ handleChangeValue }
        />
        <TextField
          name="message"
          label="Message"
          fullWidth
          multiline rows={ 5 }
          onChange={ handleChangeValue }
        />
        <Button onClick={ handleSubmit } variant="contained">Submit</Button>
        <pre>{ JSON.stringify(values, null, 2) }</pre>
      </Stack>
    </form>
  )
}