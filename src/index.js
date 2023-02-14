import "core-js/stable";
import "regenerator-runtime/runtime";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import { AppContextProvider } from "./context";
import { DrawerProvider } from "./components/drawer";
import { OntologyProvider } from "./components/ontology";
import { QueryBuilderProvider } from "./components/search/query-builder/context";
import owlFile from "./data/ontology.owl";
import "./styles/index.css";

const ProvisionedApp = () => {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <OntologyProvider owlFile={owlFile}>
          <DrawerProvider>
            <QueryBuilderProvider>
              <App />
            </QueryBuilderProvider>
          </DrawerProvider>
        </OntologyProvider>
      </BrowserRouter>
    </AppContextProvider>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<ProvisionedApp />);
