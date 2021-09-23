import { Router as ReachRouter } from '@reach/router'
import { ContactView, NotFoundView, SearchView } from './views'

export const Router = () => {
  return (
    <ReachRouter>
      <SearchView exact path="/" />
      <ContactView exact path="/contact" />
      <NotFoundView default />
    </ReachRouter>
  )
}