import { Router as ReachRouter } from '@reach/router'
import { SearchView } from './views'

export const Router = () => {
  return (
    <ReachRouter>
      <SearchView path="/" />
    </ReachRouter>
  )
}