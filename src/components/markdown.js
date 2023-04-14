import { Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from './link'

// this object defines a map:
//    DOM elements --> React components.
// this allows us to streamline styles for content coming
// from Strapi with that of content built here by Nextjs.

const componentMap = {
  // for links, we'll use our smart link component.
  a: ({ href, ...props }) => (
    <Link to={ href } { ...props } />
  ),
  p: ({ children, ...props }) => (
    <Typography paragraph { ...props }>{ children }</Typography>
  ),
  code: ({ children, ...props }) => (
    <Typography paragraph { ...props }>{ children }</Typography>
  )
}

export const Markdown = props => {
  return (
    <ReactMarkdown
      { ...props }
      components={ componentMap }
      remarkPlugins={ [remarkGfm] }
    />
  )
}
