import { Container, List, ListItem, ListItemText, Typography } from '@mui/material'
import { Link } from '../components/link'
import { Tutorial } from '../components/tutorial'

//

const guide = {
  /* QUERY BUILDER */
  queryBuilding: {
    title: 'Query Builder',
    description: 'The Query Builder is used to build a query from concepts in the NeuroBridge ontology.',
    steps: [
      {
        id: 'overview',
        title: 'Overview',
        description: `
The Query Builder is the location where your query gets constructed.
With concepts from the NeuroBridge ontology, you may customize a query to find publications
related to the concepts in your query.

An important note is that our search isn't merely a lexical search; it's more of a semantic search.
A machine learning model support the search portal by making sense of the ontological relationships
among the concepts in your query. Read more below to learn how to construct your query.

Read more about the machinery backing this search [on our About page](/about).
        `,
      },
      {
        id: 'adding-concepts',
        title: 'Add Concepts',
        description: `
The first step to building a query is to add concepts to the query builder.
Each concept defines an induced subtree rooted at that concept.
Adding a concept to the query builder makes its descendant concepts available for use in the query.

To add a concept to the query builder:
- Click the "ADD CONCEPT" button.
- The "Add Concept" window will display. Start typing the word or phrase you want to search; for example, "schizophrenia".
- Matching concepts in the ontology are filtered as you type.
- Select a concept in the candidate list that appears below the search bar, which closes the "Add Concept" window,
and the selected concept will be available in the Query Builder.

Note that the selected term is in the Query Builder, along with its descendant concepts.
With the caret button, expand and collapse a concept to view its descendants.
        `,
      },
      {
        id: 'toggling',
        title: 'Toggling Concepts',
        description: `
Each concept in the Query Builder can have one of two states&mdash;either it is in the query or it is not.
Clicking a concept toggles between the two states, and an icon indicates the concept's present state.
Note that "green" means the results must include this concept, "red" means the results must not include this concept.
Additionally, changing the state of a concept also changes the states of its descendant concepts to match.
        `,
      },
      {
        id: 'viewing-query',
        title: 'View Query',
        description: `
Use the "VIEW QUERY/HIDE QUERY" button to toggle visibility of the raw query that will be used for your search.
This may be useful to visually inspect the query before making your request.
        `,
      },
      {
        id: 'config',
        title: 'Configuration',
        description: `
If there are two or more concepts in the built query, you can change the boolean logic between the concept trees by using the "OPTIONS" button.
        `,
      },
      {
        id: 'remove-concepts',
        title: 'Remove Concepts',
        description: `
A concept can be removed from the Query Builder using the Delete action, indicated with the trashcan icon,
located to the right of each concept. Only parent concepts can be removed; that is, you cannot delete a descendant of a concept. 

To remove all concepts in a query, click "RESET".
        `,
      },
      {
        id: 'submit',
        title: 'Submit Query',
        description: `
The final step is to submit your query.
Click "SEARCH" to intitiate your search.
Results will appear in the Results Panel below the Query Builder.
        `,
      },
    ],
  },

  /* RESULTS PANEL */
  resultsPanel: {
    title: 'Results Panel',
    description: 'After submitting a query, its results are displayed in separate tabs based on their data sources. Results are retrieved from two sources: PubMed Central and via our API, NeuroQuery, and contain links to the corresponding articles.',
    steps: [
      {
        id: 'display',
        title: 'The Results Table',
        description: `
After submitting a query, its results are displayed in a table,
separated according to their source&mdash;PubMed or PubMed Central.
Publication are presented as rows in the table, each with links to the publication's abstract and full-text.
        `,
      },
      {
        id: 'inspect',
        title: 'Inspecting Results',
        description: `
Results can be viewed in detail by clicking on the corresponding row,
which opens a detail panel with metadata about the publication.
Authors, journal, publication date, and links to the abstract and full-text PubMed pages.
We also present the DOI for a quick direct link to the source.
The abstract and relevant ontology concepts are also presented for convenience.
        `,
      },
      {
        id: 'export',
        title: 'Exporting Results',
        description: `
    Multiple rows can be selected for export.
    Click the "EXPORT" button to export the currently visible columns for each selected result in CSV format.
        `,
      },
    ],
  },

  /* ONTOLOGY BROWSER */
  ontologyBrowser: {
    title: 'Ontology Browser',
    description: 'Reprehenderit veniam sed elit officia irure ut deserunt reprehenderit.',
    steps: [
      {
        id: 'overview',
        title: 'Overview',
        description: `
The Ontology Browser provides a way for the user to navigate around the NeuroBridge ontology freely,
one-edge-at-a-time. This may help determine relationships between concepts and provide context to help
determine the most appropriate concepts for your query.
        `,
      },
      {
        id: 'access',
        title: 'Accessing the Browser',
        description: `
The Ontology Browser is always available for viewing by clicking the (>) button in the top-right of the interface.
Additionally, whenever a term appears on the interface, it is accompanied by the same button to jump to that concept's
location in the ontology.
        `,
      },
    ],
  },
}

//

export const DocumentationView = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1">Using the Search Portal</Typography>

      <br />

      <Typography paragraph>
        This interface allows users to construct a query with concepts in the NeuroBridge ontology.
        The query mechanism makes use of the ontological relationships to find publications in
        two sources: <Link to="https://www.ncbi.nlm.nih.gov/pmc/">PubMed Central</Link>, via our API,
        and <Link to="https://neuroquery.org/">NeuroQuery</Link>.
      </Typography>

      <Typography paragraph>
        The Search Portal is made up of three main areas:
      </Typography>

      <List>
        <ListItem>
          <ListItemText
            primary="1. The Query Builder"
            secondary="Used to construct a query from concepts in the NeuroBridge ontology"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="2. The Results Panel"
            secondary="Results of your query are displayed here"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="3. The Ontology Browser"
            secondary="Used to freely navigate the concepts in the NeuroBridge ontology"
          />
        </ListItem>
      </List>

      {
        Object.keys(guide).map(key => {
          const { title, description, steps } = guide[key]
          return (
            <Tutorial
              key={ title }
              title={ title }
              description={ description }
              steps={ steps }
            />
          )
        })
      }

    </Container>
  )
}
