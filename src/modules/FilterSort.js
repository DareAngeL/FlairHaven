import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import FilterButton from "../components/FilterButton";
import SortButton from "../components/SortButton";
import PropTypes from "prop-types"
import CloseIcon from '@mui/icons-material/CloseRounded';

FilterSort.propTypes = {
    isSmallScreen: PropTypes.bool.isRequired,
    onSort: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    onSortRemoved: PropTypes.func
}

export const FilterType = {
    PNG: 'PNG',
    JPEG: 'JPEG',
    ICO: 'ICO',
    SVG: 'SVG'
}

export const SortType = {
    BestSelling: "Best Selling",
    Price: {
        Lowest: "Lowest Price",
        Highest: "Highest Price"
    },
    Date: {
        Latest: "Latest",
        Oldest: "Oldest"
    }
}

export default function FilterSort(props) {

    const {
        isSmallScreen,
        onSort,
        onFilter,
        onSortRemoved=()=>{}
    } = props

    const imgTypeFilters = [
        "PNG", "JPEG", "ICO",
        "SVG"
    ]

    const priceSort = [
        "Lowest Price", "Highest Price"
    ]

    const dateSort = [
        "Latest", "Oldest"
    ]

    const [sortSelected, setSortSelected] = useState({
        bestselling: false,
        price: false,
        date: false,
    })
    const [priceSortSelected, setPriceSortSelected] = useState(priceSort[1])
    const [dateSortSelected, setDateSortSelected] = useState(dateSort[1])
    const [hasSelected, setHasSelected] = useState(false)

    const handleBestSellSelection = (selected) => {
        setSortSelected({
            bestselling: true,
            price: false,
            date: false,
        })
        setHasSelected(true)
        onSort(selected)
    }

    const handlePriceSortSelection = (selected) => {
        setPriceSortSelected(selected)
        setSortSelected({
            bestselling: false,
            price: true,
            date: false,
        })
        setHasSelected(true)
        onSort(selected)
    }

    const handleDateSortSelection = (selected) => {
        setDateSortSelected(selected)
        setSortSelected({
            bestselling: false,
            price: false,
            date: true,
        })
        setHasSelected(true)
        onSort(selected)
    }

    const handleFilterSelected = (selected) => {
        onFilter(selected)
    }

    const handleOnRemoveSort = () => {
        setSortSelected({
            bestselling: false,
            price: false,
            date: false,
        })
        setHasSelected(false)

        onSortRemoved()
    }

    return (
        <div className="mb-0">
            {(hasSelected) ?
                <Button 
                    id="remove-sort-btn"
                    className="d-flex align-items-center ms-3 mb-2 p-2 b-0"
                    onClick={handleOnRemoveSort}
                >
                    Remove Sorting
                    <CloseIcon fontSize="inherit" className="ms-1"/>
                </Button>
            :
                <></>
            }
            {isSmallScreen?
                <Col>
                    <Row sm={3} className="mb-1">
                        <div>
                            <SortButton 
                                _text="Best Selling"
                                _isMenu={false}
                                _selected={sortSelected.bestselling}
                                _onSelection={handleBestSellSelection}
                            />
                        </div>
                    </Row>
                    <Row sm={3} className="mb-1">
                        <SortButton 
                            _text={priceSortSelected}
                            _items={priceSort}
                            _selected={sortSelected.price}
                            _onSelection={handlePriceSortSelection}
                        />
                    </Row>
                    <Row sm={3} className="mb-1">
                        <SortButton
                            _text={dateSortSelected}
                            _items={dateSort}
                            _selected={sortSelected.date}
                            _onSelection={handleDateSortSelection}
                        />
                    </Row>
                    <Row sm={3} className="mb-1">
                        <FilterButton
                            _items={imgTypeFilters}
                            _onSelection={handleFilterSelected}
                        />
                    </Row>
                </Col>
                :
                <div className="d-flex p-2" fluid>
                    <SortButton 
                        _text="Best Selling"
                        _isMenu={false}
                        _selected={sortSelected.bestselling}
                        _onSelection={handleBestSellSelection}
                    />
                    <SortButton 
                        _text={priceSortSelected}
                        _items={priceSort}
                        _selected={sortSelected.price}
                        _onSelection={handlePriceSortSelection}
                    />
                    <SortButton
                        _text={dateSortSelected}
                        _items={dateSort}
                        _selected={sortSelected.date}
                        _onSelection={handleDateSortSelection}
                    />
                    <FilterButton
                        _items={imgTypeFilters}
                        _onSelection={handleFilterSelected}
                    />
                </div>
            }
        </div>
    )
}