export const stringFallback = (text, opts = {}) => {
  const { fallback } = opts
  switch (text) {
    case '':
    case undefined:
    case null:
      return (
        <span
          style={{
            color: 'rgba(0, 0, 0, 0.25)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {fallback || 'No data'}
        </span>
      )
    default:
      return text
  }
}
