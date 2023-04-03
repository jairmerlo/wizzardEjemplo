import { Button, Divider, Modal, Typography } from "antd"
import { useGetIdxRequestQuery } from "../../../app/api/backoffice"
import { editRequest } from "../helpers/editRequest"
import { useState } from "react"

export const Request = ({ registration_key, idRequest, open, onClose }) => {

    let boardName = ""

    const [openConfirm, setOpenConfirm] = useState()
    const hanleOpenCofirm = () => setOpenConfirm(true)
    const handleCloseConfirm = () => setOpenConfirm(false)

    const { data = {}, isLoading } = useGetIdxRequestQuery(
        { idRequest },
        {
            skip: !open,
        },
    )

    const {
        membershipId = 0,
        ixd_status = [],
        boards_db = []
    } = data

    let {
        id,
        user_id,
        board,
        product_type,
    } = ixd_status[0] ? ixd_status[0] : { id: "noData", user_id: "noData", board: "noData", product_type: "noData" }

    const username = window.userName ? window.userName : 'admin'

    if (ixd_status.length !== 0) {
        const board = boards_db.filter(board => board.id === ixd_status[0].board)

        boardName = board[0]?.name
    }

    const HandleClick = () => {
        console.log("hello")
        // editRequest({ id, user_id, board, product_type, username })
        // onClose()
    }

    return (
        <>
            <Modal
                title={`Membership: ${membershipId}`}
                open={open}
                okButtonProps={{
                    style: {
                        display: 'none',
                    },
                }}
                cancelButtonProps={{
                    style: {
                        display: 'none',
                    },
                }}
                onCancel={onClose}
                width={800}
                centered
                destroyOnClose
            >
                <Divider />
                {(ixd_status.length !== 0) && (
                    <>
                        <div
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            <Typography.Title level={5} >
                                There Is No Request To Process.
                            </Typography.Title>
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={onClose} >Close</Button>
                        </div>
                    </>

                )}

                {(ixd_status.length === 0) && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            boxShadow: '0 .25rem 1rem rgba(0,0,0,.1)'
                        }}
                    >
                        <Typography.Title
                            level={4}
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                color: 'white',
                                backgroundColor: '#17a2b8',
                                padding: '35px'
                            }}
                        >
                            IDX/MLS Interface Approval Request
                        </Typography.Title>
                        <div
                            style={{
                                padding: '20px'
                            }}
                        >
                            <Typography.Title
                                level={5}
                            >
                                Board Name:
                            </Typography.Title>
                            {/* <Typography.Title
                                level={5}
                            >
                                {boardName}
                            </Typography.Title> */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '16px',
                                    justifyContent: 'flex-end',
                                    paddingTop: '8px',
                                }}
                            >
                                <Button onClick={onClose} >Close</Button>
                                <Button
                                    type='primary'
                                    onClick={hanleOpenCofirm}
                                >
                                    Accept
                                    {openConfirm && (
                                        <Modal
                                            title={`Do you really want to approve?`}
                                            open={openConfirm}
                                            okButtonProps={{
                                                style: {
                                                    display: 'none',
                                                },
                                            }}
                                            cancelButtonProps={{
                                                style: {
                                                    display: 'none',
                                                },
                                            }}
                                            onCancel={handleCloseConfirm}
                                            width={500}
                                            centered
                                            destroyOnClose
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    gap: '16px',
                                                    justifyContent: 'flex-end',
                                                    paddingTop: '8px',
                                                }}
                                            >
                                                <Button onClick={onClose} >Cancel</Button>
                                                <Button
                                                    type='primary'
                                                    onClick={HandleClick}
                                                >
                                                    Ok
                                                </Button>
                                            </div>
                                        </Modal>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}



            </Modal>
        </>
    )
}
