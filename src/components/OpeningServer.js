import { Alert, Backdrop } from "@mui/material";
import * as LottiePlayer from "@lottiefiles/lottie-player";

export default function OpeningServer(props) {

    const {
        open=false,
    } = props

    return (
        <Backdrop
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.5)'
            }}
            open={open}
        >
            <div>
                <div id="op-server-root" className="text-center d-flex flex-column align-items-center justify-content-center">
                    <lottie-player
                        autoplay
                        loop
                        mode="normal"
                        src="https://raw.githubusercontent.com/DareAngeL/lottiefiles/main/loading-server.json"
                        style={{width: '300px'}}
                    />

                    <label className="mt-1">Please wait...</label>
                    <Alert className="mt-4" severity="info">
                        I am hosting my server on a free hosting site.
                        Since I am using the free plan, my server may go to sleep when it is not in use. <br/>
                        We are currently waking up the server from sleeping. Thank you for your patience!
                    </Alert>
                </div>
            </div>
        </Backdrop>
    )   
}