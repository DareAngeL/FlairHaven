import React from "react"
import { useEffect } from "react"
import { useState } from "react"

export default function Shelves(props) {
    const {
        children,
        spacing=1
    } = props

    const [width, setWidth] = useState(0)
    

    const containerRef = React.useRef(null)

    const windowResizeHandler = () => {
        setWidth(containerRef.current.offsetWidth)
    }

    useEffect(() => {
        setWidth(containerRef.current.offsetWidth)

        window.addEventListener('resize', windowResizeHandler)
        return () => {
            window.removeEventListener('resize', windowResizeHandler)
        }
    }, [])

    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0
            const childNodes = containerRef.current ? containerRef.current.childNodes : []

            if (containerWidth !== 0 && childNodes.length > 0) {
                let currentRowWidth = 0
                let currentRowIndex = 0
                let currentTotalColHeight = 0
                let columns = 0
                let childrenWidth = 0
                let leftOffset = 0
                let stopCountingColumns = false

                for (let i = 0; i < childNodes.length; i++) {
                    const child = childNodes[i]
                    const childWidth = child.offsetWidth

                    if (childrenWidth === 0) {
                        childrenWidth = spacing + childWidth + spacing
                    }

                    if (currentRowWidth + (spacing + childWidth + spacing) > containerWidth) {
                        currentRowWidth = leftOffset
                        currentRowIndex++
                        currentTotalColHeight = 0

                        for (let row = 1; row <= currentRowIndex; row++) {
                            currentTotalColHeight += spacing + childNodes[i - columns * row].offsetHeight + spacing
                        }

                        if (!stopCountingColumns) {
                            leftOffset = (containerWidth - childrenWidth * columns) / 2
                            currentRowWidth = leftOffset
                            let currRowWidth = leftOffset

                            for (let j = 0; j < columns; j++) {
                                const currChild = childNodes[j]
                                const currChildWidth = currChild.offsetWidth
                                currChild.style.transform = `translateX(${currRowWidth}px)`
                                currRowWidth += spacing + currChildWidth + spacing
                            }
                        }

                        stopCountingColumns = true
                    } else {
                        if (!stopCountingColumns) {
                            columns++
                        }

                        currentTotalColHeight = 0
                        for (let row = 1; row <= currentRowIndex; row++) {
                            currentTotalColHeight += spacing + childNodes[i - columns * row].offsetHeight + spacing
                        }
                    }

                    child.style.transform = `translate(${currentRowWidth}px, ${currentTotalColHeight}px)`
                    currentRowWidth += spacing + childWidth + spacing
                }
            }

        }
    }, [width, children, spacing])

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
            }}
        >
            {children}
        </div>
    )
}