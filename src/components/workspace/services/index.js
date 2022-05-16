import * as NQ from './neuroquery'
import * as NB from './neurobridge'
import * as XW from './xiaochen'

export const services = [
  {
    id: 'nq',
    name: 'NeuroQuery',
    Interface: NQ.Interface,
    HelpText: NQ.HelpText,
  },
  {
    id: 'xw',
    name: 'Xiaochen',
    Interface: XW.Interface,
    HelpText: XW.HelpText,
  },
  {
    id: 'nb',
    name: 'NeuroBridge',
    Interface: NB.Interface,
    HelpText: NB.HelpText,
  },
]
