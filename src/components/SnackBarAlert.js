import { Alert, Snackbar } from "@mui/material";

export default function SnackBarAlert(props) {

    const {
        open=false,
        severity="success",
        onClose,
        text="This is a success message!"
    } = props

    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {text}
            </Alert>
        </Snackbar>
    )
}