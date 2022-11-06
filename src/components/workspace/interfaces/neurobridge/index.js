import { QueryForm } from './query-form'

const ui = {
  id: 'neurobridge',

  displayName: 'NeuroBridge',

  /* help text is processed as markdown */
  helpText:
`This interface allows you to construct a query to retrieve publications from the NeuroBridge API.
This query is constructed from the terms in your workspace.

Each term in your workspace defines a tree here from which to build your query.

Clicking the bullet in front of a term toggles that term's representation in the query.
Each term has one of the following states:

- not in the query,
- in the query, or
- in the query, negated (_e.g._, \`NOT Schizophrenia\`).

CTRL/⌘ + click will also toggle the clicked term's descendants' states to match that of the clicked term.

Using the configuration options (found in the top-right of this interface),
you have the option of joining trees with either \`AND\` or \`OR \` by selecting the "between concept trees" operator.
Similarly, you can select the "within concept trees" operator, which will join selected terms within the same tree.
The effect of these selections on the query are apparent when viewing the raw query.`,

  Form: QueryForm,
}

export default ui
