import { Card, Container, Row } from "react-bootstrap";
import useTimeAgo from "../hooks/useTimeAgo";
import { ImagePlaceHolder } from "../res/Res";

export default function CommentFragment(props) {

    const {
        comment,
        index,
        onEditClick,
        onDeleteClick,
        editing
    } = props

    const user =  JSON.parse(localStorage.getItem('user'))
    const sessionUserId = user ? user._id : '' // use for determining if this comment is the user's comment

    const timeAgo = useTimeAgo(new Date(comment.commentedOn))

    const handleOnEditClick = () => {
        onEditClick(comment)
    }

    const handleOnDeleteClick = () => {
        onDeleteClick(comment)
    }

    return (
        <Container className="mt-2 p-0 d-flex justify-content-center">
            <img id="comment-prof-pic" src={(comment.userProfile!=='')?comment.userProfile:ImagePlaceHolder} alt="profile pic"/>
            <Container className="px-2 m-0 d-flex align-items-start" fluid>
                <Row>
                    <label id="comment-username" className="m-0 p-0">{comment.userName}</label>
                    <Card
                        id="comment-card" 
                        className="p-2"
                        style={{background: (editing)?'rgba(64, 81, 238, 0.16)':'white'}}
                    >
                        <Card.Text id="comment-txt">{comment.comment}</Card.Text>
                    </Card>
                    <div className="d-flex">
                        {(sessionUserId === comment.userId)?
                            <>
                                <label className="comment-mod p-0" onClick={handleOnEditClick}>Edit</label>
                                <label className="comment-mod mx-2" onClick={handleOnDeleteClick}>Delete</label>
                                <label className="comment-mod  me-1">|</label>
                            </>
                            :
                            <></>
                        }
                        <label id="comment-timemsg" key={index} className="m-0 p-0">{timeAgo}</label>
                    </div>
                </Row>
            </Container>
        </Container>
    )
}