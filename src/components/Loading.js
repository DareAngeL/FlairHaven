import { Backdrop, CircularProgress } from "@mui/material";

export default function Loading(props) {

    const {
        text='Please wait...',
        open=false
    } = props

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <CircularProgress color="inherit" />
            <label className="mx-3">{text}</label>
        </Backdrop>
    )
}