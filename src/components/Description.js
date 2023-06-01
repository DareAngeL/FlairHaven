import { useState } from "react"

export default function Description(props) {

    const { children, id } = props
    const [expand, setExpand] = useState(false)

    const handleOnClick = () => {
        setExpand(!expand)
    }
    
    return (
        <label id={id} className={(expand)?"description text-wrap text-truncate":"description expand text-wrap text-truncate"} onClick={handleOnClick}>
            {children}
        </label>
    )
}