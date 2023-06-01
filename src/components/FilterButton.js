import React from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Dropdown } from 'react-bootstrap';

export default function FilterButton(props) {

    const {
        _onSelection,
        _items=[]
    } = props

    const handleOnClick = (e) => {
        _onSelection(e.target.textContent)
    }
    
    const FilterToggle = React.forwardRef(({ children, onClick }, ref) => (
        <FilterListIcon
            className="mx-3"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        />
    ));
    
    return (
        <Dropdown>
            <Dropdown.Toggle
                id="dropdown-button-dark"
                as={FilterToggle}
                size="sm"
            >
                
            </Dropdown.Toggle>

            <Dropdown.Menu variant="light">
                {_items.map((item, i) =>
                    <Dropdown.Item key={i} onClick={handleOnClick}>
                        {item}
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}