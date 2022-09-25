import NeuroBridgeInterface from './neurobridge'
import NeuroQueryInterface from './neuroquery'

export const interfaces = [
  NeuroBridgeInterface,
  NeuroQueryInterface,
]

export const interfaceDisplayNames = interfaces
  .reduce((obj, ui) => ({ ...obj, [ui.id]: ui.displayName }), {})
