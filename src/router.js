import { Router as ReachRouter } from '@reach/router'
import { NotFoundView, SearchView } from './views'

export const Router = () => {
  return (
    <ReachRouter>
      <SearchView exact path="/" />
      <NotFoundView default />
    </ReachRouter>
  )
}