
import * as NeuroBridge from './neurobridge'
import * as NeuroQuery from './neuroquery'
import * as NeuroBridge2 from './neurobridge2'

export const services = [
  { id: 'nq',     name: 'NeuroQuery',     ...NeuroQuery },
  { id: 'nb',     name: 'NeuroBridge',    ...NeuroBridge },
  { id: 'nb2',    name: 'NeuroBridge2',   ...NeuroBridge2 },
]
