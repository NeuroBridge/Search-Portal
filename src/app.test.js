import { render, screen } from '@testing-library/react'
import { App } from './App'

test('renders NeuroBridge brand', () => {
  render(<App />)
  const brandElement = screen.getByRole('banner')
  expect(brandElement).toBeInTheDocument()
})
