import { NeuroQueryServiceInterface } from './neuroquery'
import { NeuroBridgeServiceInterface } from './neurobridge'
import { NeuroBridge2ServiceInterface } from './neurobridge2'
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
    module: NeuroBridgeServiceInterface,
  },
  {
    id: 'nb2',
    name: 'NeuroBridge2',
    module: NeuroBridge2ServiceInterface,
  },
  {
    id: 'tbd',
    name: 'TBD',
    module: ToBeDeterminedServiceInterface,
  },
]
