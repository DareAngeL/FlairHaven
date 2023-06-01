import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Rating } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/UnarchiveRounded';
import Utility from "../util/Utility";

export default function DashProdCard(props) {

    const {
        _id,
        imageData,
        name,
        isActive,
        createdOn,
        ratings,
    } = props.data

    const {
        onArchive,
        onUnarchive
    } = props

    const { onClick } = props

    const formattedDate = Utility.formatDate(createdOn)

    return (
        <div id="dash-prod-card" className="p-0">
            <div className="d-flex m-2" onClick={()=>onClick(_id)}>
                <img id="dash-prod-img" className="img-fluid" src={imageData.resizedImage} alt="product_pic" onContextMenu={(e)=>e.preventDefault()}/>
                <Row className="ps-2">
                    <Col md="12" className="d-flex align-items-center">
                        <h6 className="p-0 m-0">{name}</h6>
                    </Col>
                    <Col md="12" className="d-flex">
                        <label id="dash-prod-card-date" className="m-0 p-0">{`Date Posted: ${formattedDate}`}</label>
                    </Col>
                    <Col md="12">
                        <Row>
                            <Col md="6">
                                <Rating
                                    name="simple-controlled"
                                    className="px-1"
                                    defaultValue={0}
                                    value={ratings}
                                    precision={0.1}
                                    icon={<Favorite className="dash-fav_ic_read"/>}
                                    emptyIcon={<FavoriteBorder className="dash-fav_ic_read"/>}
                                    readOnly
                                />
                            </Col>
                            <Col md="6" className="d-flex justify-content-end align-items-center" >
                                
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            {isActive?
                <div onClick={()=>onArchive(props.data)} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: '5%'
                }}>
                    <ArchiveIcon id="dash-prod-archive-ic" className="me-3"/>
                </div>
                :
                <div onClick={()=>onUnarchive(props.data)} style={{
                    position: 'absolute',
                    right: 0,
                    bottom: '5%'
                }}>
                    <UnarchiveIcon id="dash-prod-unarchive-ic" className="me-3"/>
                </div>
            }
        </div>
    )
}