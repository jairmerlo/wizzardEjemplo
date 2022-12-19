export const stringFallback = text => {
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
          No data
        </span>
      )
    default:
      return text
  }
}
