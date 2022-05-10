import { NeuroQueryServiceInterface } from './neuroquery'
import { NeuroBridgeServiceInterface } from './neurobridge'
import { ToBeDeterminedServiceInterface } from './tba'

export const services = [
  {
    id: 'nq',
    name: 'NeuroQuery',
    module: <NeuroQueryServiceInterface />,
  },
  {
    id: 'nb',
    name: 'NeuroBridge',
    module: <NeuroBridgeServiceInterface />,
  },
  {
    id: 'tbd',
    name: 'TBD',
    module: <ToBeDeterminedServiceInterface />,
  },
]
