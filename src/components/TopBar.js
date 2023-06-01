import { Container, Navbar, Stack } from "react-bootstrap";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LogoTitle } from "../res/logo-title.svg"
import { Transition } from 'react-transition-group';
import { useState } from "react";

const expandAnimDuration = 500

const defaultStyle = {
    transition: `opacity ${expandAnimDuration}ms ease-in-out, width ${expandAnimDuration}ms ease-in-out`,
    opacity: 1,
    width: 200
}
const transitionStyles = {
    entering: { opacity: 1, width: 200 },
    entered:  { opacity: 0, width: 0 },
}

export default function TopBar(props) {

    const {
        _ref,
        hideSearchBar=false,
        isMobileView=false,
        isSmallScreenMobile=false
    } = props

    const navigate = useNavigate()

    const [onFinishHide, setOnFinishHide] = useState(false)
    const [hideLogo, setHideLogo] = useState(false)

    const handleSearchBarExpansion = () => {
        setHideLogo(true)
    }

    const handleOnLogoFinishHide = () => {
        setOnFinishHide(true)
    }

    const handleOnLogoShow = () => {
        setOnFinishHide(false)
    }

    const handleSearchBarShrinking = () => {
        setHideLogo(false)
    }

    return (
        <Navbar ref={_ref} fixed="top" bg="white" style={{
            borderBottom: '1px solid rgb(203, 203, 203)'
        }}>
            <Stack>
                <Container id="container-reset" className="d-flex" fluid>
                    <Transition in={hideLogo} timeout={0} onEntered={handleOnLogoFinishHide} onExited={handleOnLogoShow}>
                        {(state) => (
                            <div className="d-flex align-items-center" style={{ ...defaultStyle, ...transitionStyles[state] }}>
                                <LogoTitle/>
                            </div>
                        )}
                    </Transition>
                    {!hideSearchBar?
                        <div className={isMobileView?"me-2 ms-auto mt-2":"me-4 ms-auto mt-2"}>
                            <SearchBar
                                label="Find an art"
                                willExpand={handleSearchBarExpansion} 
                                willShrink={handleSearchBarShrinking}
                                onFinishHide={onFinishHide}
                                isSmallScreenMobile={isSmallScreenMobile} 
                                onEnterKeyPress={(value)=>navigate(`/search_result/${value}`)}
                            />
                        </div>
                        :
                        <></>
                    }
                </Container>
            </Stack>
        </Navbar>
    )
}