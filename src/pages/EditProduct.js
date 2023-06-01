/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import useProductHandler from "../hooks/useProductHandler"
import { AddPictureImg } from "../res/Res"
import { Alert, CircularProgress, Rating } from "@mui/material"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"
import Utility from "../util/Utility"
import BackIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import EarnIcon from '@mui/icons-material/MonetizationOnRounded';
import NumberIcon from '@mui/icons-material/NumbersRounded';

const { getProductInfo, updateProductInfo, hasAccess } = require("../Requests").default

export default function EditProduct() {

    const navigate = useNavigate()

    const { productId } = useParams()

    const [date, setDate] = useState('')
    const [ratings, setRatings] = useState(0)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)

    const [img, setImg] = useState('')
    const [productRevenue, setProductRevenue] = useState(0)
    const [totalSold, setProductTotalSold] = useState(0)

    const {
        imgErr,
        isFetchingImg,
        nameErr,
        name,
        handleSetName,
        handleOnBlur,
        handleSetNameErr,
        descErr,
        desc,
        handleSetDesc,
        handleSetDescErr,
        priceErr,
        handleSetPriceErr,
        price,
        handleSetPrice,
    } = useProductHandler()

    useEffect(() => {
        const token = localStorage.getItem('token')

        hasAccess(token).then(hasAccess => {
            if (!hasAccess) {
                navigate('/error')
            }

            getProductInfo(productId, localStorage.getItem('token')).then(product => {
                setImg(product.imageData.resizedImage)
                handleSetName(product.name)
                handleSetDesc(product.description)
                handleSetPrice(product.price)
                setDate(product.createdOn)
                setRatings(product.ratings)
    
                setProductTotalSold(product.orders.length)
                setProductRevenue(product.price * product.orders.length)
            })
        })
    }, [])

    const handleUpdateBtn = async () => {
        setIsUpdating(true)
        const updatedProduct = await updateProductInfo(productId, {
            name: name,
            description: desc,
            price: price
        }, localStorage.getItem('token'))

        if (updatedProduct) {
            setIsUpdateSuccess(true)

            setTimeout(() => {
                setIsUpdateSuccess(false)
            }, 1500)
        }

        setIsUpdating(false)
    }

    return (
        <div className="d-flex justify-content-center mt-5">
            <div className="back-btn-container" onClick={() => navigate('/dashboard')}>
                <BackIcon className="mx-3 mt-2"/>
            </div>
            <Row id="edit-prod-container" className="pb-4">
                <h2 className="fw-bold">Edit Product</h2>
                <Col md="5">
                    <div style={{position: 'relative'}}>
                        <Card.Img
                            className={(imgErr)?"error rounded-3":"rounded-3"} 
                            src={(img !== '') ?
                                img
                                :
                                AddPictureImg
                            }
                        />
                        {(isFetchingImg) ?
                            <div id="addprod-loading-img" className="bg-dark rounded-3 d-flex justify-content-center align-items-center">
                                <CircularProgress/>
                            </div>
                            :
                            <></>
                        }
                    </div>

                    <Stack>
                        <Rating
                            name="simple-controlled"
                            className="px-1"
                            defaultValue={0}
                            value={ratings}
                            precision={0.1}
                            icon={<Favorite className="fav_ic_read"/>}
                            emptyIcon={<FavoriteBorder className="fav_ic_read"/>}
                            readOnly
                        />
                        <label id="addprod-date">Date Posted: {Utility.formatDate(date)}</label>
                    </Stack>
                </Col>
                <Col md="7">
                    <Row>
                        <Col md="12">
                            <input
                                className={(nameErr)?"editprod-inp error rounded-2 p-1":"editprod-inp rounded-2 p-1"}
                                type="text"
                                placeholder="Product name*"
                                value={name}
                                onChange={(e) => handleSetName(e.target.value)}
                                onBlur={(e) => handleOnBlur(e, 'name')}
                                onFocus={() => handleSetNameErr(false)}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col md="12">
                            <label className="addprod-lbl">Description*</label>
                        </Col>
                        <Col md="12">
                            <textarea
                                className={(descErr)?"editprod-inp error rounded-2 p-1":"editprod-inp rounded-2 p-1"}
                                placeholder="Tell something about your product..."
                                value={desc}
                                onChange={(e) => handleSetDesc(e.target.value)}
                                onBlur={(e) => handleOnBlur(e, 'desc')}
                                onFocus={() => handleSetDescErr(false)}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col md="12">
                            <label>Price*</label>
                            <input
                                className={(priceErr)?"editprod-inp error rounded-2 p-1 mx-3 w-50":"editprod-inp rounded-2 p-1 mx-3 w-50"}
                                type="number"
                                placeholder="0"
                                value={price}
                                onChange={(e) => handleSetPrice(e.target.value)}
                                onBlur={(e) => handleOnBlur(e, 'price')}
                                onFocus={() => handleSetPriceErr(false)}
                            />
                            $
                        </Col>
                        <Col md="12" className="mt-5 d-flex justify-content-end">
                            <Stack>
                                <Button id="editprod-btn" className="rounded-5" onClick={handleUpdateBtn}>Update</Button>
                                {(isUpdateSuccess) ?
                                    <Alert severity="success">Update success!</Alert>
                                    :
                                    <></>
                                }
                            </Stack>
                        </Col>
                    </Row>
                </Col>
                <Col className="d-flex mt-5">
                    <div>
                        <div className="d-flex">
                            <EarnIcon fontSize="large" style={{color: 'gold'}}/>
                            <h3>{productRevenue}</h3>
                        </div>
                        <div>
                            <label>Product Revenue</label>
                        </div>
                    </div>
                    <div className="ms-5">
                        <div className="d-flex">
                            <NumberIcon fontSize="large" />
                            <h3>{totalSold}</h3>
                        </div>
                        <div>
                            <label>Product Sold</label>
                        </div>
                    </div>
                </Col>
            </Row>
            {(isUpdating)?
                <div className="loading">
                    <Stack className="d-flex justify-content-center align-items-center h-100">
                        <CircularProgress/>
                        <label>Uploading Image...</label>
                    </Stack>
                </div>
                :
                <></>
            }   
               
        </div>
    )
}