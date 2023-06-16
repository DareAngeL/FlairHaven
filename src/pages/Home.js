import React, { useContext, useEffect, useRef, useState } from "react"
import { Col, Container, Row, Stack } from "react-bootstrap"
import Banner from "../components/Banner"
import Login from "../modules/Login"
import TopBar from "../components/TopBar"
import RightWall from "../modules/RightWall"
import Shelves from "../modules/Shelves"
import MiniCard from "../components/MiniCard"
import HomeIcon from '@mui/icons-material/HomeRounded';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ProfileOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import ProfileIcon from '@mui/icons-material/PersonRounded';
import OrdersOutlineIcon from '@mui/icons-material/Inventory2Outlined';
import OrdersIcon from '@mui/icons-material/Inventory2Rounded';
import CartOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import CartIcon from '@mui/icons-material/ShoppingBasketRounded';
import ProfileMenu from "../modules/ProfileMenu"
import AppContext from "../AppContext"
import { Badge, Skeleton } from "@mui/material"
import GetLicense from "../modules/GetLicense"
import Utility from "../util/Utility"
import Cart from "../modules/Cart"
import Orders from "../modules/Orders"
import ViewProduct from "../modules/ViewProduct"
import HomeMobile from "./HomeMobile"
import SnackBarAlert from "../components/SnackBarAlert"
import useLazyLoader from "../hooks/useLazyLoader"
import OpeningServer from "../components/OpeningServer"
import { useNavigate } from "react-router-dom"

const { getActiveProducts, getUserCartProducts, resetRetrievedProdIds } = require("../Requests").default

