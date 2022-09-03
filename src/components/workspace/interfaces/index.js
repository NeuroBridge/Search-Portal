import NeuroBridge1 from './neurobridge1'
import NeuroBridge2 from './neurobridge2'
import NeuroQueryInterface from './neuroquery'

export const interfaces = [
  NeuroBridge1,
  NeuroBridge2,
  NeuroQueryInterface,
]

export const interfaceDisplayNames = interfaces
  .reduce((obj, ui) => ({ ...obj, [ui.id]: ui.displayName }), {})
