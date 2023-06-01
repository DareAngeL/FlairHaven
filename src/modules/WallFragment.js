/* eslint-disable react-hooks/exhaustive-deps */
import { Rating, Skeleton, Tooltip, Zoom } from "@mui/material";
import { useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Stack } from "react-bootstrap";
import FavoriteIcon from "@mui/icons-material/Favorite"
import { CircleOutlined, FavoriteBorder, AddShoppingCart } from "@mui/icons-material";
import CommentFragment from "../components/CommentFragment";
import { ImagePlaceHolder } from "../res/Res";
import { useEffect } from "react";
import Utility from "../util/Utility";
import Description from "../components/Description";
import Loading from "../components/Loading";
import SnackBarAlert from "../components/SnackBarAlert";
import AddCommentIcon from '@mui/icons-material/AddCommentRounded';
import useTimeAgo from "../hooks/useTimeAgo";
import CheckIcon from '@mui/icons-material/CheckRounded';
import { useContext } from "react";
import AppContext from "../AppContext";
import useBootstrapTooltip from "../components/useBootstrapTooltip";

const { 
    addComment, 
    addReaction, 
    addToCart, 
    editComment, 
    getUserCartProducts, 
    getComments, 
    removeComment 
} = require('../Requests').default

export default function WallFragment(props) {

    const {
        product, 
        onBuyBtnClick,
        onCartAdd ,
        onCommentAdded=()=>{}
    } = props

    const appContext = useContext(AppContext)

    const commentsContainerRef = useRef(null)
    
    const [commentsLength, setCommentsLength] = useState(0)
    const [comments, setComments] = useState([]) // use for loading or rendering the comments to the UI
    const [origComments, setOrigComments] = useState([]) //
    const [loadCommentsSet, setLoadCommentsSet] = useState(1)
    const [isFetchingComments, setIsFetchingComments] = useState(false)
    const [scrollDownCommentContainer, setScrollDownCommentContainer] = useState(false)
    const [isAddingComment, setIsAddingComment] = useState(false)

    const [hearts, setHearts] = useState(0)
    const [addedToCart, setAddedToCart] = useState(false)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isAddingCartErr, setIsAddingCartErr] = useState(false)
    const [isSeeComment, setIsSeeComment] = useState(false)
    const [isEditingComm, setEditingComm] = useState(false)
    const [isReactor, setIsReactor] = useState(false)
    const [isOpenReactionTooltip, setIsOpenReactionTooltip] = useState(false)
    const [reactorsLabel, setReactorsLabel] = useState('')

    const [editingCommentId, setEditingCommentId] = useState('')
    const [commentValue, setCommentValue] = useState('')
    const [_product, setProduct] = useState(product)

    const timeAgo = useTimeAgo(new Date(product.createdOn))

    const [isOwner, setIsOwner] = useState(false) // check if the current user is the owner of this product

    const currentUser = appContext.user()

    const { BootstrapTooltip } = useBootstrapTooltip()

    const LIMIT = 10
    
    useEffect(() => {
        if (currentUser) {
            if (currentUser._id === _product.creatorId) {
                setIsOwner(true)
            }

            checkIfIsReactor().then(result => {
                if (result.isReactor) {
                    setReactorsLabel(getReactorsLabel(result.isReactor))
                    setHearts(result.reaction)
                }
            })
        }

        setCommentsLength(_product.comments.length)
    }, [])

    // use for setting up the label for showing how many reactors
    useEffect(() => {
        setReactorsLabel(getReactorsLabel(isReactor))
    }, [_product])

    // use for scrolling down the comment container
    useEffect(() => {
        const commentsContainer = commentsContainerRef.current
        if (!commentsContainer) {
            return
        }

        commentsContainer.scrollTop = commentsContainer.scrollHeight

    }, [scrollDownCommentContainer])

    /**
     * Checks if the user is a reactor of this post
     * @returns true if the user is a reactor and false if not
     */
    const checkIfIsReactor = async () => {
        for (let i=0; i<_product.reactors.length; i++) {
            const reactorId = _product.reactors[i].userId
            if (reactorId === currentUser._id) {
                setIsReactor(true)

                return {
                    isReactor: true,
                    reaction: _product.reactors[i].reaction
                }
            }
        }

        return {
            isReactor: false,
            reaction: -1
        }
    }

    const handleBuyBtnClick = (product) => {
        onBuyBtnClick(product)
    }

    const handleCartBtnClick = async () => {
        setIsAddingToCart(true)
        
        const localCart = JSON.parse(localStorage.getItem('cartItems'))
        // check if this product is already added 
        // in the cart and don't add to cart
        // if it is already in the cart
        if (localCart) {
            let isProductAlreadyAdded = false
            localCart.forEach((_product) => {
                if (_product._id === product._id) {
                    isProductAlreadyAdded = true
                    return
                }
            })

            if (isProductAlreadyAdded) {
                setIsAddingToCart(false)
                setIsAddingCartErr(true)
                return
            }
        }
        // else adds the item to the database cart
        const cart = await addToCart(product._id, localStorage.getItem('token'))
        if (cart) {
            setAddedToCart(true)
            setIsAddingToCart(false)

            const prods = await getUserCartProducts(localStorage.getItem('token'))
            if (prods) {
                localStorage.setItem('cartItems', JSON.stringify(prods))
                setAddedToCart(true)
                onCartAdd()
            }
        }

        setIsAddingToCart(false)
    }

    const handleOnAddCommentClick = async () => {
        if (isFetchingComments) {
            return
        }

        setIsAddingComment(true)
        setScrollDownCommentContainer(!scrollDownCommentContainer)
        const result = await addComment(_product._id, {
            comment: commentValue
        }, localStorage.getItem('token'))

        if (result) {
            setProduct(result.product)
            setCommentsLength(result.comments.length)
            setComments(loadComments(false, result.comments))
            setOrigComments(result.comments)

            setCommentValue('')
            onCommentAdded(result.product)
            setScrollDownCommentContainer(!scrollDownCommentContainer)
        }

        setIsAddingComment(false)
    }
    
    const handleSeeComments = async () => {
        setIsSeeComment(!isSeeComment)
        setIsFetchingComments(true)
        const comments = await getComments(product._id)
        
        setCommentsLength(comments.length)
        setComments(loadComments(false, comments))
        setOrigComments(comments)

        setIsFetchingComments(false)
    }

    const handleSeeMoreComments = () => {
        setComments(loadComments(true, origComments))
    }

    /**
     * Use for lazy loading comments
     * @param {Boolean} isNewSet should we load a new set of comments?
     * @param {*} _comments 
     * @returns 
     */
    const loadComments = (isNewSet, _comments) => {
        let set = loadCommentsSet
        if (isNewSet) {
            set++
            setLoadCommentsSet(loadCommentsSet+1)
        }

        let i = _comments.length - (set * LIMIT)
        if (i < 0) {
            i = 0
        }

        return _comments.filter((_, index) => index >= i)
    }

    const handleOnEditCheck = async () => {
        const updatedComment = await editComment(_product._id, {
            commentId: editingCommentId,
            comment: commentValue
        }, localStorage.getItem('token'))

        if (updatedComment) {
            const newComments = comments.map(comment => {
                if (comment._id === editingCommentId) {
                    return updatedComment
                }

                return comment
            })

            setComments(loadComments(false, newComments))
            setOrigComments(newComments)

            setEditingComm(false)
            setEditingCommentId('')
            setCommentValue('')
        }
    }

    const handleOnEditClick = (_comment) => {
        setEditingComm(true)
        setEditingCommentId(_comment._id)
        setCommentValue(_comment.comment)
    }

    const handleOnDeleteClick = async (_comment) => {
        const isDeleted = await removeComment(_product._id, {
            commentId: _comment._id
        }, localStorage.getItem('token'))

        if (isDeleted) {
            const newComments = origComments.filter(comment => comment._id !== _comment._id)
            setComments(loadComments(false, newComments))
            setOrigComments(newComments)
            setCommentsLength(newComments.length)
        }
    }

    const handleOnReaction = async (e, newValue) => {
        setIsOpenReactionTooltip(false)
        if (newValue === null) {
            const prevHeart = hearts
            setHearts(prevHeart)
            return
        }

        setHearts(newValue)

        let rating = _product.ratings
        const numReactors = _product.reactors.length

        rating = ((rating * numReactors) + newValue) / (numReactors + 1)

        const updatedProduct = await addReaction(_product._id, newValue, rating, localStorage.getItem('token'))

        if (updatedProduct) {
            setIsReactor(true)
            setProduct(updatedProduct)
        }
    }

    const getRows = () => {
        const lineCount = commentValue.split(/\r\n|\r|\n/).length
        return lineCount < 3 ? 1 : lineCount
    }

    const getReactorsLabel = (isReactor) => {
        const reactors = _product.reactors.length - (isReactor)?1:0
        
        if (isReactor) {
            if (reactors >= 1) {
                return `You and ${reactors} ${reactors>1?'others':'other'} hearted this piece of art`
            }

            return `You heart this piece of art`
        }

        // else if the user is not a reactor
        if (reactors > 0) {
            return `${reactors} people hearted this piece of art`
        } else {
            // check also if the current user is the owner of this product
            if (isOwner) {
                return 'We are still hoping for a heart!'
            }

            return 'Be the first to heart this art.'
        }
    }

    return (
        <Card id="wf-card" className={appContext.isSmallScreenMobile?"mb-2 mt-2":"m-2"}>
            <div className="d-flex align-items-center">
                <img id="wf-artist-img" className="img-fluid" src={(product.creatorProfilePicture==='')?ImagePlaceHolder:product.creatorProfilePicture} alt="artist profile"/>
                <Row>
                    <label id="wf-artist-name" className="mt-1">{product.creatorName}</label>
                    <label id="wf-date">{timeAgo} ` {Utility.formatDate(product.createdOn)}</label>
                </Row>
                
            </div>
            <Card.Img id="wf-card-img" src={product.imageData.resizedImage}/>

            <Card.Body>
                {/* product name and cart button */}
                <div className="d-flex">
                    <Card.Title>{product.name}</Card.Title>
                    {(currentUser && !isOwner)?
                        <div className={(addedToCart)?"shake ms-auto":"ms-auto"} onClick={handleCartBtnClick}>
                            <AddShoppingCart id="wf-cart" className="cart-ic"/>
                        </div>
                        :
                        <div className={(addedToCart)?"shake ms-auto":"ms-auto"}>
                            <AddShoppingCart id="wf-cart-disabled" className="cart-ic"/>
                        </div>
                    }
                </div>
                {/* product price */}
                <Card.Subtitle className="fs-6 mb-2">${_product.price.toFixed(2)}</Card.Subtitle>
                <Container className="d-flex align-items-center p-0 m-0" fluid>
                    <label id="rating_lbl">{_product.ratings.toFixed(1)} Heart(s)</label>
                    <CircleOutlined id="c_divider" color="error"/>
                    <Rating
                        name="simple-controlled"
                        className="px-1"
                        defaultValue={0}
                        value={_product.ratings}
                        precision={0.1}
                        icon={<FavoriteIcon className="fav_ic_read"/>}
                        emptyIcon={<FavoriteBorder className="fav_ic_read"/>}
                        readOnly
                    />
                </Container>
                {/* description */}
                <Description id="wf-text">
                    {product.description}
                </Description>
                <div className="d-flex mt-2">
                    <label className="heart-info">{reactorsLabel}</label>
                    <label className="heart-info ms-auto">{commentsLength} Comment(s)</label>
                </div>
            </Card.Body>
            <Card.Footer className="wf-footer">
                <Container className="p-0 m-0 d-flex justify-content-center" fluid>
                    <Row className="w-100">
                        {/* Heart Button */}
                        {currentUser?
                            <BootstrapTooltip 
                                TransitionComponent={Zoom} 
                                arrow
                                placement="top"
                                title={
                                    <Rating
                                        name="simple-controlled"
                                        className="px-1"
                                        defaultValue={0}
                                        value={hearts}
                                        onChange={handleOnReaction}
                                        icon={<FavoriteIcon className="fav_ic"/>}
                                        emptyIcon={<FavoriteBorder className="fav_ic"/>}
                                    />
                                }
                                open={isOpenReactionTooltip}
                            >
                                <Col md="4" sm="4" xs="4" className="d-flex justify-content-center" onClick={()=>setIsOpenReactionTooltip(!isOpenReactionTooltip)}>
                                    <Button className="wf-btn rounded-2 border-1 px-5 d-flex align-items-center">Heart</Button>
                                </Col>
                            </BootstrapTooltip>
                        :
                            <Col md="4" sm="4" xs="4" className="d-flex justify-content-center">
                                <Tooltip title="You need to login first!" arrow>
                                    <Button className="wf-btn wf-btn-not-allowed rounded-2 border-1 px-3">Heart</Button>
                                </Tooltip>
                            </Col>
                        }
                        {/* Comment Button */}
                        <Col md="4" sm="4" xs="4" className="d-flex justify-content-center">
                            <Button className="wf-btn rounded-2 border-1 px-3" onClick={handleSeeComments}>Comment</Button>
                        </Col>
                        {/* Buy Button */}
                        <Col md="4" sm="4" xs="4" className="d-flex justify-content-center">
                            <Button className="wf-btn rounded-2 border-1 px-3" onClick={()=>handleBuyBtnClick(product)}>Buy</Button>
                        </Col>
                    </Row>
                </Container>
                {(isSeeComment)?
                    <>
                        <Container id="wf-comments-card" ref={commentsContainerRef} className="p-2 mt-2">
                            {isFetchingComments ?
                                <div className="d-flex">
                                    <Skeleton className="mt-1" variant="circular" width={30} height={30}/>
                                    <div>
                                        <Skeleton className="mt-1 ms-2" variant="rounded" width={80} height={7}/>
                                        <Skeleton className="mt-1 ms-2" variant="rounded" width={200} height={30}/>
                                    </div>
                                </div>
                                :
                                <>
                                    {(commentsLength>LIMIT && commentsLength !== comments.length)?
                                        <label className="see-more-txt mt-2 mb-1" onClick={handleSeeMoreComments}>See previous comments...</label>
                                        :
                                        <></>
                                    }
                                    {/* COMMENTS */}
                                    {comments.map((comment) => 
                                        <CommentFragment 
                                            key={comment._id} 
                                            comment={comment} 
                                            editing={comment._id === editingCommentId} 
                                            onEditClick={handleOnEditClick}
                                            onDeleteClick={handleOnDeleteClick}
                                        />
                                    )}
                                    {isAddingComment?
                                        <div className="d-flex">
                                            <Skeleton className="mt-1" variant="circular" width={30} height={30}/>
                                            <div>
                                                <Skeleton className="mt-1 ms-2" variant="rounded" width={80} height={7}/>
                                                <Skeleton className="mt-1 ms-2" variant="rounded" width={200} height={30}/>
                                            </div>
                                        </div>
                                        :
                                        <></>
                                    }

                                    <Stack key="see-more_no-comments-container">
                                        {(commentsLength===0)?
                                            <label className="see-more-txt mb-1">No comments yet...</label>
                                            :
                                            <></>
                                        }
                                    </Stack>
                                </>
                            }
                        </Container>
                        {/* Add comment input and button */}
                        <div id="wf-addcomment-container" className="d-flex align-items-top">
                            {currentUser?
                                <>
                                    <Form.Control
                                        id="wf-addcomment-inp"
                                        className="border-0"
                                        as="textarea"
                                        size="sm"
                                        rows={1}
                                        value={commentValue}
                                        placeholder="What's your thought?..."
                                        onChange={(e)=>setCommentValue(e.target.value)}
                                        style={{ height: `${getRows() * 1.5}rem`, overflow:'hidden' }}
                                    />
                                    <div className="px-2 d-flex align-items-center" onClick={(!isEditingComm)?handleOnAddCommentClick:handleOnEditCheck}>
                                        {(!isEditingComm)?
                                            <AddCommentIcon className="wf-comment-btn"/>
                                            :
                                            <CheckIcon className="wf-comment-btn"/>
                                        }
                                    </div>
                                </>
                                :
                                <>
                                    <Form.Control
                                        id="wf-addcomment-not-allowed"
                                        className="rounded-3 border-0"
                                        as="textarea"
                                        size="sm"
                                        rows={1}
                                        value={commentValue}
                                        placeholder="You need to login first."
                                        onChange={(e)=>setCommentValue(e.target.value)}
                                        style={{ height: `${getRows() * 1.5}rem`, overflow:'hidden' }}
                                        disabled
                                    />
                                    <div className="px-2">
                                        <AddCommentIcon className="wf-comment-btn-disabled"/>
                                    </div>
                                </>
                            }
                        </div>
                    </>
                    :
                    <></>
                }

                <Loading open={isAddingToCart} text="Adding to Cart"/>
                <SnackBarAlert open={addedToCart} text="Added to cart successfully!" onClose={()=>setAddedToCart(false)}/>
                <SnackBarAlert open={isAddingCartErr} severity="error" text="Product is already added in the cart!" onClose={()=>setIsAddingCartErr(false)}/>
            </Card.Footer>
        </Card>
    )
}