export default function Home() {

    const LIMIT = 60

    const navigate = useNavigate()
    const { 
        isFirstTimeOpen, 
        setIsFirstTimeOpen, 
        isMobileView, 
        user 
    } = useContext(AppContext);

    const leftWallRightOffset = 90

    const rightWallRef = useRef(null)
    const leftWallRef = useRef(null)

    const isFirstInit = useRef(0)

    const [openProfMenuDlg, setOpenProfMenuDlg] = useState(false)

    const [openGetLicenseView, setOpenGetLicenseView] = useState(false)
    const [productLicenseView, setProductLicenseView] = useState({})

    const [leftWallSize, setLeftWallSize] = useState([0, 0])
    const [showLogin, setShowLogin] = useState(false)
    
    const [leftWallShuffProd, setLeftWallShuffProd] = useState([])
    const [rightWallShuffProd, setRightWallShuffProd] = useState([])

    const [viewProduct, setViewProduct] = useState(undefined)

    const [isHoverOnProfNav, setIsHoverOnProfNav] = useState(false)
    const [isHoverOnHomeNav, setIsHoverOnHomeNav] = useState(false)
    const [isHoverOnSavesNav, setIsHoverOnSavesNav] = useState(false)
    const [isHoverOnCartNav, setIsHoverOnCartNav] = useState(false)

    const [isOpenCart, setIsOpenCart] = useState(false)
    const [itemsOnCart, setItemsOnCart] = useState(0)

    const [isOpenOrders, setIsOpenOrders] = useState(false)

    const [hasNoMoreJFYProductsLeft, setHasNoMoreJFYProductsLeft] = useState(false)

    const [showLoginSuccessAlert, setShowLoginSuccessAlert] = useState(false)
    const [showSignOutSuccess, setShowSignOutSuccess] = useState(false)

    const [navSelection, setNavSelection] = useState({
        homeNavSelected: true,
        saveNavSelected: false,
        cartNavSelected: false
    })

    const containerRef = useRef(null)

    /*
        lazy loader for the "just for you" products
    */
    const {setScroller, setContainerRoot} = useLazyLoader(hasNoMoreJFYProductsLeft, (set) => {
        // on load more
        getActiveProducts(set).then(prods => {
            // if there are no products left to load just return
            if (!prods) {
                setHasNoMoreJFYProductsLeft(true)
                return
            }

            setLeftWallShuffProd([...leftWallShuffProd, ...prods])
        })
    })

    const windowResizeHandler = () => {
        const rightWall = rightWallRef.current

        if (rightWall) {
            const rightWallRect = rightWall.getBoundingClientRect()

            setLeftWallSize([
                // width
                window.innerWidth - rightWallRect.width - leftWallRightOffset,
                // height
                window.innerHeight
            ])

            return
        }
    }

    //# region: USE EFFECTS
    useEffect(() => {
        const leftWallContainer = leftWallRef.current

        if (!isMobileView) {
            setScroller(leftWallContainer)
            setContainerRoot(leftWallContainer)
        } else {
            setContainerRoot(document.documentElement)
        }
        
        // check if cart has items
        const cartItems = JSON.parse(localStorage.getItem('cartItems'))
        if (cartItems) {
            setItemsOnCart(cartItems.length)
        } else {
            // else try to retrieve it from the database
            const token = localStorage.getItem('token')
            // check if token exists, to know if the user logs in
            if (token) {
                getUserCartProducts(token).then(_products => {
                    if (_products) {
                        localStorage.setItem('cartItems', JSON.stringify(_products))
                        setItemsOnCart(_products.length)
                    }
                })
            }
        }

        // resets the data
        isFirstInit.current = 0
        resetRetrievedProdIds()

        handleFetchingActiveProducts()

        window.addEventListener('resize', windowResizeHandler)
        return () => {
            window.removeEventListener('resize', windowResizeHandler)
        }
    }, [])

    useEffect(() => {
        windowResizeHandler()
    }, [rightWallRef])
    // # end region

    const handleFetchingActiveProducts = async () => {
        // get all active products
        const prods = await getActiveProducts(0)
        if (prods.length <= LIMIT) {
            setHasNoMoreJFYProductsLeft(true)
        }

        populateLeftWall(prods)
        populateRightWall(prods)

        // if it is the first time to load the products
        if (isFirstInit.current === 0) {
            if (isFirstTimeOpen) {
                setIsFirstTimeOpen(false)
            }

            isFirstInit.current++
        }
    }

    const populateLeftWall = (prods) => {
        const shuffledProd = Utility.shuffle(prods)
        setLeftWallShuffProd(shuffledProd)
    }

    const populateRightWall = (prods) => {
        const shuffledProd = Utility.shuffle(prods.slice())
        setRightWallShuffProd(shuffledProd)
    }
    
    const handleLoginShow = () => {
        setOpenProfMenuDlg(false)
        setShowLogin(true)
    }

    const handleLoginHide = () => {
        setShowLogin(false)
    }

    const handleLoginSuccess = () => {
        setShowLoginSuccessAlert(true)
        setTimeout(() => {
            setShowLoginSuccessAlert(false)
            window.location.reload()
        }, 1000)
    }

    const handleNavCartClick = () => {
        setIsOpenCart(true)
    }

    const handleNavOrdersClick = () => {
        setIsOpenOrders(true)
    }

    const handleBuyBtnClick = (product) => {
        setProductLicenseView(product)
        setOpenGetLicenseView(true)
    }

    const handleAddCart = () => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems'))
        setItemsOnCart(cartItems.length)
    }

    const handleOnCartItemRemoved = (itemCount) => {
        setItemsOnCart(itemCount)
    }

    const handleOnMiniCardClick = (product) => {
        setViewProduct(product)
    }

    const onHandleCommentAdded = async (newProduct) => {
        const newLeftWallProds = leftWallShuffProd.map(prod => prod._id === newProduct._id ? newProduct : prod)
        const newRightWallProds = rightWallShuffProd.map(prod => prod._id === newProduct._id ? newProduct : prod)

        setLeftWallShuffProd(newLeftWallProds)
        setRightWallShuffProd(newRightWallProds)
    }

    return (
        (isMobileView) ?
            <HomeMobile 
                windowProducts={leftWallShuffProd}
                hasNoMoreProductsLeft={hasNoMoreJFYProductsLeft}
            />
        :
            <div id="home-container" ref={containerRef} >

                <Login
                    _show={showLogin}
                    _onHide={handleLoginHide}
                    onLoginSuccess={handleLoginSuccess}
                />

                <TopBar onBlur={()=>console.log('blur')}/>

                <Row>
                    {/* Navigator */}
                    <Stack id="navigator-container" className="text-center p-2">
                        {/* item 1 */}
                        <div
                            className="d-flex"
                            onMouseEnter={(e) => {
                                setIsHoverOnProfNav(true)
                                setOpenProfMenuDlg(true)
                            }}
                            onMouseLeave={(e) => {
                                setIsHoverOnProfNav(false)
                                setOpenProfMenuDlg(true)
                            }}
                        >
                            {
                                (isHoverOnProfNav && openProfMenuDlg) ?
                                    <div className="pt-1 pb-1 ps-2 pe-2 rounded-2">
                                        <ProfileMenu
                                            user={user()}
                                            style={{
                                                position: 'absolute',
                                                left: '10%',
                                                top: '1%'
                                            }}
                                            onLoginClick={handleLoginShow}
                                            onClose={()=>setOpenProfMenuDlg(false)}
                                            onSignOut={()=>setShowSignOutSuccess(true)}
                                        />
                                        <ProfileIcon className="nav-ic primary-color"/>
                                    </div>
                                :
                                    <div className="pt-1 pb-1 ps-2 pe-2 rounded-2">
                                        <ProfileOutlineIcon
                                            className="nav-ic dark-color"
                                        />
                                    </div>
                            }
                        </div>
                        {/* item 2 */}
                        <div
                            onMouseEnter={(e) => {
                                setIsHoverOnHomeNav(true)
                            }}
                            onMouseLeave={(e) => {
                                setIsHoverOnHomeNav(false)
                            }}
                            onClick={(e) => {
                                setNavSelection({
                                    homeNavSelected: true,
                                    saveNavSelected: false,
                                    cartNavSelected: false
                                })
                            }}
                        >
                            {
                                (isHoverOnHomeNav) ?
                                    <div id={`${navSelection.homeNavSelected? 'nav-selected' : 'nav'}`} className="pt-1 pb-1 mt-3 ps-2 pe-2 rounded-2">
                                        <HomeIcon className="nav-ic primary-color"/>
                                    </div>
                                :
                                    <div id={`${navSelection.homeNavSelected? 'nav-selected' : 'nav'}`} className="pt-1 pb-1 mt-3 ps-2 pe-2 rounded-2">
                                        {
                                            (navSelection.homeNavSelected) ?
                                                <HomeIcon className="nav-ic primary-color"/>
                                            :
                                                <HomeOutlinedIcon className="nav-ic dark-color"/>
                                        }
                                    </div>
                            }
                        </div>
                        {/* item 3 */}
                        <div
                            onMouseEnter={(e) => {
                                setIsHoverOnSavesNav(true)
                            }}
                            onMouseLeave={(e) => {
                                setIsHoverOnSavesNav(false)
                            }}
                            onClick={(e) => {
                                setNavSelection({
                                    homeNavSelected: false,
                                    saveNavSelected: true,
                                    cartNavSelected: false
                                })

                                handleNavOrdersClick()
                            }}
                        >
                            {
                                (isHoverOnSavesNav) ?
                                    <div id={`${navSelection.saveNavSelected? 'nav-selected' : 'nav'}`} className="pt-1 pb-1 mt-3 ps-2 pe-2 rounded-2">
                                        <OrdersIcon className="nav-ic primary-color"/>
                                    </div>
                                :
                                    <div id={`${navSelection.saveNavSelected? 'nav-selected' : 'nav'}`} className="pt-1 pb-1 mt-3 ps-2 pe-2 rounded-2">
                                        {
                                            (navSelection.saveNavSelected)? 
                                                <OrdersIcon className="nav-ic primary-color"/>
                                            :
                                                <OrdersOutlineIcon className="nav-ic dark-color"/>
                                        }
                                    </div>
                            }
                        </div>
                        {/* item 4 */}
                        <div
                            onMouseEnter={(e) => {
                                setIsHoverOnCartNav(true)
                            }}
                            onMouseLeave={(e) => {
                                setIsHoverOnCartNav(false)
                            }}
                            onClick={(e) => {
                                setNavSelection({
                                    homeNavSelected: false,
                                    saveNavSelected: false,
                                    cartNavSelected: true
                                })

                                handleNavCartClick()
                            }}
                        >
                            {
                                (isHoverOnCartNav) ?
                                    <div id={`${navSelection.cartNavSelected? 'nav-selected' : 'nav'}`} className="pt-1 pb-1 mt-3 ps-2 pe-2 rounded-2">
                                        {(itemsOnCart>0)?
                                            <Badge badgeContent={itemsOnCart} color="primary">
                                                <CartIcon className="nav-ic primary-color"/>
                                            </Badge>
                                            :
                                            <CartIcon className="nav-ic primary-color"/>
                                        }
                                    </div>
                                :
                                    <div id={`${navSelection.cartNavSelected? 'nav-selected' : 'nav'}`} className="pt-1 pb-1 mt-3 ps-2 pe-2 rounded-2">
                                        {
                                            (navSelection.cartNavSelected) ?
                                                (itemsOnCart>0)?
                                                    <Badge badgeContent={itemsOnCart} color="primary">
                                                        <CartIcon className="nav-ic primary-color"/>
                                                    </Badge>
                                                :
                                                    <CartIcon className="nav-ic primary-color"/>
                                            :
                                            (itemsOnCart>0)?
                                                <Badge badgeContent={itemsOnCart} color="primary">
                                                    <CartOutlinedIcon className="nav-ic dark-color"/>
                                                </Badge>
                                                :
                                                <CartOutlinedIcon className="nav-ic dark-color"/>
                                        }
                                    </div>
                            }
                        </div>
                    </Stack>
                    {/* LEFT WALL */}
                    <div id="wall-grid-container" ref={leftWallRef} style={{
                        width: leftWallSize[0],
                        height: '100%',

                    }}>

                        <Banner/>

                        <h4 className="fw-bold ms-3 mt-3">Just For You!</h4>
                        <Container id="sh-con" className="w-100 pb-2" fluid>
                            {/* The shelves, where mini display of the product can be viewed */}
                            <Shelves spacing={3}>
                                {leftWallShuffProd.map(product =>
                                    <MiniCard
                                        key={product._id}
                                        product={product}
                                        onClick={handleOnMiniCardClick}
                                    />
                                )}
                                {!hasNoMoreJFYProductsLeft?
                                    <>
                                        <Skeleton className="mt-1 ms-2" variant="rounded" width={115} height={180} style={{position: 'absolute'}}/>
                                        <Skeleton className="mt-1 ms-2" variant="rounded" width={115} height={180} style={{position: 'absolute'}}/>
                                        <Skeleton className="mt-1 ms-2" variant="rounded" width={115} height={180} style={{position: 'absolute'}}/>
                                    </>
                                :
                                    <></>
                                }
                            </Shelves>
                        </Container>
                    </div>

                    <Col className="col-lg-8 col-md-7 col-sm-12"/>
                    {/* RIGHT WALL */}
                    <Col id="wall-container" className="col-lg-4 col-md-5 col-sm-12 d-flex justify-content-center" ref={rightWallRef}>
                        
                        {rightWallShuffProd.length!==0?
                            <RightWall products={rightWallShuffProd} onBuyBtnClick={handleBuyBtnClick} onCartAdd={handleAddCart}/>
                            :
                            (!hasNoMoreJFYProductsLeft ?
                                <Stack className="m-2">
                                    <div className="d-flex mt-2">
                                        <Skeleton className="mt-1" variant="circular" width={30} height={30}/>
                                        <Stack>
                                            <Skeleton className="mt-1 ms-2" variant="rounded" width="50%" height={10}/>
                                            <Skeleton className="mt-1 ms-2" variant="rounded" width="20%" height={10}/>
                                        </Stack>
                                    </div>
                                    <Skeleton className="mt-1" variant="rounded" width="100%" height={400}/>
                                </Stack>
                                :
                                <></>
                            )
                        }
                    </Col>
                </Row>
                
                <SnackBarAlert open={showLoginSuccessAlert} text="Login successful!" onClose={()=>setShowLoginSuccessAlert(false)}/>
                <SnackBarAlert open={showSignOutSuccess} text="Sign out successful!" onClose={()=>setShowSignOutSuccess(false)}/>

                {(isOpenCart)?
                    <Cart open={isOpenCart} onItemRemoved={handleOnCartItemRemoved} onClose={()=>{
                        setIsOpenCart(false)
                        setNavSelection({
                            homeNavSelected: true,
                            saveNavSelected: false,
                            cartNavSelected: false
                        })
                    }}/>
                    :
                    <></>
                }
                {(isOpenOrders)?
                    <Orders open={isOpenOrders} onClose={()=>{
                        setIsOpenOrders(false)
                        setNavSelection({
                            homeNavSelected: true,
                            saveNavSelected: false,
                            cartNavSelected: false
                        })
                    }}/>
                    :
                    <></>
                }
                
                <ViewProduct 
                    open={viewProduct!==undefined} 
                    product={viewProduct}
                    onBuyBtnClick={handleBuyBtnClick}
                    onCartAdd={handleAddCart}
                    onClose={()=>setViewProduct(undefined)}
                    onCommentAdded={onHandleCommentAdded}
                />
                <GetLicense
                    product={productLicenseView} 
                    open={openGetLicenseView} 
                    onClose={()=>setOpenGetLicenseView(false)}
                />

                <OpeningServer open={isFirstTimeOpen} />
                
            </div>
    )
}