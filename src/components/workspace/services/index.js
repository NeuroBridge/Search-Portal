import { NeuroQueryServiceInterface } from './neuroquery'
import { NeuroBridgeServiceInterface } from './neurobridge'
import { ForestInterface } from './forest'
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
    id: 'forest',
    name: 'Forest',
    module: ForestInterface,
  },
  {
    id: 'tbd',
    name: 'TBD',
    module: ToBeDeterminedServiceInterface,
  },
]
