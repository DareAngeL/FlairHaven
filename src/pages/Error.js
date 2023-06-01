import { Container, Stack } from "react-bootstrap";

export default function Error() {
    return (
        <Container>
            <Stack className="d-flex justify-content-center align-items-center text-center" style={{height: '100vh'}}>
                <h1 style={{color: 'red'}}><b>🚫 Access Denied! 403 Forbidden! 🚫</b></h1>
                <h2 className="mt-5">
                    Oh no! It seems you've stumbled upon the dreaded 403 Forbidden error. We apologize for the inconvenience, 
                    but it appears that the path you've taken leads to a restricted area of our concept website.
                </h2>
            </Stack>
        </Container>
    )
}