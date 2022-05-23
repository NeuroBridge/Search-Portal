import "core-js/stable"
import "regenerator-runtime/runtime"
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app'
import { BasketProvider } from './components/basket'
import { DrawerProvider } from './components/drawer'
import { OntologyProvider } from './components/ontology'
import owlFile from './data/NeuroBridge_093021.owl'
import './styles/index.scss'

const ProvisionedApp = () => {
  return (
    <BrowserRouter>
      <OntologyProvider owlFile={ owlFile }>
        <BasketProvider>
          <DrawerProvider>
            <App />
          </DrawerProvider>
        </BasketProvider>
      </OntologyProvider>
    </BrowserRouter>
  )
}

render(<ProvisionedApp />, document.getElementById('root'))
