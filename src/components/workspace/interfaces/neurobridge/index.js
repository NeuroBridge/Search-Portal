import { Form } from './form'

const ui = {
  id: 'neurobridge',

  displayName: 'NeuroBridge',

  /* help text is processed as markdown */
  helpText:
`This interface allows you to construct a NeuroBridge query
from the terms in your workspace.

Each visible term in your workspace defines a tree in this interface from
which to build your query.

Clicking the bullet in front of a term toggles that
term's presence in the query. Each term is one of the following:

- not in the query,
- in the query, or
- in the query, but negated (_e.g._, \`NOT Schizophrenia\`).

Holding Control/Command while clicking will also toggle the term's
descendants' states to match that of the clicked term.

Using the configuration area at the bottom of
this interface, you have the option of joining trees with either
\`AND\` or \`OR \` by selecting the desired "between concept trees" operator.
Similarly, you can select the "within concept trees" operator, which will join
selected terms within the same tree.

Additionally, you can view the raw query that will be sent to NeuroBridge.`,

  Form: Form,
}

export default ui
