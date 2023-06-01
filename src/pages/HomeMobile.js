import { useRef, useState } from "react";
import TopBar from "../components/TopBar";
import Login from "../modules/Login";
import { Container, Stack } from "react-bootstrap";
import ProfileMenu from "../modules/ProfileMenu";
import { useContext } from "react";
import AppContext from "../AppContext";
import HomeIcon from '@mui/icons-material/HomeRounded';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ProfileOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import ProfileIcon from '@mui/icons-material/PersonRounded';
import OrdersOutlineIcon from '@mui/icons-material/Inventory2Outlined';
import OrdersIcon from '@mui/icons-material/Inventory2Rounded';
import CartOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import CartIcon from '@mui/icons-material/ShoppingBasketRounded';
import { Alert, Badge, Skeleton } from "@mui/material";
import Cart from "../modules/Cart";
import Orders from "../modules/Orders";
import ViewProduct from "../modules/ViewProduct";
import GetLicense from "../modules/GetLicense";
import Banner from "../components/Banner";
import FeedViewIcon from '@mui/icons-material/ViewAgenda';
import WindowViewIcon from '@mui/icons-material/ViewCompactAlt';
import Shelves from "../modules/Shelves";
import MiniCard from "../components/MiniCard";
import { useEffect } from "react";
import Utility from "../util/Utility";
import RightWall from "../modules/RightWall";

