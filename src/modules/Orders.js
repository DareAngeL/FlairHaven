import { Backdrop } from "@mui/material";
import { Stack } from "react-bootstrap";
import { CloseRounded } from "@mui/icons-material";
import OrderFragment from "../components/OrderFragment";
import { useState, useEffect, useContext } from "react";
import AppContext from "../AppContext";
import BDropMaintenance from "./BDropMaintenance";
import { useNavigate } from "react-router-dom";

const { getOrders } = require("../Requests").default;

export default function Orders(props) {

    const {
        open=true,
        onClose
    } = props

    const navigate = useNavigate()

    const appContext = useContext(AppContext)
    const isMobile = appContext.isMobileView

    const [products, setProducts] = useState([])
    const [openBDropMaintenance, setOpenBDropMaintenance] = useState(false)

    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem('orders'))

        const fetchOrders = async () => {
            const products = await getOrders(localStorage.getItem('token'))
            if (products) {
                setProducts(products)
            }
        }

        if (orders) {
            setProducts(orders)
        } else {
            fetchOrders()
        }

    }, [])

    return (
        <Backdrop
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'rgba(255, 255, 255, 0.8)'
            }}
            open={open}
        >
            <Stack id={isMobile?"o-root-mobile":"o-root"} className={(open)?"cart-open p-2":"p-2"}>
                <div className="d-flex align-items-center">
                    <div id="o-closebtn" onClick={()=>onClose()}>
                        <CloseRounded/>
                    </div>
                    <h1 className="mx-2">Library</h1>
                </div>
                <hr className="h-divider"/>
                {products.map(prod =>
                    <div key={prod._id}>
                        <OrderFragment key={prod._id} product={prod} onDownloadClick={()=>navigate('/download')}/>
                        <hr className="h-divider"/>
                    </div>
                )}
            </Stack>
            <BDropMaintenance
                isOpen={openBDropMaintenance}
                onClose={()=>setOpenBDropMaintenance(false)}
            />
        </Backdrop>
    )
}