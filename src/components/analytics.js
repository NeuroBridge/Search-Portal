import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

const DISABLE_IN_DEV = true

export const useAnalytics = () => {
  const location = useLocation()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (DISABLE_IN_DEV && process.env.NODE_ENV === 'development') {
      return
    }
    ReactGA.initialize('G-LXB97QEKGC')
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (initialized) {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname,
        title: location.pathname,
      })
    }
  }, [initialized, location])
}