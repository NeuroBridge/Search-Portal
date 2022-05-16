
import * as NeuroBridge from './xiaochen'
import * as NeuroQuery from './neuroquery'
import * as NeuroBridge2 from './neurobridge'

export const services = [
  { id: 'nq',     name: 'NeuroQuery',     ...NeuroQuery },
  { id: 'nb',     name: 'NeuroBridge',    ...NeuroBridge },
  { id: 'nb2',    name: 'NeuroBridge2',   ...NeuroBridge2 },
]
