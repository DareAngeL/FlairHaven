import { Backdrop } from "@mui/material";
import WallFragment from "./WallFragment";
import { useContext } from "react";
import AppContext from "../AppContext";
import CloseIcon from '@mui/icons-material/CloseRounded';

export default function ViewProduct(props) {

    const {
        open=true,
        product,
        onClose,
        onBuyBtnClick, 
        onCartAdd=()=>{},
        onCommentAdded=()=>{}
    } = props

    const appContext = useContext(AppContext)

    /**
     * Used to avoid closing the backdrop when the children of the backdrop is clicked
     * @param {*} e 
     */
    const handleContainerClick = (e) => {
        e.stopPropagation()
    }

    return (
        <Backdrop
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'rgba(255, 255, 255, 0.8)',
            }}
            open={open}
            onClick={onClose}
        >
            {(open)?
                <div id={(appContext.isMobileView)?"vp-container-mobile":"vp-container"} onClick={handleContainerClick}>
                    {appContext.isMobileView?
                        <div className="mt-3 ms-2" onClick={onClose}>
                            <CloseIcon/>
                        </div>
                        :
                        <></>
                    }
                    <WallFragment 
                        product={product} 
                        onBuyBtnClick={onBuyBtnClick} 
                        onCartAdd={onCartAdd}
                        onCommentAdded={onCommentAdded}
                    />
                </div>
                :
                <></>
            }
        </Backdrop>
    )
}