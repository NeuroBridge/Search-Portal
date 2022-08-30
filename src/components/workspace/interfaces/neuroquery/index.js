import { Interface } from './interface'

const ui = {
  id: 'nq',
  displayName: 'NeuroQuery',
  helpText: 'This is helpful nq text.',
  Interface: Interface,
  request: function exampleRequest() {
    console.log('making nq request...')
  },
}

export default ui
