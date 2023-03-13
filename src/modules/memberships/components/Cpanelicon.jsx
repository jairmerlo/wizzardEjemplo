import { RocketOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"
import { useGetMembershipQuery } from "../../../app/api/backoffice"

export const Cpanelicon = ({ registration_key }) => {

    const { data = {}, isLoading } = useGetMembershipQuery(
        { registration_key },
    )

    console.log({ data })

    const url = `/memberships/login/cpanel/${data.id}`

    return (
        <>
            <Tooltip title='CPanel'>
                <a
                    href={`https://cpanel.idxboost.dev${url}`}
                    target="_blank"
                >
                    <RocketOutlined style={{ fontSize: '18px' }} />
                    CPanel
                </a>
            </Tooltip>
        </>
    )
}
