
import * as NeuroBridge from './neurobridge'
import * as NeuroQuery from './neuroquery'
import * as NeuroBridge2 from './neurobridge2'

export const services = [
  { id: 'nq',     name: 'NeuroQuery',     ...NeuroQuery },
  { id: 'nb',     name: 'NeuroBridge',    ...NeuroBridge },
  { id: 'nb2',    name: 'NeuroBridge2',   ...NeuroBridge2 },
]

/*
  Adding new interfaces is easy!
  Contain all code for an interface in its own directory.
  The default import should look like { Interface, HelpText },
  where Interface and HelpText are React components.

  Your interface will have access to the application state
  and helper functions therein. The following contexts
  currently exist: Basket, Drawer, Ontology, and Workspace.
  Additionally, the MUI React component library is
  available to match styles of the overall application.
*/
