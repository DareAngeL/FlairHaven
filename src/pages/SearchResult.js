import { Stack } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { Breadcrumbs, Link, Skeleton } from "@mui/material";
import Shelves from "../modules/Shelves";
import MiniCard from "../components/MiniCard";
import { useContext, useRef, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ViewProduct from "../modules/ViewProduct";
import GetLicense from "../modules/GetLicense";
import FilterSort, { SortType } from "../modules/FilterSort";
import useLazyLoader from "../hooks/useLazyLoader";
import CloseIcon from '@mui/icons-material/CloseRounded';
import AppContext from "../AppContext";

const { searchProduct } = require("../Requests").default;

export default function SearchResult() {

    const { productName } = useParams()

    const appContext = useContext(AppContext)
    const navigate = useNavigate()

    const [searchProductName, setSearchProductName] = useState(productName)
    const [selectedSort, setSelectedSort] = useState(null)
    const [selectedFilter, setSelectedFilter] = useState(null)

    const [searchedProducts, setSearchedProducts] = useState([])
    const [displaySearchedProds, setDisplaySearchedProds] = useState([])

    const [isSearching, setIsSearching] = useState(false)
    const [hasNoMoreProds, setHasNoMoreProds] = useState(false)

    const [isViewProduct, setIsViewProduct] = useState(false)
    const [productLicenseView, setProductLicenseView] = useState({})
    const [openGetLicenseView, setOpenGetLicenseView] = useState(false)
    const [setNum, setSetNum] = useState(1)

    const [productToView, setProductToView] = useState(null)

    const containerRef = useRef(null)

    let LIMIT = 20

    /**
     * Handles lazy loading of the products.
     */
    const {setContainerRoot} = useLazyLoader(hasNoMoreProds, async () => {
        // on load more
        if (!hasNoMoreProds) {
            setSetNum(setNum+1)
            setDisplaySearchedProds([...displaySearchedProds, ...displayProducts(setNum)])

            // check if there are still products to display
            setTimeout(()=>{
                if (displayProducts(setNum+1).length === 0) {
                    setHasNoMoreProds(true)
                    return
                }
            }, 1000)
        }
    })

    useEffect(() => {
        setContainerRoot(document.documentElement)
        handleOnSearch(productName)
    }, [])

    /**
     * Handle Searching.
     * @param {*} value 
     */
    const handleOnSearch = async (value) => {
        
        if (value === '') {
            return
        }

        setSearchProductName(value)
        setIsSearching(true)

        setDisplaySearchedProds([])
        setHasNoMoreProds(false)

        console.log(selectedFilter)
        const searchedResults = await searchProduct(value, selectedSort, selectedFilter)
        
        setSetNum(1)

        if (searchedResults) {
            const displayProds = displayProducts(0, searchedResults)
            // check if the search result is less than the LIMIT provided.
            // this will be used to remove the mini card skeletons
            if (searchedResults.length <= LIMIT) {
                setHasNoMoreProds(true)
            }

            setSearchedProducts(searchedResults)
            setDisplaySearchedProds(displayProds)
        }

        setIsSearching(false)
    }

    const displayProducts = (set, arr=undefined) => {
        let prods = arr !== undefined ? arr : searchedProducts
        const grp = LIMIT * set

        return prods.slice(grp, grp+LIMIT)
    }

    const handleViewProduct = (product) => {
        setProductToView(product)
        setIsViewProduct(true)
    }

    const handleOnBuyBtnClick = (product) => {
        setProductLicenseView(product)
        setOpenGetLicenseView(true)
    }

    const handleOnSort = async (sortSelected) => {
        const priceSort = SortType.Price
        const dateSort = SortType.Date

        const DBSortType = {
            highest: 'high',
            lowest: 'low',
            best: 'best_selling',
            latest: 'latest',
            oldest: 'oldest'
        }

        setSetNum(1)
        setHasNoMoreProds(false)
        
        if (priceSort.Highest === sortSelected) {
            setSelectedSort(DBSortType.highest)
            await sortedSearch(DBSortType.highest)
        } else if (priceSort.Lowest === sortSelected) {
            setSelectedSort(DBSortType.lowest)
            await sortedSearch(DBSortType.lowest)
        } else if (dateSort.Latest === sortSelected) {
            setSelectedSort(DBSortType.latest)
            await sortedSearch(DBSortType.latest)
        } else if (dateSort.Oldest === sortSelected) {
            setSelectedSort(DBSortType.oldest)
            await sortedSearch(DBSortType.oldest)
        } else {
            // else- is best selling sorting
            setSelectedSort(DBSortType.best)
            await sortedSearch(DBSortType.best)
        }
    }

    const sortedSearch = async (sortType) => {
        setIsSearching(true)

        setDisplaySearchedProds([])
        const sortedSearchedProds = await searchProduct(searchProductName, sortType, selectedFilter)
        setSearchedProducts(sortedSearchedProds)
        setDisplaySearchedProds(displayProducts(0, sortedSearchedProds))

        removeSkeletons(sortedSearchedProds.length <= LIMIT)

        setIsSearching(false)
    }

    const handleOnSortRemoved = async () => {
        setIsSearching(true)
        
        setDisplaySearchedProds([])
        setSelectedSort(undefined)
        setSetNum(1)
        setHasNoMoreProds(false)

        const sortedSearchedProds = await searchProduct(searchProductName, null, selectedFilter)
        setSearchedProducts(sortedSearchedProds)
        setDisplaySearchedProds(displayProducts(0, sortedSearchedProds))

        removeSkeletons(sortedSearchedProds.length <= LIMIT)

        setIsSearching(false)
    }

    const handleOnFilter = async (filterSelected) => {
        setIsSearching(true)
        
        setSelectedFilter(filterSelected.toLowerCase())
        setDisplaySearchedProds([])
        const searchedProds = await searchProduct(searchProductName, null, filterSelected.toLowerCase())
        setSearchedProducts(searchedProds)
        setDisplaySearchedProds(displayProducts(0, searchedProds))

        removeSkeletons(searchedProds.length <= LIMIT)

        setIsSearching(false)
    }

    const handleRemoveFilter = async() => {
        setIsSearching(true)
        
        setSelectedFilter(null)
        setDisplaySearchedProds([])
        const searchedProds = await searchProduct(searchProductName, selectedSort)
        setSearchedProducts(searchedProds)
        setDisplaySearchedProds(displayProducts(0, searchedProds))

        removeSkeletons(searchedProds.length <= LIMIT)
        setIsSearching(false)
    }

    const handleOnSearchChange = (value) => {
        setSearchProductName(value)
    }

    const removeSkeletons = (remove) => {
        if (remove) {
            setHasNoMoreProds(remove)
        }
    }

    return (
        <div>
            <Stack ref={containerRef} id="s-r-container" className="p-2">
                <div id="s-r-search">
                    <SearchBar
                        label="Find an art"
                        onEnterKeyPress={handleOnSearch}
                        searchValue={productName}
                        onChange={handleOnSearchChange}
                    />
                    <Breadcrumbs aria-label="breadcrumb" className="mt-2">
                        <label
                            onClick={()=> navigate('/')}
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
                        <label color="text.primary">Search Results</label>
                    </Breadcrumbs>

                </div>

                <div className={appContext.isSmallScreenMobile?"ms-2":"d-flex align-items-center"}>
                    <FilterSort 
                        isSmallScreen={appContext.isSmallScreenMobile}
                        onSort={handleOnSort}
                        onFilter={handleOnFilter}
                        onSortRemoved={handleOnSortRemoved}    
                    />
                    {selectedFilter?
                        <label 
                            id="s-r-filter-lbl"
                            onClick={handleRemoveFilter}
                        >
                            {selectedFilter.toUpperCase()}
                            <CloseIcon fontSize="inherit"/>
                        </label>
                        :
                        <></>
                    }
                </div>

                <hr className="h-divider mb-2"/>

                <Shelves spacing={3}>
                    {displaySearchedProds.map((product)=> <MiniCard key={product._id} product={product} onClick={handleViewProduct}/>)}
                    {!hasNoMoreProds?
                        <>
                            <Skeleton className="mt-1 ms-2" variant="rounded" width={115} height={180} style={{position: 'absolute'}}/>
                            <Skeleton className="mt-1 ms-2" variant="rounded" width={115} height={180} style={{position: 'absolute'}}/>
                            <Skeleton className="mt-1 ms-2" variant="rounded" width={115} height={180} style={{position: 'absolute'}}/>
                        </>
                        :
                        <></>
                    }
                </Shelves>
            </Stack>
            <Loading open={isSearching} text="Searching..." />

            <ViewProduct 
                open={isViewProduct} 
                product={productToView}
                onClose={()=>setIsViewProduct(false)} 
                onBuyBtnClick={handleOnBuyBtnClick} 
            />

            <GetLicense product={productLicenseView} open={openGetLicenseView} onClose={()=>setOpenGetLicenseView(false)}/>
        </div>
    )
}