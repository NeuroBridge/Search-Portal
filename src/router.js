import { Router as ReachRouter } from '@reach/router'
import { ContactView, HomeView, NotFoundView, SearchView } from './views'

export const Router = () => {
  return (
    <ReachRouter>
      <HomeView exact path="/" />
      <SearchView exact path="/search" />
      <ContactView exact path="/contact" />
      <NotFoundView default />
    </ReachRouter>
  )
}