import * as NeuroQuery from './neuroquery'
import * as NeuroBridge from './neurobridge'

export const services = [
  { id: 'nq',     name: 'NeuroQuery',     ...NeuroQuery },
  { id: 'nb',     name: 'NeuroBridge',    ...NeuroBridge },
]
