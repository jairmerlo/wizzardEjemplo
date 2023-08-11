import { Modal, Tooltip } from "antd"
import { useState } from "react"
import { useCss } from "react-use"

export const LastActionCell = ({
  date = "",
  status_email = 0,
  status_fub = 0,
  client_name = "",
}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const table = useCss({
    borderRadius: "8px",
    width: "100%",
    overdflowY: "auto",
    border: "1px solid rgba(5, 5, 5, 0.06)",
    "& td": {
      padding: "16px 24px",
      border: "1px solid rgba(5, 5, 5, 0.06)",
      textAlign: "center",
    },
    "& th": {
      padding: "16px 24px",
      border: "1px solid rgba(5, 5, 5, 0.06)",
      backgroundColor: "rgba(0, 0, 0, 0.02)",
      fontWeight: 600,
    },
  })
  return (
    <>
      <button className="buttonLink" onClick={handleOpen}>
        <Tooltip title={date} placement="topLeft">
          <p
            style={{
              whiteSpace: "pre-wrap",
              textAlign: "start",
            }}
          >
            {date}
          </p>
        </Tooltip>
      </button>
      <Modal
        title={`Abandoned Cart Timeline: ${client_name}`}
        open={open}
        //   onOk={handleOk}
        onCancel={handleClose}
        destroyOnClose
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        {date === "" ? (
          "Data is empty"
        ) : (
          <table className={table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Tag Fub</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{date}</td>
                <td>{status_fub === 1 ? "✓" : "X"}</td>
                <td>{status_email === 1 ? "✓" : "X"}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal>
    </>
  )
}
