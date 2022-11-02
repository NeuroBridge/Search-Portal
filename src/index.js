import "core-js/stable"
import "regenerator-runtime/runtime"
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app'
import { BasketProvider } from './components/basket'
import { DrawerProvider } from './components/drawer'
import { OntologyProvider } from './components/ontology'
import owlFile from './data/ontology.owl'
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

const root = createRoot(document.getElementById('root'))

root.render(<ProvisionedApp />)
