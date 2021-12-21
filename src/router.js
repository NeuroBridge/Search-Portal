import { Router as ReachRouter } from '@reach/router'
import { NotFoundView, SearchView, SelectView } from './views'

export const Router = () => {
  return (
    <ReachRouter>
      <SearchView exact path="/" />
      <SelectView exact path="/select" />
      <NotFoundView default />
    </ReachRouter>
  )
}