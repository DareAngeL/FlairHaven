import { Col, Row } from "react-bootstrap";
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useEffect } from "react";
import { useState } from "react";
import Utility from "../util/Utility";

export default function DashReport(props) {

    const {
        totalRevenue,
        availableProducts,
        allProducts
    } = props

    const [revenueShortForm, setRevenueShortForm] = useState('')
    const [allProductsShortForm, setAllProductsShortForm] = useState('')
    const [availableProductsShortForm, setAvailableProductsShortForm] = useState('')

    const {shortTermVersion} = Utility

    useEffect(() => {
        setRevenueShortForm(shortTermVersion(totalRevenue))
        setAllProductsShortForm(shortTermVersion(allProducts))
        setAvailableProductsShortForm(shortTermVersion(availableProducts))
    }, [allProducts, availableProducts, shortTermVersion, totalRevenue])

    return (
        <Row id="dash-report-root" className="rounded-1">
            {/* Followers */}
            <Col md="4" className="d-flex align-items-center">
                <div className="me-2">
                    <div className="dash-r-ic-container p-3 primary-bg-color rounded-5">
                        <FollowTheSignsIcon className="dash-r-ic"/>
                    </div>
                </div>
                <Row className="d-flex">
                    <Col md="12" >
                        <label className="w100">Total Revenue</label>
                    </Col>
                    <Col md="12" className="bg-12">
                        <h2 className="w-100">{revenueShortForm}</h2>
                    </Col>
                </Row>
            </Col>
            {/* Available Products */}
            <Col md="4" className="d-flex align-items-center">
                <div className="me-2">
                    <div id="allProd" className="dash-r-ic-container p-3 yellow-orange-bg rounded-5">
                        <CategoryRoundedIcon className="dash-r-ic"/>
                    </div>
                </div>
                <Row className="d-flex">
                    <Col md="12" >
                        <label className="w100">Available Products</label>
                    </Col>
                    <Col md="12" className="bg-12">
                        <h2 className="w-100">{availableProductsShortForm}</h2>
                    </Col>
                </Row>
            </Col>
            {/* All Products */}
            <Col md="4" className="d-flex align-items-center">
                <div className="me-2">
                    <div className="dash-r-ic-container p-3 green-bg rounded-5">
                        <CategoryRoundedIcon id="dash-r-all" className="dash-r-ic"/>
                    </div>
                </div>
                <Row className="d-flex">
                    <Col md="12" >
                        <label className="w100">All Products</label>
                    </Col>
                    <Col md="12" className="bg-12">
                        <h2 className="w-100">{allProductsShortForm}</h2>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}