import { Form } from './form'

const ui = {
  id: 'neuroquery',

  displayName: 'NeuroQuery',

  /* help text is processed as markdown */
  helpText: `
This interface allows you to construct a query to retrieve publications from [NeuroQuery](https://neuroquery.org/).
This query is constructed from the terms in your workspace

Some terms have multiple representations (_e.g._,
"FunctionalMagneticResonanceImaging" and "fMRI" are
two labels for the same term in the ontology), and you
can select which label to be used in the request.
`,

  Form: Form,
}

export default ui
