import { render } from 'react-dom'
import { App } from './app'
import { BasketProvider } from './components/basket'
import { DrawerProvider } from './components/drawer'
import { OntologyProvider } from './components/ontology'
import owlFile from './data/NeuroBridge_093021.owl'
import './styles/index.scss'

const ProvisionedApp = () => {
  return (
    <OntologyProvider owlFile={ owlFile }>
      <BasketProvider>
        <DrawerProvider>
          <App />
        </DrawerProvider>
      </BasketProvider>
    </OntologyProvider>
  )
}

render(<ProvisionedApp />, document.getElementById('root'))
