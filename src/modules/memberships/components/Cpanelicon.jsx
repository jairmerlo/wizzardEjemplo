import { RocketOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"

export const Cpanelicon = () => {
    return (
        <>
            <Tooltip title='CPanel'>
                <a
                    href="https://cpanel.idxboost.dev/windows_notifications"
                    target="_blank"
                >
                    <RocketOutlined style={{ fontSize: '18px' }} />
                    CPanel
                </a>
            </Tooltip>
        </>
    )
}
