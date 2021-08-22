export const TermDetails = ({ term }) => {
  return (
    <pre style={{ fontSize: '80%', padding: '1rem', overflow: 'hidden' }}>
      { JSON.stringify(term, null, 2) }
    </pre>
  )
}