export default function HomeMobile(props) {

    const appContext = useContext(AppContext)

    const {
        windowProducts,
        hasNoMoreProductsLeft
    } = props

    const ViewStyleType = {
        GRIDVIEW: 1,
        LISTVIEW: 0
    }

    const profileRef = useRef(null)
    const profileMenuRef = useRef(null)

    const [showLogin, setShowLogin] = useState(false)
    const [showLoginSuccessAlert, setShowLoginSuccessAlert] = useState(false)
    const [isShowProfNav, setShowProfNav] = useState(false)
    const [isClickOnHomeNav, setIsClickOnHomeNav] = useState(false)
    const [isOpenOrders, setIsOpenOrders] = useState(false)
    const [isOpenCart, setIsOpenCart] = useState(false)
    const [itemsOnCart, setItemsOnCart] = useState(0)
    const [viewProduct, setViewProduct] = useState(undefined)
    const [productLicenseView, setProductLicenseView] = useState({})
    const [openGetLicenseView, setOpenGetLicenseView] = useState(false)

    const [viewStyle, setViewStyle] = useState(ViewStyleType.GRIDVIEW)

    const [feedViewProduct, setFeedViewProduct] = useState([])

    const [profMenuPosition, setProfMenuPosition] = useState({
        TOP: 0,
        LEFT: 0
    })

    useEffect(() => {
        const profileElem = profileRef.current
        const profileRect = profileElem.getBoundingClientRect();

        // calc the position of the profile menu next to the profile
        setProfMenuPosition({
            TOP: profileRect.top,
            LEFT: profileRect.right - 33
        })

    }, [isShowProfNav])

    const handleProfMenuOutsideClick = (e) => {
        const profileMenuElem = profileMenuRef.current
        if (!profileMenuElem)
            return

        const isClickInsideProfMenu = profileMenuElem.contains(e.target)
        if (!isClickInsideProfMenu) {
            setShowProfNav(false)
        }
    }

    const handleLoginHide = () => {
        setShowLogin(false)
    }
    const handleLoginShow = () => {
        setShowLogin(true)
    }
    const handleNavOrdersClick = () => {
        setIsOpenOrders(true)
    }

    const handleNavOrdersClose = (e) => {
        setNavSelection({
            homeNavSelected: true,
            saveNavSelected: false,
            cartNavSelected: false
        })

        setIsOpenOrders(false)
    }

    const handleNavCartClose = (e) => {
        setNavSelection({
            homeNavSelected: false,
            saveNavSelected: false,
            cartNavSelected: true
        })

        setIsOpenCart(true)
    }

    const handleLoginSuccess = () => {
        setShowLoginSuccessAlert(true)
        setTimeout(() => {
            setShowLoginSuccessAlert(false)
        }, 1000)
    }

    const handleAddCart = () => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems'))
        setItemsOnCart(cartItems.length)
    }

    const handleOnCartItemRemoved = (itemCount) => {
        setItemsOnCart(itemCount)
    }

    const handleBuyBtnClick = (product) => {
        setProductLicenseView(product)
        setOpenGetLicenseView(true)
    }

    const handleOnMiniCardClick = (product) => {
        setViewProduct(product)
    }

    const handleClickFeedView = () => {
        setViewStyle(ViewStyleType.LISTVIEW)
        if (feedViewProduct.length === 0) {
            const shuffled = Utility.shuffle(windowProducts)
            setFeedViewProduct(shuffled)
        }
    }

    const handleClickWindowView = () => {
        setViewStyle(ViewStyleType.GRIDVIEW)
    }

    const [navSelection, setNavSelection] = useState({
        homeNavSelected: true,
        saveNavSelected: false,
        cartNavSelected: false
    })

    const navMobileICStyle = {
        fontSize: "30px",
    }

    return (
        <Stack id="home-container">
            <Login
                _show={showLogin}
                _onHide={handleLoginHide}
                onLoginSuccess={handleLoginSuccess}
            />
            <TopBar isMobileView={appContext.isMobileView} isSmallScreenMobile={appContext.isSmallScreenMobile}/>

            {/* Navigator */}
            <div id="nav-m-container" className="d-flex justify-content-center align-items-center text-center pt-3">
                {/* Profile Menu Dropdown */}
                <div
                    ref={profileRef}
                    className="d-flex mx-4 rounded-3"
                    onClick={(e) => {
                        setShowProfNav(!isShowProfNav)
                    }}
                >
                    {
                        (isShowProfNav) ?
                            <div className="rounded-2">
                                <ProfileMenu
                                    containerRef={profileMenuRef}
                                    user={appContext.user()}
                                    style={{
                                        position: 'absolute',
                                        left: profMenuPosition.LEFT + 'px',
                                        top: profMenuPosition.TOP + 'px',
                                        zIndex: 9999
                                    }}
                                    onLoginClick={handleLoginShow}
                                    onBlur={(e)=>{setShowProfNav(false)}}
                                />
                                <ProfileIcon
                                    fontSize="large" 
                                    className="nav-m-ic primary-color"
                                    style={navMobileICStyle}
                                />
                            </div>
                        :
                        <div className=" rounded-2">
                            <ProfileOutlineIcon
                                className="nav-m-ic dark-color"
                                style={navMobileICStyle}
                            />
                        </div>
                    }
                </div>
                {/* item 1 */}
                <div
                    className="mx-4"
                    onMouseEnter={(e) => {
                        setIsClickOnHomeNav(true)
                    }}
                    onMouseLeave={(e) => {
                        setIsClickOnHomeNav(false)
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
                        (isClickOnHomeNav) ?
                            <div id={`${navSelection.homeNavSelected? 'nav-selected' : 'nav'}`} className="rounded-2">
                                <HomeIcon className="nav-m-ic primary-color" style={navMobileICStyle}/>
                            </div>
                        :
                            <div id={`${navSelection.homeNavSelected? 'nav-selected' : 'nav'}`} className="rounded-2">
                                {
                                    (navSelection.homeNavSelected) ?
                                        <HomeIcon 
                                            className="nav-m-ic primary-color"
                                            style={navMobileICStyle}    
                                        />
                                    :
                                        <HomeOutlinedIcon 
                                            className="nav-m-ic dark-color"
                                            style={navMobileICStyle}
                                        />
                                }
                            </div>
                    }
                </div>
                {/* item 2 */}
                <div
                    className="mx-4"
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
                        (isOpenOrders) ?
                            <div id={`${navSelection.saveNavSelected? 'nav-selected' : 'nav'}`} className="rounded-2">
                                <OrdersIcon className="nav-ic primary-color" style={navMobileICStyle}/>
                            </div>
                        :
                            <div id={`${navSelection.saveNavSelected? 'nav-selected' : 'nav'}`} className="rounded-2">
                                {
                                    (navSelection.saveNavSelected)? 
                                        <OrdersIcon className="nav-ic primary-color" style={navMobileICStyle}/>
                                    :
                                        <OrdersOutlineIcon className="nav-ic dark-color" style={navMobileICStyle}/>
                                }
                            </div>
                    }
                </div>
                {/* item 3 */}
                <div
                    className="mx-4"
                    onClick={handleNavCartClose}
                >
                    {
                        (isOpenCart) ?
                            <div id={`${navSelection.cartNavSelected? 'nav-selected' : 'nav'}`} className="rounded-2">
                                {(itemsOnCart>0)?
                                    <Badge badgeContent={itemsOnCart} color="primary">
                                        <CartIcon className="nav-ic primary-color" style={navMobileICStyle}/>
                                    </Badge>
                                    :
                                    <CartIcon className="nav-ic primary-color" style={navMobileICStyle}/>
                                }
                            </div>
                        :
                            <div id={`${navSelection.cartNavSelected? 'nav-selected' : 'nav'}`} className="rounded-2">
                                {
                                    (navSelection.cartNavSelected) ?
                                        (itemsOnCart>0)?
                                            <Badge badgeContent={itemsOnCart} color="primary">
                                                <CartIcon className="nav-ic primary-color" style={navMobileICStyle}/>
                                            </Badge>
                                        :
                                            <CartIcon className="nav-ic primary-color" style={navMobileICStyle}/>
                                    :
                                    (itemsOnCart>0)?
                                        <Badge badgeContent={itemsOnCart} color="primary">
                                            <CartOutlinedIcon className="nav-ic dark-color" style={navMobileICStyle}/>
                                        </Badge>
                                        :
                                        <CartOutlinedIcon className="nav-ic dark-color" style={navMobileICStyle}/>
                                }
                            </div>
                    }
                </div>
                {/*  */}
                {viewStyle === ViewStyleType.GRIDVIEW ?
                    <div id="m-view-selectorbtn" className="mx-4" onClick={handleClickFeedView}>
                        <FeedViewIcon/>
                    </div>
                    :
                    <div
                        id="nav-m-win"
                        className="d-flex mx-4 rounded-3"
                        onClick={handleClickWindowView}
                    >
                        <WindowViewIcon fontSize="large"/>
                    </div>
                }
            </div>
            
            {viewStyle === ViewStyleType.GRIDVIEW?
                <div onClick={handleProfMenuOutsideClick}>
                    <Banner/>
                    <div className="d-flex align-items-center">
                        <h3 className="mt-2 ms-2">Just For You!</h3>
                    </div>
                    <Container id="sh-con" className="w-100 pb-2" fluid>
                        {/* The shelves, where mini display of the product can be viewed */}
                        <Shelves spacing={3}>
                            {windowProducts.map(product =>
                                <MiniCard
                                    key={product._id}
                                    product={product}
                                    onClick={handleOnMiniCardClick}
                                />
                            )}
                            {!hasNoMoreProductsLeft ?
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
                :
                <div onClick={handleProfMenuOutsideClick}>
                {/* Right Wall */}
                    <RightWall products={feedViewProduct} onBuyBtnClick={handleBuyBtnClick} onCartAdd={handleAddCart}/>
                </div>
            }

            {(showLoginSuccessAlert) ?
                <Alert severity="success" style={{
                    position: 'absolute',
                    width: '300px',
                    bottom: 10,
                    right: 0,
                }}>Login Successful!</Alert>
                :
                <></>
            }
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
                <Orders open={isOpenOrders} onClose={handleNavOrdersClose}/>
                :
                <></>
            }
            <ViewProduct 
                open={viewProduct!==undefined} 
                product={viewProduct}
                onBuyBtnClick={handleBuyBtnClick}
                onCartAdd={handleAddCart}
                onClose={()=>setViewProduct(undefined)}
            />

            <GetLicense 
                product={productLicenseView} 
                open={openGetLicenseView} 
                onClose={()=>setOpenGetLicenseView(false)}
            />
        </Stack>
    )
}