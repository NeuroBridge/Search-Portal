import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Divider, Stack } from '@mui/material'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { formURL, schema, defaults } from './config'
import { NameField, EmailField, SubjectField, TokenField, MessageField } from './fields'
import { Thanks } from './thanks'

/*
 * Basic Contact Form
 *
 * @presets: used to auto-populate the form on initial render
 *
 * for example, we may want to declaratively navigate users to
 * the feedback view that contains this form, with the form
 * ready to send us a bug report.
 *
 *   navigate('/feedback', { state: {
 *     subject: 'bug',
 *     message: `This thing broke!`
 *   } }),
 *
 * where `navigate` is from react-rotuer-dom.
 * notice how this passed in data overwrite the default object data.
 */
export const FeedbackForm = ({ presets }) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [showThanks, setShowThanks] = useState(false)
  const formRef = useRef(null)
  const token = useRef('')
  const methods = useForm({
    schema,
    resolver: yupResolver(schema),
    defaultValues: { ...defaults, ...presets },
  })
  const {
    handleSubmit,
    formState,
    reset,
    setFocus,
  } = methods

  /* captcha verify start */
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }
    token.current = await executeRecaptcha('formSubmit')
  }, [executeRecaptcha])

  useEffect(() => {
    handleReCaptchaVerify()
  }, [handleReCaptchaVerify])
  /* captcha verify end*/

  /*
   * start user's cursor in first field on initial render.
   */
  useEffect(() => {
    setFocus('name')
  }, [])

  /*
   * user-request form-clearing:
   * - reset fields to defaults,
   * - remove "thank you" message,
   * - fetch new captcha token.
   */
  const handleClickClearForm = () => {
    reset(defaults)
    setShowThanks(false)
    handleReCaptchaVerify()
  }

  /*
   * the actual post request-making function,
   * which gets wrapped with react-hook-form's `handleSubmit`.
   */
  const submitHandler = useCallback(() => {
    axios.post(formURL, new FormData(formRef.current))
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          setShowThanks(true)
        }
      })
      .catch(error => {
        console.error(error.message)
      })
  }, [])

  return (
    <FormProvider { ...methods }>
      <Box sx={{ display: 'flex', position: 'relative' }}>

        <Stack
          component="form"
          ref={ formRef }
          spacing={ 4 }
          sx={{ width: '100%', mt: 1, mb: 3 }}
        >
          <NameField />
          <EmailField />
          <SubjectField />
          <MessageField />
          <TokenField value={ token.current } />
        </Stack>

        <Thanks show={ showThanks } />

      </Box>

      <Divider sx={{ transform: 'scaleX(1.05)', my: '1rem' }}/>

      <Stack direction="row" gap={ 4 } sx={{ '& > button': { flex: 1 }, minWidth: '100%', mt: 3, mb: 1 }}>
        <Button
          onClick={ handleClickClearForm }
          variant="outlined"
        >{ showThanks ? 'Start Over' : 'Clear' }</Button>

        <Button
          onClick={ handleSubmit(submitHandler) }
          variant="contained"
          disabled={ formState.isSubmitting || formState.isSubmitted || Object.keys(formState.errors).length > 0 }
        >{  showThanks ? 'Submitted!' : 'Submit' }</Button>
      </Stack>

    </FormProvider>
  )
}

FeedbackForm.propTypes = {
  presets: PropTypes.object,
}
