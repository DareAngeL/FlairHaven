import { Alert, Divider } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Utility from "../util/Utility";
import Loading from "../components/Loading";

const { getUserDetail, login } = require("../Requests").default;

export default function Login(props) {

    const [email, setEmail] = useState('')
    const [emailErr, setEmailErr] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState(false)

    const [showAlert, setShowAlert] = useState(false)
    const [error, setError] = useState('')
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    let {
        _show=false,
        _onHide,
        onLoginSuccess
    } = props

    const handleOnEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleOnPassChange = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        let hasError = false

        if (Utility.isWhiteSpacesOnly(email)) {
            hasError = true
            setEmailErr(true)
        }
        if (Utility.isWhiteSpacesOnly(password)) {
            hasError = true
            setPasswordErr(true)
        }
        if (hasError) {
            return
        }

        setIsLoggingIn(true)

        const result = await login({
            email: email,
            password: password
        })

        if (result.success) {
            setIsLoggingIn(false)
            const userInfo = await getUserDetail(result.token)
            localStorage.setItem('user', JSON.stringify(userInfo))
            localStorage.setItem('token', result.token)
            _onHide() // invoke to hide the login view
            onLoginSuccess()
            return
        }

        // if login is not successful
        setError(result.msg)
        setShowAlert(true)
        setIsLoggingIn(false)
    }

    return (
        <Modal className="modal-container" show={_show} onHide={_onHide}>
            <Modal.Body>
                <h3 className="text-center mb-4 fw-bold">Login</h3>
                <Form className="text-center" action="submit">
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <div className="d-flex justify-content-center">
                            <Form.Control 
                                className={(emailErr) ?"login-control error mb-3 rounded-5":"login-control mb-3 rounded-5"}
                                type="email"
                                onFocus={() => {
                                    setEmailErr(false)
                                    setShowAlert(false)
                                }}
                                onChange={handleOnEmailChange}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <div className="d-flex justify-content-center">
                            <Form.Control
                                className={(passwordErr) ?"login-control error rounded-5":"login-control rounded-5"}
                                type="password"
                                onFocus={() => {
                                    setPasswordErr(false)
                                    setShowAlert(false)
                                }}
                                onChange={handleOnPassChange}
                            />
                        </div>
                        <Form.Text>Can't remember your password? <Link to="/reset-pass">Reset Password</Link></Form.Text>
                    </Form.Group>

                    <Form.Group controlId="footer">
                        {/* Login Button */}
                        <Button 
                            id="log-btn"
                            type="submit"
                            className="primary-bg-color px-5 mb-3 mt-3 rounded-5 border-0"
                            onClick={handleLogin}
                            onSubmit={handleLogin}
                        >
                            Login
                        </Button>

                        <Form.Group className="login-divider-parent mb-3">
                            <Divider variant="middle"/>
                            <Form.Text className="login-divider">Or login with</Form.Text>
                        </Form.Group>

                        <Form.Group className="soc-med-ic d-flex justify-content-center">
                            <Link to={'/facebook_login'}>
                                <FacebookIcon className="fb-ic mb-3 mx-2"/>
                            </Link>
                            <Link to={'/google_login'}>
                                <EmailIcon className="mail-ic mx-2"/>
                            </Link>
                        </Form.Group>

                        <Form.Group className="login-divider-parent mb-3">
                            <Divider variant="middle"/>
                            <Form.Text className="login-divider-accnt">Don't have account yet?</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Link id="reg-link" to="/register">Register</Link>
                        </Form.Group>
                    </Form.Group>
                </Form>
                {(showAlert) ?
                    <Alert severity="error">{error}</Alert>
                    :
                    <></>
                }
                <Loading open={isLoggingIn} text="Logging in..."/>
            </Modal.Body>
        </Modal>
    )
}