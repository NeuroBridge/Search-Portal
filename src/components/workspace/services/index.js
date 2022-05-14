import { Interface as NeuroQueryServiceInterface } from './neuroquery'
import { ForestInterface } from './neurobridge'

export const services = [
  {
    id: 'nq',
    name: 'NeuroQuery',
    module: NeuroQueryServiceInterface,
  },
  {
    id: 'nb',
    name: 'NeuroBridge',
    module: ForestInterface,
  },
]
