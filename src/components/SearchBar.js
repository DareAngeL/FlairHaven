import { TextField, ThemeProvider, createTheme, outlinedInputClasses, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Utility from '../util/Utility';
import { Button } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { Transition } from 'react-transition-group';

const customTheme = (outerTheme) =>
    createTheme({
        palette: {
        mode: outerTheme.palette.mode,
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '--TextField-brandBorderColor': '#E0E3E7',
                        '--TextField-brandBorderHoverColor': '#B2BAC2',
                        '--TextField-brandBorderFocusedColor': '#6F7E8C',
                        '--TextField-backgroundColor': '#F3F6F9',
                        backgroundColor: '#F3F6F9',
                        borderRadius: '20px',
                        zIndex: 0,
                        '& label.Mui-focused': {
                            color: 'var(--TextField-brandBorderFocusedColor)',
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        borderColor: 'var(--TextField-brandBorderColor)',
                        borderRadius: '20px',
                    },
                    root: {
                        paddingRight: '1px',
                        [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: 'var(--TextField-brandBorderHoverColor)',
                            background: 'transparent'
                        },
                        [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: '#f079b6',
                        },
                    },
                },
            },
        }
    })

const expandAnimDuration = 500

const defaultStyle = {
    transition: `width ${expandAnimDuration}ms ease-in-out`,
    width: 30,
}
const transitionStyles = {
    entering: { width: 30 },
    entered:  { width: '94vw' },
}

export default function SearchBar(props) {

    const {
        onEnterKeyPress,
        onEmpty=()=>{},
        searchValue="",
        label="Search",
        isSmallScreenMobile=false,
        willExpand=()=>{},
        willShrink=()=>{},
        onFinishHide
    } = props

    const [value, setValue] = useState(searchValue)
    const [expand, setExpand] = useState(false)
    const [startExpansionAnim, setStartExpansionAnim] = useState(false)

    const searchBtnRef = useRef(null)
    const searchTxtFieldRef = useRef(null)
    const isSearchExpansionClicked = useRef(false)

    const outerTheme = useTheme()

    const handleOnEnterKeyPressed = (e) => {
        if (value === "") {
            return
        }

        if (e.keyCode === 13) {
            onEnterKeyPress(value)
        }
    }

    const handleOnClickSearchBtn = () => {
        if (value === "") {
            return
        }

        onEnterKeyPress(value)
    }

    /**
     * Start the searchBar expansion animation
     */
    useEffect(() => {
        if (!expand) {
            return
        }

        setStartExpansionAnim(true)
    }, [expand])

    /**
     * Take effect when the animation is done for hiding the logo.
     */
    useEffect(() => {
        if (!isSearchExpansionClicked.current) {
            return
        }

        setExpand(true) // expand now the search bar
    }, [onFinishHide])

    /**
     * This will call the willExpand() function to hide the 
     * logo first before expanding the searchBar
     */
    const handleExpandSearch = () => {
        isSearchExpansionClicked.current = true
        willExpand()
    }

    const handleOnFinishExpanding = () => {
        const searchTxtField = searchTxtFieldRef.current

        searchTxtField.focus()
    }

    const handleOnShrink = () => {
        setTimeout(() => {
            setExpand(false)
        }, 500)
    }

    const handleOnChange = (e) => {
        const val = e.target.value
        setValue(val)
        if (val === '' || Utility.isWhiteSpacesOnly(val)) {
            onEmpty()
        }
    }

    const handleOnFocus = () => {
        const searchBtn = searchBtnRef.current
        const searchBtnClasses = searchBtn.className
        searchBtn.className = searchBtnClasses.replace('search-unfocus', 'search-focus')
    }

    const handleOnBlur = () => {
        const searchBtn = searchBtnRef.current
        const searchBtnClasses = searchBtn.className
        searchBtn.className = searchBtnClasses.replace('search-focus', 'search-unfocus')

        isSearchExpansionClicked.current = false
        setStartExpansionAnim(false)
        willShrink()
    }

    return (
        <div className="d-flex">
            {isSmallScreenMobile && !expand?
                <Button 
                    id="search-btn" 
                    ref={searchBtnRef} 
                    className="search-unfocus rounded-5 ms-1"
                    onClick={handleExpandSearch}
                >
                    <SearchIcon className="search-ic"/>
                </Button>
                :
                (!isSmallScreenMobile?
                        <ThemeProvider theme={customTheme(outerTheme)}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                label={label}
                                fullWidth
                                size="small"
                                onKeyDown={handleOnEnterKeyPressed}
                                onChange={handleOnChange}
                                onFocus={handleOnFocus}
                                onBlur={handleOnBlur}
                                value={value}
                                InputProps={{
                                    endAdornment: (
                                        <Button 
                                            id="search-btn" 
                                            ref={searchBtnRef} 
                                            className="search-unfocus rounded-5 border-0 ms-1"
                                            onClick={handleOnClickSearchBtn}
                                        >
                                            <SearchIcon/>
                                        </Button>
                                    ),
                                    
                                }}
                            />
                        </ThemeProvider>
                    :
                        <Transition in={startExpansionAnim} timeout={0} onEntered={handleOnFinishExpanding} onExited={handleOnShrink}>
                            {(state) => (
                                <ThemeProvider theme={customTheme(outerTheme)}>
                                    <TextField
                                        id="outlined-basic"
                                        inputRef={searchTxtFieldRef}
                                        variant="outlined"
                                        label={label}
                                        fullWidth
                                        size="small"
                                        onKeyDown={handleOnEnterKeyPressed}
                                        onChange={handleOnChange}
                                        onFocus={handleOnFocus}
                                        onBlur={handleOnBlur}
                                        value={value}
                                        sx={{ ...defaultStyle, ...transitionStyles[state] }}
                                        InputProps={{
                                            endAdornment: (
                                                <Button 
                                                    id="search-btn" 
                                                    ref={searchBtnRef} 
                                                    className="search-unfocus rounded-5 border-0 ms-1"
                                                    onClick={handleOnClickSearchBtn}
                                                >
                                                    <SearchIcon className="search-unfocus"/>
                                                </Button>
                                            ),
                                            
                                        }}
                                    />
                                </ThemeProvider>
                            )}
                        </Transition>
                )
            }
        </div>
    )
}