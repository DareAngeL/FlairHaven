import { Card } from "react-bootstrap";
import { CoverImg } from "../res/Res";

export default function Banner(props) {

    const {
        _ref
    } = props
    // https://dummyimage.com/640x120/000/aaa
    return (
        <Card ref={_ref} className="bg-dark text-white mt-2">
            <Card.Img height={'180rem'} src={CoverImg} alt="Card image" style={{objectFit: 'cover', border: 'none'}} />
            <Card.ImgOverlay id="banner-overlay">
                <Card.Title id="banner-title">Discover Your Next Must-Have Item Here!</Card.Title>
                <Card.Text id="banner-text">
                Find the perfect art for you.
                </Card.Text>
            </Card.ImgOverlay>
        </Card>
    )
}