import { Button, Col, Row } from "react-bootstrap";
import { Alert } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sellerIntroCover } from "../res/Res";
import AppContext from "../AppContext";
import { useEffect } from "react";
import Utility from "../util/Utility";

const { convertToDesigner, hasAccess } = require("../Requests").default;

export default function SellerIntro() {

    const navigate = useNavigate()
    const appContext = useContext(AppContext)

    const { isMobileView } = appContext

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        hasAccess(localStorage.getItem('token')).then(hasAccess => {
            if (!hasAccess) {
                navigate('/error')
            }
        })
    }, [])

    const handleSellNowClick = async () => {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        const result = await convertToDesigner(token)

        if (result) {
            localStorage.setItem('user', JSON.stringify(result.user))
            localStorage.setItem('token', result.access)

            setTimeout(() => {
                setIsLoading(false)
                navigate('/dashboard')
            }, 1000)
            return
        }

        // if unable to convert to designer account
        setIsLoading(false)
        setIsError(true)
    }

    return (
        <div className="d-flex justify-content-center">
            <div className={isMobileView?"w-100":"w-50"}>
                <img id="s-intro-cover" width="100%" src={sellerIntroCover} alt="introcover"/>
                <div className="mt-4 p-3 rounded-3 bg-white">
                    <h4>Convert your account into a designer account?</h4>
                    <Row>
                        <Col md="2" className="d-flex justify-content-center align-items-center">
                            <Button id="s-intro-sell-btn" size="sm" className="px-3 rounded-5 border-0" onClick={handleSellNowClick}>Convert Now!</Button>
                        </Col>
                        <Col md="10">
                            <label>
                                By clicking "Convert Now!", you opt to convert your current account into a designer account.
                                This action cannot be undone.
                            </label>
                        </Col>
                    </Row>
                </div>
            </div>
            {(isError) ?
                <Alert severity="error" style={{
                    position: 'absolute',
                }}>Something went wrong! Unable to convert your account</Alert>
                :
                <></>
            }
            {(isLoading) ?
                <div className="loading"/>
                :
                <></>
            }
        </div>
    )
}