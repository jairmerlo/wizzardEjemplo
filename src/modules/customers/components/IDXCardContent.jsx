export const IDXCardContent = ({ children, ...props }) => {
  return (
    <div {...props} style={{ padding: 20, width: '100%', ...props.style }}>
      {children}
    </div>
  )
}
