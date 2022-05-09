import { NeuroQueryServiceInterface } from './neuroquery'
import { NeuroBridgeServiceInterface } from './neurobridge'

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
]
