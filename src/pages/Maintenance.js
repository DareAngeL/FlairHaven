import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Container, Stack } from "react-bootstrap";

export default function Maintenance() {

    return (
        <Container>
            <Stack id="maintenance-container" className="d-flex justify-content-center align-items-center text-center">
                <h1><b>🚧 Whoops! Looks like this page is still under construction! 🚧</b></h1>
                <div>
                    <lottie-player
                        autoplay
                        loop
                        mode="normal"
                        src="https://raw.githubusercontent.com/DareAngeL/lottiefiles/main/maintenance.json"
                        style={{width: '300px'}}
                    />
                </div>
                <label id="mtenance-lbl" className="mt-3">
                    Since this website is just a concept, this particular page is just a figment of my imagination at the moment. 
                    In the meantime, feel free to explore the rest of our concept-filled wonderland. We promise it's more than just a flight of fancy!
                </label>
                <br/>
                <label>Remember: Rome wasn't built in a day, and neither was this webpage! 😉</label>
            </Stack>
        </Container>
    )
}