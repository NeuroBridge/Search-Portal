import { Fragment } from 'react'
import { useSearchContext } from '../components/search/context'

export const SelectView = () => {
  const { selectedTerms } = useSearchContext()

  return (
    <Fragment>
      {
        Object.keys(selectedTerms).map(term => (
          <h2 key={ term }>{ term }</h2>
        ))
      }
    </Fragment>
  )
}