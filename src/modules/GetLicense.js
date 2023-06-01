import { Button, Col, Row, Stack } from "react-bootstrap";
import { Alert, Backdrop, Rating, Tooltip } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useState } from "react";
import { useEffect } from "react";
import Description from "../components/Description";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../AppContext";

export default function GetLicense(props) {

    const navigate = useNavigate()
    const appContext = useContext(AppContext)
    const user = appContext.user()
    const isMobile = appContext.isMobileView

    const [_open, setOpen] = useState(false)

    const { 
        product, 
        onClose, 
        open=false,
    } = props

    let isOwner = false
    if (user) {
        isOwner = user._id === product.userId
    }

    useEffect(() => {
        setOpen(open)
    }, [open])

    const handleOnBuyBtnClick = () => {
        navigate(`/checkout/fromCart/false/${product._id}`)
    }

    return (
        (_open)?
            <Backdrop
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: 'rgba(255, 255, 255, 0.8)'
                }}
                open={open}
            >
                <div id="g-l-container">
                    <Stack id={(isMobile)?"g-l-root-mobile":"g-l-root"} className={(_open)?"cart-open":""}>
                        <div className="p-2 d-flex align-items-center">
                            <h4>Get A License</h4>
                            <div className="ms-auto" onClick={onClose}>
                                <CloseIcon id="g-l-close"/>
                            </div>
                        </div>
                        <hr className="h-divider"/>
                        <Row className="w-100 p-2">
                            <Col md="5" sm="12" className="d-flex justify-content-center">
                                <img id="g-l-img" className="img-fluid rounded-3" src={product.imageData.resizedImage} alt="img"/>
                            </Col>
                            <Col md="7" sm="12" className="d-flex justify-content-center align-items-center">
                                <Stack className="p-2 d-flex justify-content-center">
                                    <div className="mb-2">
                                        <h5>{product.name}</h5>
                                    </div>
                                    <div className="mb-3">
                                        <Description id="g-l-desc">
                                            {product.description}
                                        </Description>
                                    </div>
                                    <hr className="h-divider"/>
                                    <Row className="mt-3">
                                        <Col md="6">
                                            <Rating
                                                name="simple-controlled"
                                                className="px-1"
                                                defaultValue={5}
                                                value={0}
                                                precision={0.1}
                                                icon={<Favorite className="fav_ic"/>}
                                                emptyIcon={<FavoriteBorder className="fav_ic"/>}
                                                readOnly
                                            />
                                        </Col>
                                        <Col md="6">
                                            <label>${product.price.toFixed(2)}</label>
                                        </Col>
                                    </Row>
                                </Stack>
                            </Col>
                        </Row>
                        <Alert severity="info" className="mt-auto">The user is granted a non-exclusive license to use the digital art for commercial purposes,
                        including but not limited to product packaging, advertising, and promotional materials.
                        The user is prohibited from reselling or distributing the digital art to third parties without prior written consent from the licensor.
                        </Alert>
                        {(!user || isOwner)?
                            <Tooltip title={(!user)?"Please login first!":"You cannot buy your own product!"}>
                                <Button id="g-l-btn-disabled" className="w-100 rounded-0 border-0">Buy A License</Button>
                            </Tooltip>
                            :
                            <Button id="g-l-btn" className="w-100 rounded-0 border-0" onClick={handleOnBuyBtnClick}>Buy A License</Button>
                        }
                    </Stack>
                </div>
            </Backdrop>
            :
            <></>
    )
}