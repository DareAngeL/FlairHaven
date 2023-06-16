import { Stack } from "react-bootstrap";
import { ImagePlaceHolder } from "../res/Res";
import { Link, useNavigate } from "react-router-dom";
import ProfileIcon from '@mui/icons-material/FaceRounded';
import SnackBarAlert from "../components/SnackBarAlert";
import { useState } from "react";

export default function ProfileMenu(data) {

    const {
        user,
        onLoginClick,
        onSignOut,
        style,
        containerRef,
        onClose=()=>{},
    } = data

    const navigate = useNavigate()

    const profPic = user !== null && user.profilePicture !== '' ? user.profilePicture : ImagePlaceHolder
    const userName = user !== null ? `${user.firstName} ${user.lastName} ${user.suffix}`.trim() : ''
    const memberSince = user !== null ? new Date(user.memberDate).getFullYear()  : ''
    const isDesigner = user !== null ? user.isDesigner : false

    const handleSignOut = () => {
        onSignOut()
        localStorage.clear()
        navigate('/')
        onClose()
    }

    return (
        <div ref={containerRef} className="open-prof-menu-dropdown d-flex" style={style}>
            <div style={{
                border: 0,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
                width: '50px',
                height: '30px',
                borderTopLeftRadius: '30px',
                borderBottomLeftRadius: '30px'
            }}/>
            <div style={{
                width: '220px',
                height: 'auto',
                border: 0,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
                background: '#f0f2f5',
                borderTopRightRadius: '10px',
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
            }}>
                {
                    (user) ?
                        <>
                            <div className="d-flex">
                                <img className="ms-3 mt-2"  width={40} height={40} src={profPic} alt="prof-pic"/>
                                <Stack className="ms-2">
                                    <label className="d-flex">{userName}</label>
                                    <label
                                        className="d-flex text-start"
                                        style={{
                                            fontSize: '12px'
                                        }}
                                    >
                                        Member Since: {memberSince}
                                    </label>
                                    {(isDesigner) ?
                                        <label
                                            className="primary-color d-flex text-start"
                                            style={{
                                                fontSize: '12px'
                                            }}
                                        >
                                            Seller Account
                                        </label>
                                        :
                                        <></>
                                    }
                                </Stack>
                            </div>
                            <hr className="mx-3 mb-2 mt-2"/>
                            {/* item 1 */}
                            <div className="d-flex justify-content-center">
                                <Link to="/user_detail">
                                    <label style={{
                                        fontSize: '14px'
                                    }}>Account Information</label>
                                </Link>
                            </div>
                            <hr className="mx-3 mb-2 mt-2"/>
                            {/* item 2 */}
                            {user.isDesigner?
                                <div className="d-flex justify-content-center">
                                    <Link to="/dashboard">
                                        <label style={{
                                            fontSize: '14px'
                                        }}>Go to Dashboard</label>
                                    </Link>
                                </div>
                                :
                                <div className="d-flex justify-content-center">
                                    <Link to={`/seller_intro`}>
                                        <label style={{
                                            fontSize: '14px'
                                        }}>Sell your Digital Art!</label>
                                    </Link>
                                </div>
                            }
                            <hr className="mx-3 mb-2 mt-2"/>
                            {/* item 3 */}
                            <div className="mb-3 d-flex justify-content-center">
                                <Link to="/" onClick={handleSignOut}>
                                    <label style={{
                                        fontSize: '14px'
                                    }}>Sign out</label>
                                </Link>
                            </div>
                        </>
                    :
                        <div>
                            <div className="d-flex align-items-center ps-3 pt-2">
                                <ProfileIcon style={{
                                    color: 'rgb(64, 81, 238)'
                                }}/>
                                <label className="d-flex ms-2">Guest Account</label>
                            </div>
                            <Link onClick={onLoginClick} className="d-flex justify-content-center" style={{textDecoration: 'none'}}>
                                <label className="profmenu-lbl mt-3" style={{
                                    fontSize: '14px',
                                }}>Login</label>
                            </Link>
                            <hr className="mx-3 mb-2 mt-2"/>
                            <Link to="/register" className="d-flex justify-content-center" style={{textDecoration: 'none'}}>
                                <label className="profmenu-lbl" style={{
                                    fontSize: '14px'
                                }}>Register</label>
                            </Link>
                            <hr className="mx-3 mb-2 mt-2 d-flex justify-content-center" style={{textDecoration: 'none'}}/>
                            <Link to="/about">
                                <label className="profmenu-lbl mb-3" style={{
                                    fontSize: '14px'
                                }}>About</label>
                            </Link>
                        </div>
                }
            </div>
        </div>
    )
}