import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

export const useAnalytics = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
        ReactGA.initialize("G-LXB97QEKGC");
    // if (!window.location.href.includes("localhost")) {
    // }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
        ReactGA.send({ hitType: "pageview", page: "/my-path", title: "Custom Title" });
    }
  }, [initialized, location]);
};
