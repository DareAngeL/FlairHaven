import { Button, Col, Row } from "react-bootstrap";
import DashProducts from "../modules/DashProducts";
import DashReport from "../modules/DashReport";
import TopBar from "../components/TopBar";
import FilterButton from "../components/FilterButton";
import SearchBar from "../components/SearchBar";
import AddProduct from "../modules/AddProduct";
import { useEffect, useState } from "react";
import Loading from '../components/Loading'
import { useContext } from "react";
import AppContext from "../AppContext";
import EditIcon from '@mui/icons-material/BorderColorRounded';
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Link } from "@mui/material";
import { ImagePlaceHolder } from "../res/Res";

const { archiveProduct, getDesignerAllProducts, searchProduct, unArchiveProduct, hasAccess } = require("../Requests").default;

export default function Dashboard() {

    const navigate = useNavigate()

    const {user, isMobileView} = useContext(AppContext)
    const userInfo = user()

    const memberSince = new Date(userInfo?userInfo.memberDate:'')

    const productsFilter = ['Available Products', 'All Products']

    const [showAddProduct, setShowAddProduct] = useState(false)
    const [products, setProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [availProducts, setAvailProducts] = useState([])
    const [availableProductsCount, setAvailableProductsCount] = useState(0)
    const [allProductsCount, setAllProductsCount] = useState(0)
    const [isFetchingProducts, setIsFetchingProducts] = useState(false)
    const [isHoverEdit, setIsHoverEdit] = useState(false)

    const [totalRevenue, setTotalRevenue] = useState(0)

    const [selectedFilter, setSelectedFilter] = useState(productsFilter[1])

    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsFetchingProducts(true)

        hasAccess(token).then(hasAccess => {
            if (!hasAccess) {
                navigate('/error')
            }
        })

        getDesignerAllProducts(token).then((prods) => {
            setProducts(prods)
            setAllProducts(prods)
            setAllProductsCount(prods.length)

            const availProd = prods.filter(prod => prod.isActive)
            setAvailProducts(availProd)
            setAvailableProductsCount(availProd.length)

            // calculate the total revenue.
            let total = 0
            prods.forEach(product => {
                // we only need the length of the orders because there is only one product in an order
                // there would be no multiple products in an order.
                const prodRev = product.price * product.orders.length
                total += prodRev
            })

            setTotalRevenue(total)
            setIsFetchingProducts(false)
        })
        
    }, [])  

    const handleFilterSelected = (selected) => {
        switch (selected) {
            case productsFilter[0]:
                setSelectedFilter(productsFilter[0])
                setProducts(availProducts)
                break
            default:
                setSelectedFilter(productsFilter[1])
                setProducts(allProducts)
        }
    }

    const handleAddProductShow = () => {
        setShowAddProduct(true)
    }

    const handleAddProductOnHide = () => {
        setShowAddProduct(false)
    }

    const handleOnAddedProduct = (product) => {
        const prod = [...products]
        prod.push(product)
        setProducts(prod)
        setAllProductsCount(prod.length)

        let aProd = availableProductsCount
        setAvailableProductsCount(++aProd)

        handleAddProductOnHide()
    }

    const handleOnArchive = async (product) => {
        setIsFetchingProducts(true) // initiate just to have a loading screen
        const isArchived = await archiveProduct(product._id, localStorage.getItem('token'))
        if (isArchived===true) {
            const newProds = availProducts.filter(prod => prod._id !== product._id)
            setAvailProducts(newProds)

            const mappedProds = products.map(_product => {
                if (_product._id === product._id) {
                    _product.isActive = false
                    return _product
                }

                return _product
            })

            if (selectedFilter === productsFilter[0]) {
                setProducts(newProds)
            } else {
                setAllProducts(mappedProds)
                setProducts(mappedProds)
            }

            setAvailableProductsCount(newProds.length)
        }

        setIsFetchingProducts(false)
    }

    const handleOnUnarchive = async (product) => {
        setIsFetchingProducts(true)
        const isUnarchived = await unArchiveProduct(product._id, localStorage.getItem('token'))

        if (isUnarchived===true) {
            const newProds = availProducts
            newProds.push(product)

            setAvailProducts(newProds)

            const mappedProds = products.map(_product => {
                if (_product._id === product._id) {
                    _product.isActive = true
                    return _product
                }

                return _product
            })

            setAllProducts(mappedProds)
            setProducts(mappedProds)
            setAvailableProductsCount(newProds.length)
        }

        setIsFetchingProducts(false)
    }

    const handleOnSearch = async (value) => {
        setIsFetchingProducts(true)
        const searchedProducts = await searchProduct(value)
        if (searchedProducts) {
            setProducts(searchedProducts)
        }

        setIsFetchingProducts(false)
    }

    const handleOnEmpty = async (value) => {
        if (selectedFilter === productsFilter[0]) {
            setProducts(availProducts)
        } else {
            setProducts(allProducts)
        }
    }

    return (
        <>
            <AddProduct
                _show={showAddProduct}
                _onHide={handleAddProductOnHide}
                _onAddedProduct={handleOnAddedProduct}
            />

            <TopBar hideSearchBar={true}/>
            
            <div className="d-flex justify-content-center">
                <div id="dashboard-container">
                    <Breadcrumbs aria-label="breadcrumb" className="mt-2 mb-2">
                        <label 
                            onClick={()=>navigate('/')} 
                            onMouseEnter={(e)=> {
                                e.target.style.cursor = 'pointer'
                                e.target.style.textDecoration = 'underline'
                            }}
                            onMouseLeave={(e)=> {
                                e.target.style.cursor = 'default'
                                e.target.style.textDecoration = 'none'
                            }}
                        >
                            Home
                        </label>
                        <label color="text.primary">Dashboard</label>
                    </Breadcrumbs>
                    {/* Profile */}
                    <div id="dash-prof-container" className="d-flex mb-3">
                        <div style={{position: 'relative'}}>
                            <img className="rounded-5" width={50} height={50} src={userInfo && userInfo.profilePicture!==''?userInfo.profilePicture:ImagePlaceHolder} alt="profpic"/>
                            {(isHoverEdit) ?
                                <EditIcon id="dash-edit-icon" className="rounded-5"/>
                                :
                                <></>
                            }
                        </div>
                        <div className="prof-pic ms-2" 
                            onMouseEnter={()=>setIsHoverEdit(true)}
                            onMouseLeave={()=>setIsHoverEdit(false)}
                            onClick={()=>navigate('/user_detail')}
                        >
                            <Row>
                                <label className="prof-pic">{`${userInfo?userInfo.firstName:''} ${userInfo?userInfo.lastName:''} ${userInfo?userInfo.suffix:''}`.trim()}</label>
                            </Row>
                            <Row>
                                <label id="dash-member-s" className="prof-pic">You are a member since: {memberSince.getFullYear()}</label>
                            </Row>
                        </div>
                        <div className="ms-auto">
                            <h3 className="fw-bold">Dashboard</h3>
                        </div>
                    </div>

                    <DashReport
                        totalRevenue={totalRevenue}
                        availableProducts={availableProductsCount}
                        allProducts={allProductsCount}
                    />
                    <Row>
                        <Col md="12" className="mt-3">
                            <div id="filter-search-container" className="d-flex">
                                <FilterButton
                                    _items={productsFilter}
                                    _onSelection={handleFilterSelected}
                                />

                                {isMobileView?
                                    <></>
                                    :
                                    <label>{selectedFilter}</label>
                                }

                                <div className="ms-auto me-2">
                                    {isMobileView?
                                        <Button id="dash-add-prod-btn" size="sm" className="rounded-5" onClick={handleAddProductShow}>Add Product</Button>
                                        :
                                        <Button id="dash-add-prod-btn" className="rounded-5" onClick={handleAddProductShow}>Add Product</Button>
                                    }
                                </div>
                                <div className="d-flex justify-content-center">

                                    <SearchBar onEnterKeyPress={handleOnSearch} onEmpty={handleOnEmpty}/>

                                </div>
                            </div>

                            <DashProducts
                                products={products}
                                onArchive={handleOnArchive}
                                onUnarchive={handleOnUnarchive}
                            />
                        </Col>
                    </Row>
                </div>

                <Loading open={isFetchingProducts}/>
            </div>
        </>
    )
}