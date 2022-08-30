import { Form } from './form'

const ui = {
  id: 'example',
  displayName: 'Example Interface',
  helpText: 'This is helpful example text.',
  Interface: Form,
  request: function exampleRequest() {
    console.log('making example request...')
  },
}

export default ui
