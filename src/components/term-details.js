export const TermDetails = ({ term }) => {
  return (
    <pre style={{ fontSize: '80%' }}>
      { JSON.stringify(term, null, 2) }
    </pre>
  )
}