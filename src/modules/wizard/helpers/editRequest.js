import { API } from "../../../api";

export const editRequest = async ({ id, user_id, board, product_type, username, action }) => {
    const data = await fetch(`${API._BACKOFFICE}/memberships/v2/aprove/${id}/${user_id}/${board}/${product_type}/${username}/${action}`, {
        method: 'POST'
    }).then(res => res.json())
    console.log({ data })
    return data
}