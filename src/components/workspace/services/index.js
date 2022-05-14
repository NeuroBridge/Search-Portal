import * as NQ from './neuroquery'
import * as NB from './neurobridge'

export const services = [
  {
    id: 'nq',
    name: 'NeuroQuery',
    Interface: NQ.Interface,
    HelpText: NQ.HelpText,
  },
  {
    id: 'nb',
    name: 'NeuroBridge',
    Interface: NB.Interface,
    HelpText: NB.HelpText,
  },
]
