import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Alert, Divider } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import { useContext } from "react";
import AppContext from "../AppContext";
import Utility from '../util/Utility'
import SnackBarAlert from "../components/SnackBarAlert";
import Loading from "../components/Loading";

const { checkEmailExistence, login, register } = require("../Requests").default;

export default function Register() {

    const navigate = useNavigate()
    const [isRegisterFailed, setIsRegisterFailed] = useState(false)
    const [isRegisterSuccessful, setIsRegisterSuccessful] = useState(false)

    const [showAlert, setShowAlert] = useState(false)
    const [showEmailAlert, setShowEmailAlert] = useState(false)
    const [isEmailWrongFormat, setIsEmailWrongFormat] = useState(false)
    const [showPasswordAlert, setShowPasswordAlert] = useState(false)

    const [fName, setFName] = useState('')
    const [fNameErr, setFNameErr] = useState(false)

    const [lName, setLName] = useState('')
    const [lNameErr, setLNameErr] = useState(false)

    const [suffix, setSuffix] = useState('')

    const [email, setEmail] = useState('')
    const [emailErr, setEmailErr] = useState(false)

    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState(false)

    const [confirmPass, setConfirmPass] = useState('')
    const [confirmPassErr, setConfirmPassErr] = useState(false)

    const [add1, setAdd1] = useState('')
    const [add2, setAdd2] = useState('')
    const [phone, setPhone] = useState('')

    const [isAgreed, setIsAgreed] = useState(false)
    const [isAgreedErr, setIsAgreedErr] = useState(false)

    const [isRegistering, setIsRegistering] = useState(false)

    const appContext = useContext(AppContext)
    const isMobile = appContext.isMobileView

    const handleFNameChange = (e) => {
        setShowAlert(false)
        setFName(e.target.value)
    }

    const handleLNameChange = (e) => {
        setShowAlert(false)
        setLName(e.target.value)
    }

    const handleSuffixChange = (e) => {
        setShowAlert(false)
        setSuffix(e.target.value)
    }

    const handleEmailChange = (e) => {
        setShowAlert(false)
        setEmail(e.target.value)
    }

    const handlePassChange = (e) => {
        setShowAlert(false)
        setPassword(e.target.value)
    }

    const handleConPassChange = (e) => {
        setShowAlert(false)
        setConfirmPass(e.target.value)
    }

    const handleAdd1Change = (e) => {
        setAdd1(e.target.value)
    }

    const handleAdd2Change = (e) => {
        setAdd2(e.target.value)
    }

    const handlePhoneChange = (e) => {
        setPhone(e.target.value)
    }

    const handleAgreedChange = (e) => {
        setShowAlert(false)
        if (e.target.checked) {
            setIsAgreedErr(false)
        }

        setIsAgreed(e.target.checked)
    }

    const handleRegisterBtnClick = async (e) => {

        e.preventDefault()

        let hasError= false
        if (fName.replace(new RegExp(' ', 'g'), '') === '') {
            hasError = true
            setFNameErr(true)
        }

        if (lName.replace(new RegExp(' ', 'g'), '') === '') {
            hasError = true
            setLNameErr(true)
        }
        
        if (email.replace(new RegExp(' ', 'g'), '') === '') {
            hasError = true
            setEmailErr(true)
        }
        
        if (password.replace(new RegExp(' ', 'g'), '') === '') {
            hasError = true
            setPasswordErr(true)
        }
        
        if (confirmPass.replace(new RegExp(' ', 'g'), '') === '') {
            hasError = true
            setConfirmPassErr(true)
        }

        if (!isAgreed) {
            hasError = true
            setIsAgreedErr(true)
        }

        // checks password
        if (!hasError && password !== confirmPass) {
            hasError = true
            setConfirmPassErr(true)
            setPasswordErr(true)
            setShowPasswordAlert(true)
        } else if (!hasError && password === confirmPass) {
            hasError = false
            setPasswordErr(false)
            setConfirmPassErr(false)
            setShowPasswordAlert(false)
        }

        if (hasError)
            {
                return setShowAlert(true)
            }

        // if all required informations were filled. Attempt to register
        setIsRegistering(true)
        const isWhiteSpaceOnly = Utility.isWhiteSpacesOnly(`${add1} ${add2}`)
        const address = isWhiteSpaceOnly ? '' : `${add1} ${add2}`.trim()
        const registered = await register({
            firstName: fName,
            lastName: lName,
            suffix: suffix,
            email: email,
            address: address,
            mobileNo: phone,
            password: password,
        })

        if (!registered) {
            setIsRegisterFailed(true)
            setShowAlert(true)

            return
        }
        // if the registration is successful
        setIsRegisterSuccessful(true)
        // try to login after successful registration
        const result = await login({
            email: email,
            password: password,
        })
        if (result.success) {
            localStorage.setItem('token', result.token)
            localStorage.setItem('user', JSON.stringify(registered))

            setTimeout(() => {
                navigate('/')
            }, 1000)
        }
    }

    return (
        <>
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={appContext.pageVariants}
                transition={appContext.pageTransition}
            >
                <div className="d-flex justify-content-center h-100">
                    <Row id="reg-root" className={(isMobile)?"w-100":"w-50"}>
                        <Col md="12" className="reg-form-root m-0 p-0 d-flex justify-content-center">
                            <Container id="reg-form-container" className="p-5" fluid>
                                <Link to="/">
                                    <ArrowBackIosIcon className="mb-3"/>
                                </Link>
                                <h3 id="reg-txt" className="m-0 p-0">Register</h3>
                                <label id="reg-label" className="m-0 p-0">Let's get you all set up!</label>
                                <Divider/>
                                <Form className="mt-4" action="submit">
                                    <Form.Group className="mb-3" controlId="fullName">
                                        <Row>
                                            <Col md="5" sm="12">
                                                <Form.Label>First Name *</Form.Label>
                                                <Form.Control className={(fNameErr)? 'error' : ''} onChange={handleFNameChange} onBlur={(e) => {
                                                    if (e.target.value.replace(new RegExp(' ', 'g'), '') === '') {
                                                        return setFNameErr(true)
                                                    }

                                                    return setFNameErr(false)
                                                }} type="name"/>
                                            </Col>
                                            <Col md="5" sm="12">
                                                <Form.Label>Last Name *</Form.Label>
                                                <Form.Control className={(lNameErr)? 'error' : ''} onChange={handleLNameChange} onBlur={(e) => {
                                                    if (e.target.value.replace(new RegExp(' ', 'g'), '') === '') {
                                                        return setLNameErr(true)
                                                    }

                                                    return setLNameErr(false)
                                                }} type="name"/>
                                            </Col>
                                            <Col md="2" sm="12">
                                                <Form.Label>Suffix</Form.Label>
                                                <Form.Control onChange={handleSuffixChange} type="name" placeholder="Jr./Sr./II/III" />
                                            </Col>
                                        </Row>
                                        
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email *</Form.Label>
                                        <Form.Control className={(emailErr)? 'error' : ''} onChange={handleEmailChange} onBlur={async (e) => {
                                            const value = e.target.value
                                            
                                            if (value.replace(new RegExp(' ', 'g'), '') === '') {
                                                return setEmailErr(true)
                                            }
                                            
                                            // check email existence
                                            const isExist = await checkEmailExistence(value)
                                            if (isExist) {
                                                setShowEmailAlert(true)
                                                return setEmailErr(true)
                                            }
                                            // check if email contains '@' and '.com'
                                            if (!(value.includes('@') &&
                                                value.includes('.com')))
                                                {
                                                    setIsEmailWrongFormat(true)
                                                    setShowEmailAlert(true)
                                                    return setEmailErr(true)
                                                }

                                            setShowEmailAlert(false)
                                            return setEmailErr(false)
                                        }} type="email" />
                                        {(showEmailAlert) ?
                                            <Alert severity="error">
                                                {(isEmailWrongFormat) ?
                                                    'Email is invalid -- Please choose a valid email!'
                                                    :
                                                    'Email is already registered -- Please provide another email!'
                                                }
                                            </Alert>
                                            :
                                            <></>
                                        }
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password">
                                        <Row>
                                            <Col md="6">
                                                <Form.Label>Password *</Form.Label>
                                                <Form.Control onChange={handlePassChange} className={(passwordErr)? 'error mb-3' : 'mb-3'} 
                                                onBlur={(e) => {
                                                    const pass = e.target.value
                                                    
                                                    if (pass.replace(new RegExp(' ', 'g'), '') === '') {
                                                        return setPasswordErr(true)
                                                    }

                                                    return setPasswordErr(false)
                                                }} type="password"/>
                                            </Col>
                                            <Col md="6">
                                                <Form.Label>Confirm Password *</Form.Label>
                                                <Form.Control className={(confirmPassErr)? 'error' : ''} onChange={handleConPassChange} 
                                                onBlur={(e) => {
                                                    const value = e.target.value
                                                    
                                                    if (password === '') {
                                                        setConfirmPassErr(true)
                                                        return setPasswordErr(true)
                                                    }
                                                    // if password does not match
                                                    if (value !== password) {
                                                        setShowPasswordAlert(true)
                                                        setConfirmPassErr(true)
                                                        return setPasswordErr(true)
                                                    }

                                                    setPasswordErr(false)
                                                    setShowPasswordAlert(false)
                                                    return setConfirmPassErr(false)
                                                }} type="password"/>
                                            </Col>
                                            {(showPasswordAlert) ?
                                                <Alert severity="error">Password does not match -- Please check !</Alert>
                                                :
                                                <></>
                                            }
                                        </Row>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="billingAddress">
                                        <Row>
                                            <Form.Label>Address</Form.Label>
                                            <Form.Text className="text-muted">We use your address for fraud prevention purposes.</Form.Text>
                                        </Row>
                                        <Form.Control onChange={handleAdd1Change} className="mb-2" type="address" placeholder="Address 1" />
                                        <Form.Control onChange={handleAdd2Change} type="address" placeholder="Address 2" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="phone">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control onChange={handlePhoneChange} type="phoneNumber"/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Form.Check id="pri-term-chk mt-2" className={(isAgreedErr)? 'error' : ''} onChange={handleAgreedChange} type="checkbox" label={
                                            <span id="pri-term">
                                                By checking, I agree to the <a href="/privacy-policy">Privacy Policy</a>, <a href="/terms-condition">Terms and Condition</a>
                                            </span>
                                        } />
                                    </Form.Group>
                                    <Button id="reg-btn" type="submit" className="rounded-5 px-4" onClick={handleRegisterBtnClick} onSubmit={handleRegisterBtnClick}>
                                        Register
                                    </Button>
                                </Form>
                            </Container>
                            
                        </Col>
                    </Row>

                </div>
            </motion.div>
            <SnackBarAlert text={
                (isRegisterFailed)?
                    'Registration failed -- Try again!'
                    :
                    'Missing information — Please provide the missing information!'
            } open={showAlert} severity="error" onClose={()=>setShowAlert(false)} 
            />

            <SnackBarAlert text="Registration Successful!" open={isRegisterSuccessful} onClose={()=>setIsRegisterSuccessful(false)}/>
            <Loading open={isRegistering} text="Registering your information..." />
        </>
    )
}