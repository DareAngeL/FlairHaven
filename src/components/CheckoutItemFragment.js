/* eslint-disable react-hooks/exhaustive-deps */
import { Stack } from "react-bootstrap";
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useState } from "react";
import Loading from "./Loading";

const { removeProductInCart } = require('../Requests').default;

export default function CheckoutItemFragment(props) {

    const { product, onRemoved } = props

    const [isHover, setIsHover] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)

    const handleDeleteProduct = async () => {
        setIsRemoving(true)
        const isDeleted = await removeProductInCart(product._id, localStorage.getItem('token'))
        
        if (isDeleted===true) {

            setIsRemoving(false)
            onRemoved(product)
        }

        setIsRemoving(false)
    }

    const handleMouseHover = (hover) => {
        setIsHover(hover)
    }

    return (
        <Stack className="mt-3" onMouseEnter={()=>handleMouseHover(true)} onMouseLeave={()=>handleMouseHover(false)}>
            <div className="d-flex">
                <h3>{product.name}</h3>
                <h3 className="ms-auto">${product.price.toFixed(2)}</h3>
                {(isHover) ?
                    <div id="c-i-deletebtn" className="px-2" onClick={handleDeleteProduct}>
                        <CloseIcon/>
                    </div>
                    :
                    <></>
                }
            </div>
            <div>
                <h4>{product.creatorName}</h4>
            </div>
            <hr className="h-divider w-100"/>

            <Loading open={isRemoving} text="Removing a product from your cart..." />
        </Stack>
    )
}