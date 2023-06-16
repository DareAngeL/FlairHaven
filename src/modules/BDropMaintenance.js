import { Backdrop } from "@mui/material";
import Maintenance from "../pages/Maintenance"

export default function BDropMaintenance(props) {

    const {
        isOpen=false,
        onClose=()=>{}
    } = props

    const handleOnClose = () => {
        onClose()
    }

    return (
        <Backdrop
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'rgba(255, 255, 255, 0.6)'
            }}
            open={isOpen}
            onClick={handleOnClose}
        >
            <div className="bg-white px-3">
                <Maintenance/>
            </div>
        </Backdrop>
    )
}