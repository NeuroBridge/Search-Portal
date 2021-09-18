import { Router as ReachRouter } from '@reach/router'
import { HomeView, NotFoundView, SearchView } from './views'

export const Router = () => {
  return (
    <ReachRouter>
      <SearchView exact path="/search" />
      <HomeView exact path="/" />
      <NotFoundView default />
    </ReachRouter>
  )
}