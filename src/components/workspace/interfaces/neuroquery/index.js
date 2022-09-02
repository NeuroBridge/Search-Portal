import { Form } from './form'

const ui = {
  id: 'nq',
  displayName: 'NeuroQuery',
  helpText: 'This is helpful nq text.',
  Form: Form,
  request: function exampleRequest() {
    console.log('making nq request...')
  },
}

export default ui
