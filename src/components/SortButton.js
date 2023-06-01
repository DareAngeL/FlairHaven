import { Button, Dropdown } from "react-bootstrap";
import PropTypes from 'prop-types'

SortButton.propTypes = {
    _text: PropTypes.string,
    _onSelection: PropTypes.func.isRequired,
    _selected: PropTypes.bool,
    _items: PropTypes.array,
    _isMenu: PropTypes.bool,
}

export default function SortButton(props) {

    const {
        _text, 
        _onSelection,
        _selected=false,
        _items=[],
        _isMenu=true
    } = props

    const handleOnClick = (e) => {
        _onSelection(e.target.textContent)
    }

    return (
        (_isMenu)?
            <Dropdown>
                <Dropdown.Toggle 
                    id="dropdown-button-dark"
                    className={`${_selected?'sort-filter-selected':'sort-filter-unselect'} d-flex align-items-center mx-1 p-2`}
                    size="sm"
                    variant="secondary"
                >
                    {_text}
                </Dropdown.Toggle>

                <Dropdown.Menu variant="light">
                    {_items.map((item, i) =>
                        <Dropdown.Item key={i} onClick={handleOnClick}>
                            {item}
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        :
            <Button
                id="best-sell-btn"
                className={`${_selected?'best-sell-select':'best-sell-unselect'} d-flex align-items-center mx-1 p-2 border-0`}
                onClick={handleOnClick}
            >
                {_text}
            </Button>
    )
}