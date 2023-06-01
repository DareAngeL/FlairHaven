import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Alert, CircularProgress, LinearProgress, Rating } from "@mui/material";
import { useRef } from "react";
import { Card, Col, Row, Modal, Button, Stack } from "react-bootstrap";
import { AddPictureImg } from "../res/Res";
import useProductHandler from "../hooks/useProductHandler"

export default function AddProduct(props) {

    const fileInputRef = useRef(null)

    const {
        _show,
        _onHide,
        _isAddProduct=true,
        _onAddedProduct,
    } = props

    const {
        handleOnHide,
        handleFileSelect,
        imgErr,
        resizedImg,
        handleAddImageClick,
        handleSetImgErr,
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
        handleProceedBtn,
        isSuccess,
        isUploading,
        uploadProgress
    } = useProductHandler((result) => {
        _onAddedProduct(result)
    })
    

    return (
        <Modal className="modal-container" show={_show} onHide={()=>handleOnHide(_onHide)}>
            <Modal.Title className="ms-3 mt-2 fw-bold">Add Product</Modal.Title>
            <Modal.Body>
                <Row>
                    <Col md="5">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
                        <div style={{position: 'relative'}}>
                            <Card.Img 
                                id="add-prod-img" 
                                className={(imgErr)?"error rounded-3":"rounded-3"} 
                                src={(resizedImg!=='') ?
                                    resizedImg
                                    :
                                    AddPictureImg
                                }
                            onClick={() => { 
                                handleAddImageClick(fileInputRef)
                                handleSetImgErr(false)
                            }}/>
                            {(isFetchingImg) ?
                                <div id="addprod-loading-img" className="bg-dark rounded-3 d-flex justify-content-center align-items-center">
                                    <CircularProgress/>
                                </div>
                                :
                                <></>
                            }
                        </div>

                        <Rating
                            name="simple-controlled"
                            className="px-1"
                            defaultValue={0}
                            precision={0.1}
                            icon={<Favorite className="fav_ic_read"/>}
                            emptyIcon={<FavoriteBorder className="fav_ic_read"/>}
                            readOnly
                        />
                        {!_isAddProduct ?
                            <label id="addprod-date">Date Posted: April 5, 2023</label>
                            :
                            <></>
                        }
                    </Col>
                    <Col md="7">
                        <Row>
                            <Col md="12">
                                <input
                                    className={(nameErr)?"addprod-inp error rounded-2 p-1":"addprod-inp rounded-2 p-1"}
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
                                    className={(descErr)?"addprod-inp error rounded-2 p-1":"addprod-inp rounded-2 p-1"}
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
                                    className={(priceErr)?"addprod-inp error rounded-2 p-1 mx-3 w-50":"addprod-inp rounded-2 p-1 mx-3 w-50"}
                                    type="number"
                                    placeholder="Enter A Price"
                                    value={price}
                                    onChange={(e) => handleSetPrice(e.target.value)}
                                    onBlur={(e) => handleOnBlur(e, 'price')}
                                    onFocus={() => handleSetPriceErr(false)}
                                />
                                $
                            </Col>
                            <Col md="12" className="mt-5 d-flex justify-content-end">
                                <Button id="addprod-btn" className="rounded-5" onClick={handleProceedBtn}>Proceed</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {(isSuccess) ?
                    <Alert severity="success">Added Product Successfully!</Alert>
                    :
                    <></>
                }

                {(isUploading) ?
                    <Stack>
                        <label>Uploading: {uploadProgress}%</label>
                        <LinearProgress className="mt-2" variant="determinate" value={uploadProgress}/>
                    </Stack>
                    :
                    <></>
                }
            </Modal.Body>
        </Modal>
    )
}