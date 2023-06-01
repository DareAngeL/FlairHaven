import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Rating } from "@mui/material";
import { Card, Col, Row } from "react-bootstrap";
import { ImagePlaceHolder } from "../res/Res";

export default function MiniCard(props) {

    const {
        product={
            name: 'Loading...',
            imageData: {
                resizedImage: ImagePlaceHolder,
                originalImage: ''
            },
            price: 0,
            ratings: 0
        },
        onClick
    } = props

    return (
        <Card id="mini-card-root" className="mt-1" onClick={()=>onClick(product)}>
            <Card.Img id="mini-card-img" className="img-fluid" src={product.imageData.resizedImage}/>

            <Card.Body className="p-2">
                <Card.Subtitle className="mini-c-title text-truncate text-wrap">{product.name}</Card.Subtitle>
                <div className="mini-c-price mb-0 mt-2 fw-bold d-flex">
                    <Card.Text className="dollar-sign">$</Card.Text>{(product.price).toFixed(2)}
                </div>

                <Row>
                    <Col>
                        <Rating
                            name="simple-controlled"
                            defaultValue={0}
                            value={product.ratings}
                            precision={0.1}
                            icon={<Favorite className="mini-c-fav"/>}
                            emptyIcon={<FavoriteBorder className="mini-c-fav"/>}
                            readOnly
                        />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}