import { Button, Divider, Modal, Typography, notification } from "antd"
import { useGetIdxRequestQuery } from "../../../app/api/backoffice"
import { editRequest } from "../helpers/editRequest"
import { useState } from "react"
import '../../../icons/style.css'

export const Request = ({ registration_key, idRequest, open, onClose }) => {

    console.log({ idRequest })

    let boardName = ""

    const [openConfirm, setOpenConfirm] = useState()
    const hanleOpenCofirm = () => setOpenConfirm(true)
    const handleCloseConfirm = () => setOpenConfirm(false)

    const [rocket, setRocket] = useState(false)
    const RocketOpen = () => setRocket(true)
    const RocketClose = () => setRocket(false)

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

    const HandleClick = async () => {
        console.log("hello")
        RocketOpen()
        setTimeout(() => {
            RocketClose()
            onClose()
            notification.success({
                message: `The request was send succesfully.`,
                placement: 'bottomRight',
                // description: '',
            })
        }, 2000);
        editRequest({ id, user_id, board, product_type, username })
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
                {(ixd_status.length === 0) && (
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

                {(ixd_status.length !== 0) && (
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
                            <Typography.Title
                                level={5}
                            >
                                {boardName}
                            </Typography.Title>
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
                                                    {rocket && (
                                                        <div className="ms-modal-lg">
                                                            <div className="ms-modal-wrapper">
                                                                <div className="ms-loader">
                                                                    <div className="ms-wrapper-loader">
                                                                        <span style={{ "--i": 1 }}></span>
                                                                        <span style={{ "--i": 2 }}></span>
                                                                        <span style={{ "--i": 3 }}></span>
                                                                        <span style={{ "--i": 4 }}></span>
                                                                        <span style={{ "--i": 5 }}></span>
                                                                        <span style={{ "--i": 6 }}></span>
                                                                        <span style={{ "--i": 7 }}></span>
                                                                        <span style={{ "--i": 8 }}></span>
                                                                        <span style={{ "--i": 9 }}></span>
                                                                        <span style={{ "--i": 10 }}></span>
                                                                        <span style={{ "--i": 11 }}></span>
                                                                        <span style={{ "--i": 12 }}></span>
                                                                        <span style={{ "--i": 13 }}></span>
                                                                        <span style={{ "--i": 14 }}></span>
                                                                        <span style={{ "--i": 15 }}></span>
                                                                        <span style={{ "--i": 16 }}></span>
                                                                        <span style={{ "--i": 17 }}></span>
                                                                        <span style={{ "--i": 18 }}></span>
                                                                        <span style={{ "--i": 19 }}></span>
                                                                        <span style={{ "--i": 20 }}></span>
                                                                        <div className="ms-rocket-loader">
                                                                            <i className="back-office-rocket"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span className="ms-title">Please wait, the process may take a while</span>
                                                            </div>
                                                        </div>
                                                    )}
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
