export const TermDetails = ({ term, style }) => {
  return (
    <pre style={{ fontSize: '80%', padding: '1rem', margin: 0, overflow: 'hidden', backgroundColor: '#eee', borderRadius: '4px', color: '#333', ...style }}>
      { JSON.stringify(term, null, 2) }
    </pre>
  )
}