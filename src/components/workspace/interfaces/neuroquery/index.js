import { Form } from './form'

const ui = {
  id: 'neuroquery',

  displayName: 'NeuroQuery',

  /* help text is processed as markdown */
  helpText: `
This interface allows you to construct a query from the
terms in your workspace to find publications from
[NeuroQuery](https://neuroquery.org/).

Some terms have multiple representations (_e.g._,
"FunctionalMagneticResonanceImaging" and "fMRI" are
two labels for the same term in the ontology), and you
can select which label to use in your NqueoQuery request.
`,

  Form: Form,
}

export default ui
