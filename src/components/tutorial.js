import { useState } from 'react'
import { Button, Card, CardContent, Divider, Stack, Stepper, Step, StepButton, Typography } from '@mui/material'
import {
  NavigateBefore as BackIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material'

const steps = [
  {
    title: 'Adding Concepts',
    description: `
      Officia adipisicing aute excepteur fugiat non ut pariatur pariatur in.
      Consequat excepteur dolor in commodo esse labore exercitation dolor adipisicing eiusmod adipisicing eu aute tempor deserunt cupidatat ut.
      Sint sunt in qui nisi labore esse culpa eiusmod pariatur.
      Tempor amet qui quis minim nostrud reprehenderit sint culpa adipisicing commodo.
    `,
    videoURL: '',
  },
  {
    title: 'Configuration',
    description: `
      Aute ex laboris id ut in eu non dolore voluptate magna ad nulla occaecat veniam.
      Deserunt ad veniam culpa adipisicing officia nulla duis amet tempor pariatur.
      Ea quis dolore incididunt laboris dolor sunt in eu.
      Cupidatat in duis anim aute quis pariatur sit culpa in.
    `,
    videoURL: '',
  },
  {
    title: 'Viewing Results',
    description: `
      Voluptate excepteur exercitation consequat elit voluptate dolore culpa tempor velit ullamco esse id eu deserunt quis veniam.
      Aute dolor ut ullamco aute nulla in quis amet.
      Cillum ut ex qui nostrud cupidatat aliqua nisi magna consequat labore ullamco quis proident id eu est.
      Quis est commodo magna ea anim officia ut excepteur magna non enim adipisicing est duis.
    `,
    videoURL: '',
  },
]

export const Tutorial = () => {
  const [activeStep, setActiveStep] = useState(0)

  const isFirstStep = activeStep === 0
  const isLastStep = activeStep === steps.length - 1

  const handleClickNext = () => {
    setActiveStep(isLastStep ? activeStep : activeStep + 1)
  }

  const handleClickBack = () => {
    setActiveStep(isFirstStep ? activeStep : activeStep - 1)
  }

  const handleClickStep = step => () => {
    setActiveStep(step)
  }

  return (
    <Card>
      <CardContent>
        <Stepper nonLinear activeStep={ activeStep }>
          {
            steps.map((step, i) => (
              <Step key={ step.title }>
                <StepButton color="inherit" onClick={ handleClickStep(i) }>
                  { step.title }
                </StepButton>
              </Step>
            ))
          }
        </Stepper>
      </CardContent>

      <Divider />

      <CardContent>
        <Typography>
          { steps[activeStep].description }
        </Typography>
      </CardContent>

      <Divider />

      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          disabled={ isFirstStep }
          startIcon={ <BackIcon /> }
          onClick={ handleClickBack }
        >Back</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={ isLastStep }
          endIcon={ <NextIcon /> }
          onClick={ handleClickNext }
        >
          Next
        </Button>
      </Stack>
    </Card>
  )
}