import { Container, Typography } from '@mui/material'
import { Link } from '../components/link'
import { Tutorial } from '../components/tutorial'

//

const queryBuildingSteps = [
  {
    id: 'adding-concepts',
    title: 'Add Concepts',
    description: `
      Officia adipisicing aute excepteur fugiat non ut pariatur pariatur in.
      Consequat excepteur dolor in commodo esse labore exercitation dolor adipisicing eiusmod adipisicing eu aute tempor deserunt cupidatat ut.
      Tempor amet qui quis minim nostrud reprehenderit sint culpa adipisicing commodo.
    `,
  },
  {
    id: 'viewing-query',
    title: 'View Query',
    description: `
      Aute ex laboris id ut in eu non dolore voluptate magna ad nulla occaecat veniam.
      Ea quis dolore incididunt laboris dolor sunt in eu.
      Cupidatat in duis anim aute quis pariatur sit culpa in.
    `,
  },
  {
    id: 'config',
    title: 'Configuration Options',
    description: `
      Voluptate excepteur exercitation consequat elit voluptate dolore culpa tempor velit ullamco esse id eu deserunt quis veniam.
      Quis est commodo magna ea anim officia ut excepteur magna non enim adipisicing est duis.
    `,
  },
  {
    id: 'raw-query',
    title: 'View the Raw Query',
    description: `
      Adipisicing in enim dolor ut incididunt amet dolore elit culpa veniam incididunt velit incididunt consectetur.
      Sunt anim nostrud sed eu aliquip sed ut ullamco reprehenderit.
    `,
  },
  {
    id: 'remove-concepts',
    title: 'Remove Concepts',
    description: `
      Est irure fugiat non deserunt cupidatat eu elit reprehenderit amet laboris cupidatat.
      In pariatur ut ut dolore culpa sit exercitation commodo ea.
    `,
  },
  {
    id: 'submit',
    title: 'Submit Query',
    description: `
      Lorem ipsum sit in occaecat commodo amet nulla ullamco ut ut ut ullamco in ex velit cillum elit.
      Lorem ipsum est ut ullamco culpa labore nisi exercitation velit sit ea eiusmod in aute do culpa et.
    `,
  },
]

const resultsPanelSteps = [
  {
    id: 'overview',
    title: 'Overview',
    description: `
      Labore cillum ad laboris adipisicing deserunt dolor in labore deserunt enim.
      Cillum et ex in ullamco in deserunt ea cupidatat adipisicing.
    `,
  },
]

const ontologyBrowserSteps = [
  {
    id: 'overview',
    title: 'Overview',
    description: `
      Lorem ipsum duis nulla proident ex adipisicing ut esse enim incididunt excepteur.
      Dolor culpa occaecat aute commodo laborum cillum fugiat enim ullamco.
      Lorem ipsum ullamco in culpa eu laborum sunt pariatur sint sint amet ex veniam ex.
    `,
  },
]

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

      <Tutorial
        title="Query Builder"
        description="Lorem ipsum tempor excepteur eu occaecat occaecat aute sed est quis."
        steps={ queryBuildingSteps }
      />

      <br />

      <Tutorial
        title="Results Panel"
        description="Irure in labore quis enim velit adipisicing amet excepteur et."
        steps={ resultsPanelSteps }
      />

      <br />

      <Tutorial
        title="Ontology Browser"
        description="Reprehenderit veniam sed elit officia irure ut deserunt reprehenderit."
        steps={ ontologyBrowserSteps }
      />

      <br />

    </Container>
  )
}
