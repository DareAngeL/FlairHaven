/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Stack } from "react-bootstrap";
import BackIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
import { ImagePlaceHolder } from "../res/Res";
import { useRef } from "react";
import Utility from "../util/Utility";
import { motion } from "framer-motion";
import { useEffect } from "react";

const { updateUserDetails, hasAccess } = require("../Requests").default;

export default function UserDetail() {

    const appContext = useContext(AppContext)
    const user = appContext.user()
    const navigate = useNavigate()

    const [selectedImg, setSelectedImg] = useState(user && user.profilePicture!==''?user.profilePicture:ImagePlaceHolder)
    const [fName, setFName] = useState(user?user.firstName:'')
    const [lName, setlName] = useState(user?user.lastName:'')
    const [suffix, setSuffix] = useState(user?user.suffix:'')
    const [add, setAdd] = useState(user?user.address:'')
    const [phone, setPhone] = useState(user?user.mobileNo:'')
    
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)
    const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
    const [isInfoChanged, setIsInfoChanged] = useState(false)

    useEffect(() => {
        hasAccess(localStorage.getItem('token')).then(hasAccess => {
            if (!hasAccess) {
                navigate('/error')
            }
        })
    }, [])

    const handleCheckChangeInfo = () => {
        let hasChanged = false
        if (fName !== user.firstName) {
            hasChanged = true
            setIsInfoChanged(true)
        }
        if (lName !== user.lastName) {
            hasChanged = true
            setIsInfoChanged(true)
        }
        if (suffix !== user.suffix) {
            hasChanged = true
            setIsInfoChanged(true)
        }
        if (add !== user.address) {
            hasChanged = true
            setIsInfoChanged(true)
        }
        if (phone !== user.mobileNo) {
            hasChanged = true
            setIsInfoChanged(true)
        }

        if (!hasChanged) {
            setIsInfoChanged(false)
        }

        if (selectedImg !== user.profilePicture) {
            setIsInfoChanged(true)
        }
    }

    const handleBackBtn = () => {
        navigate('/')
    }

    const handleUpdateInfoBtn = async () => {
        setIsUpdatingInfo(true)

        const result = await updateUserDetails({
            profilePicture: selectedImg,
            firstName: fName,
            lastName: lName,
            suffix: suffix,
            address: add,
            mobileNo: phone
        }, localStorage.getItem('token'))

        if (result) {
            localStorage.setItem('user', JSON.stringify(result.updatedInfo))
            localStorage.setItem('token', result.access)

            setIsUpdateSuccess(true)
            setIsInfoChanged(false)
            setTimeout(() => {
                setIsUpdateSuccess(false)
            }, 1500);
        }

        setIsUpdatingInfo(false)
    }

    const fileInputRef = useRef(null)
    const handleFileSelect = (e) => {
        // Get the selected file
        const file = e.target.files[0]; //
        
        // resize the file
        Utility.resizeImage(file, (uri) => {
            // on resized complete
            setSelectedImg(uri)
            setIsInfoChanged(true)
        })
    }

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={appContext.pageVariants}
            transition={appContext.pageTransition}
        >
            <div className="d-flex justify-content-center align-items-center">
                <div id={(appContext.isMobileView)?"user-d-container-mobile":"user-d-container"}>
                    <Stack>
                        <div className="user-d-c d-flex pt-2 pb-2">
                            <div onClick={handleBackBtn}>
                                <BackIcon id="user-d-backbtn" className="mx-2"/>
                            </div>
                            <label>Account Information</label>
                        </div>

                        <div className="user-d-c mt-2 p-3 d-flex align-items-center" >
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
                            <div style={{position: 'relative'}}>
                                <Card.Img 
                                    id="add-prod-img" 
                                    className="rounded-5"
                                    src={selectedImg}
                                    onClick={() => { 
                                        fileInputRef.current.click()
                                    }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <label className="ms-3" onClick={() => { 
                                        fileInputRef.current.click()
                                    }}>Add Profile Picture</label>
                        </div>

                        <div className="user-d-c mt-2" >
                            <div className="user-d-inputs-c">
                                <label className="ms-auto">First Name</label>
                                <input className="user-d-inputs" type="name" placeholder="First Name" value={fName}
                                    onChange={(e)=>{
                                        setFName(e.target.value)
                                        handleCheckChangeInfo()
                                    }}
                                    onBlur={handleCheckChangeInfo}
                                />
                            </div>
                            <hr className="user-d-divider"/>
                            <div className="user-d-inputs-c">
                                <label className="ms-auto">Last Name</label>
                                <input className="user-d-inputs" type="name" placeholder="Last Name" value={lName}
                                    onChange={(e)=>{
                                        setlName(e.target.value)
                                        handleCheckChangeInfo()
                                    }}
                                    onBlur={handleCheckChangeInfo}
                                />
                            </div>
                            <hr className="user-d-divider"/>
                            <div className="user-d-inputs-c">
                                <label className="ms-auto">Suffix</label>
                                <input className="user-d-inputs" type="name" placeholder="Not Set" value={suffix}
                                    onChange={(e)=>{
                                        setSuffix(e.target.value)
                                        handleCheckChangeInfo()
                                    }}
                                    onBlur={handleCheckChangeInfo}
                                />
                            </div>
                        </div>

                        <div className="user-d-c mt-2" >
                            <div className="user-d-inputs-c">
                                <label className="ms-auto">Email</label>
                                <input className="user-d-inputs" type="name" placeholder="First Name" value={user?user.email:''} disabled/>
                            </div>
                            <hr className="user-d-divider"/>
                            <div className="user-d-inputs-c">
                                <label className="ms-auto">Address</label>
                                <input className="user-d-inputs" type="name" placeholder="Not Set" value={add}
                                    onChange={(e)=>{
                                        setAdd(e.target.value)
                                        handleCheckChangeInfo()
                                    }}
                                    onBlur={handleCheckChangeInfo}
                                />
                            </div>
                            <hr className="user-d-divider"/>
                            <div className="user-d-inputs-c">
                                <label className="ms-auto">Mobile Number</label>
                                <input className="user-d-inputs" type="name" placeholder="Not Set" value={phone}
                                    onChange={(e)=>{
                                        setPhone(e.target.value)
                                        handleCheckChangeInfo()
                                    }}
                                    onBlur={handleCheckChangeInfo}
                                />
                            </div>
                            <hr className="user-d-divider"/>
                            <div className="user-d-inputs-c">
                                <label className="ms-auto">Member Since</label>
                                <input className="user-d-inputs" type="name" placeholder="Date" value={user?user.memberDate:''} disabled/>
                            </div>
                        </div>
                        {(isInfoChanged) ? 
                            <Button id="user-d-updatebtn" className="mt-3 border-0" onClick={handleUpdateInfoBtn}>Update Account Information</Button>
                            :
                            <Button id="user-d-updatebtn" className="mt-3 border-0" disabled>Update Account Information</Button>
                        }
                    </Stack>
                </div>
                {(isUpdatingInfo) ?
                    <div className="loading">
                        <Stack className="d-flex justify-content-center align-items-center h-100">
                            <CircularProgress/>
                            <label>Updating user details</label>
                        </Stack>
                    </div>
                    :
                    <></>
                }
                {(isUpdateSuccess) ?
                    <Alert 
                        severity="success"
                        style={{
                            position: 'fixed',
                            bottom: '10px',
                            right: 0
                        }}
                    >Information Updated!</Alert>
                    :
                    <></>
                }
            </div>
        </motion.div>
    )
}