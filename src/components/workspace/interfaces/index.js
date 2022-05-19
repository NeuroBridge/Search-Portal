import * as NeuroBridge from './neurobridge'
import * as NeuroQuery from './neuroquery'
import * as NeuroBridge2 from './neurobridge2'

export const interfaces = [
  { id: 'nq',     name: 'NeuroQuery',     ...NeuroQuery },
  { id: 'nb',     name: 'NeuroBridge',    ...NeuroBridge },
  { id: 'nb2',    name: 'NeuroBridge2',   ...NeuroBridge2 },
]

/*
  Adding new interfaces is easy!
  Contain all code for an interface in its own directory.
  The default import should look like { Interface, HelpText },
  where Interface and HelpText are React components.

  It is required to wrap the logic of the function that
  fetches results in `searchWrapper`, which is passed as a prop
  to each interface component. For example,

  const fetchResults = () => {
    searchWrapper(async () => {
      const response = await axios.get(URL)
      // ...
    })
  }

  This will handle orchestrating the interface logic alongside
  the application machinery.

  Your interface will have access to the application state
  and helper functions therein. The following contexts
  currently exist: Basket, Drawer, Ontology, and Workspace.
  Additionally, the MUI React component library is
  available to match styles of the overall application.
*/
