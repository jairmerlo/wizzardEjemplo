export const IDXCard = ({ children, ...props }) => {
  return (
    <div
      {...props}
      style={{
        border: '1px solid #e1e8ed',
        borderRadius: 6,
        backgroundColor: '#fff',
        boxShadow: '0px 2px 4px 5px rgba(31, 30, 47, 0.03)',
        margin: 10,
        ...props.style,
      }}
    >
      {children}
    </div>
  )
}
