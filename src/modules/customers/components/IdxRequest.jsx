import { useGetRequestByregKeyQuery } from "../../../app/api/billing"

export const IdxRequest = ({ registration_key }) => {
    // console.log({ registration_key })
    const data = useGetRequestByregKeyQuery({
        registration_key
    })
    console.log({ data })
    return (
        <div>Hello</div>
    )
}
