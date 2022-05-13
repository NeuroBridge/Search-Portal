import { NeuroQueryServiceInterface } from './neuroquery'
import { ForestInterface } from './neurobridge'
import { ToBeDeterminedServiceInterface } from './tbd'

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
  {
    id: 'tbd',
    name: 'TBD',
    module: ToBeDeterminedServiceInterface,
  },
]
