import { FileWordOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"

export const Wordpressicon = () => {
    return (
        <>
            <Tooltip title='Wordpress'>
                <a
                // onClick={handleOpen}
                >
                    <FileWordOutlined style={{ fontSize: '18px' }} />
                    Wordpress
                </a>
            </Tooltip>
        </>
    )
}
