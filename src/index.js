import "core-js/stable";
import "regenerator-runtime/runtime";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { AppContextProvider } from "./context";
import { DrawerProvider } from "./components/drawer";
import { OntologyProvider } from "./components/ontology";
import { QueryBuilderProvider } from "./components/search/query-builder/context";
import owlFile from "./data/ontology.owl";
import "./styles/index.css";

const ProvisionedApp = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LfCRUUlAAAAAAqgF9ElPFy7mQSZtYZqygD8l6-m"
    >
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
    </GoogleReCaptchaProvider>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<ProvisionedApp />);
