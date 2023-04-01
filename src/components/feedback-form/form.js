import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import {
  Check as CheckIcon,
  Refresh as ResetIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useAppContext } from '../../context'
import { FORM_URL, schema, defaults } from './config'
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
 * notice how this passed-in data overwrites the default object data.
 */
export const FeedbackForm = ({ presets }) => {
  const { notify } = useAppContext()
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
    formState: {
      isSubmitting,
      isSubmitSuccessful,
    },
    reset,
    setFocus,
  } = methods

  /*
   * recaptcha token-fetching function
   */
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }
    token.current = await executeRecaptcha('formSubmit')
  }, [executeRecaptcha])

  /*
   * fetch token on first render.
   */
  useEffect(() => {
    handleReCaptchaVerify()
  }, [handleReCaptchaVerify])

  /*
   * start user's cursor in first field on initial render.
   */
  useEffect(() => {
    setFocus('name')
  }, [])

  /*
   * user-requested form-clearing:
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
   * this notification is shown if the form cannot send.
   * it's more than just text, as it guides the user to
   * contact via email (mailto), hence the breaking out
   * into separate component.
   */
  const ErrorNotification = () => {
    return (
      <Box>
        <Typography paragraph>
          We&apos;re sorry. Your message couldn&apos;t be sent.
        </Typography>
        <Typography paragraph>
          Please send an email
          to <a href="mailto:neurobridges-team@renci.org">
          neurobridges-team@renci.org</a> instead.
        </Typography>
      </Box>
    )
  }

  /*
   * the actual message-sending function,
   * which gets wrapped with react-hook-form's `handleSubmit`.
   */
  const submitHandler = useCallback(() => {
    axios.post(FORM_URL, new FormData(formRef.current))
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          setShowThanks(true)
        }
      })
      .catch(error => {
        console.error(error.message)
        notify(<ErrorNotification />, 'error')
      })
  }, [])

  return (
    <FormProvider { ...methods }>
      <Box sx={{ display: 'flex', position: 'relative' }}>

        <Stack
          component="form"
          ref={ formRef }
          spacing={ 4 }
          sx={{ width: '100%', mt: 1, mb: 2 }}
        >
          <NameField />
          <EmailField />
          <SubjectField />
          <MessageField />
          <TokenField value={ token.current } />
        </Stack>

        <Thanks show={ showThanks } />

      </Box>

      <Divider sx={{ transform: 'scaleX(1.05)', my: '1rem' }} />

      <Stack
        direction="row"
        gap={ 4 }
        sx={{
          '& > button': { flex: 1 },
          minWidth: '100%',
          mt: 3, mb: 1,
        }}
      >
        <Button
          onClick={ handleClickClearForm }
          variant="outlined"
          startIcon={ <ResetIcon /> }
        >Reset</Button>

        <Button
          onClick={ handleSubmit(submitHandler) }
          variant="contained"
          disabled={ isSubmitting || isSubmitSuccessful }
          startIcon={ showThanks ? <CheckIcon /> : <SendIcon /> }
        >{ showThanks ? 'Submitted!' : 'Send' }</Button>
      </Stack>

    </FormProvider>
  )
}

FeedbackForm.propTypes = {
  presets: PropTypes.object,
}
