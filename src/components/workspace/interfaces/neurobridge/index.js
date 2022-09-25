import { Form } from './form'

const ui = {
  id: 'neurobridge',

  displayName: 'NeuroBridge',

  /* help text is processed as markdown */
  helpText: `
This interface allows you to construct a NeuroBridge query
from the terms in your workspace.

Each visible term in your workspace defines a tree in this interface from
which to build your query. You have the option of joining trees with the
\`AND\` or \`OR \` operators &mdash; the "outer operator". Similarly, you
can select the "inner operator" between terms selected within the same tree.

Clicking the bullet in front of a term toggles that
term's presence in the query. Each term is one of the following:

- not in the query,
- in the query, or
- in the query, but negated (_e.g._, \`NOT Schizophrenia\`).

Holding Control/Command while clicking will also toggle the term's
descendants' states to match that of the clicked term.
`,
  Form: Form,
}

export default ui
