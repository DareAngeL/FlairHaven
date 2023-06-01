import { Stack } from "react-bootstrap";
import ForwardArrowIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CheckoutItemFragment from "../components/CheckoutItemFragment";
import { useEffect, useState } from "react";
import { Alert, Backdrop, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../AppContext";

export default function Cart(props) {

    const { 
        open=false, 
        onClose, 
        onItemRemoved,
    } = props

    const appContext = useContext(AppContext)
    const isMobile = appContext.isMobileView

    const [products , setProducts] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const cartProducts = JSON.parse(localStorage.getItem('cartItems'))
        if (!cartProducts) {
            return
        }

        setProducts(cartProducts)
        
    }, [])

    const handleOnCheckOut = () => {
        navigate('/checkout/fromCart/true')
    }

    const handleOnRemoved = (_product) => {
        const updatedProds = products.filter(prod => prod._id !== _product._id)
        localStorage.setItem('cartItems', JSON.stringify(updatedProds))
        setProducts(updatedProds)
        onItemRemoved(updatedProds.length)
    }

    return (
        <Backdrop
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'rgba(255, 255, 255, 0.8)'
            }}
            open={open}
        >
                <Stack id={isMobile?"cart-root-mobile":"cart-root"} className={(open)?"cart-open":""}>
                    <div className="p-2 d-flex align-items-center">
                        <div id="cart-closebtn" onClick={onClose}>
                            <CloseIcon/>
                        </div>
                        <h1 className="fw-bold ms-3">Basket</h1>
                        <div className="ms-auto d-flex">
                            {products.length===0?
                                <Tooltip title="Your basket is empty!">
                                    <h5 id="cart-checkout-disabled">Checkout</h5>
                                </Tooltip>
                                :
                                <h5 id="cart-checkout" onClick={handleOnCheckOut}>Checkout</h5>
                            }
                            <ForwardArrowIcon fontSize="16px" className="mx-1 mt-1"/>
                        </div>
                    </div>
                    <hr className="h-divider"/>
                    <Alert severity="info" className="">The user is granted a non-exclusive license to use the digital art for commercial purposes,
                    including but not limited to product packaging, advertising, and promotional materials.
                    The user is prohibited from reselling or distributing the digital art to third parties without prior written consent from the licensor.
                    </Alert>
                    <div className="px-4">
                        {products.map(prod => <CheckoutItemFragment key={prod._id} product={prod} onRemoved={handleOnRemoved}/>)}
                    </div>
                </Stack>
        </Backdrop>
    )
}