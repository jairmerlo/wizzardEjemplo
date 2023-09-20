import { Button, Typography } from "antd"
import { IDXCard, IDXCardContent } from "../../customers/components"
import { useCss } from "react-use"

export const Rocket = () => {
  const button = useCss({
    fontWeight: "600",
    padding: "12px 30px",
    marginLeft: "10px",
    // padding: '7px 20px',
    fontSize: "14px",
    border: "1px solid #e4e4e4",
    borderRadius: "5px",
    minHeight: "50px",
  })

  return (
    <IDXCard style={{ width: "500px", height: "400px" }}>
      <IDXCardContent
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        Rocket
        <Typography.Title level={5}>
          You are one step closer to acquiring the only real state website
          <br />
          you will ever need
        </Typography.Title>
        <Button
          type="primary"
          // onClick={handleSubmit}
          className={button}
          style={{
            backgroundImage: "linear-gradient(to right,#ef3d4e,#ae2865)",
          }}
        >
          FINISH YOUR SETUP
        </Button>
      </IDXCardContent>
    </IDXCard>
  )
}
