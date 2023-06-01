import { useState } from "react";
import { useEffect } from "react";

/**
 * Implements lazy loading
 * @param {Boolean} stopLoading - stop the loading
 * @param {Function} onLoadMore - A callback when new data should be loaded more
 */
export default function useLazyLoader(stopLoading, onLoadMore) {

    const [scrollContainer, setScrollContainer] = useState(window)
    const [container, setContainer] = useState(undefined)
    const [setNo, setSetNo] = useState(1)
    const [isLoadMore, setIsLoadMore] = useState(false)
    const [loadThreshold, setLoadThreshold] = useState(200)

    useEffect(() => {
        const onScroll = () => {
            if (!container) {
                return
            }

            const top = container.scrollTop
            const scrollH = container.scrollHeight
            const innerH = window.innerHeight

            const shouldLoadMore = (scrollH - top) - innerH <= loadThreshold
            if (!stopLoading && shouldLoadMore && !isLoadMore) {
                setIsLoadMore(true)
                setSetNo(setNo+1)
                onLoadMore(setNo)
            } else if (!shouldLoadMore) {
                setIsLoadMore(false)
            }
        }

        scrollContainer.addEventListener('scroll', onScroll)
        return () => {
            scrollContainer.removeEventListener('scroll', onScroll)
        }
    }, [container, isLoadMore, loadThreshold, onLoadMore, scrollContainer, setNo, stopLoading])


    const shouldLoadMore = (container) => {
        const top = container.scrollTop
        const scrollH = container.scrollHeight
        const innerH = window.innerHeight

        return (scrollH - top) - innerH <= loadThreshold
    }

    /**
     * Set the container that will be used to detect scrolling
     * @param {React.MutableRefObject} element 
     */
    const setScroller = (element) => {
        setScrollContainer(element)
    }

    /**
     * Set the parent container
     * @param {React.MutableRefObject} element 
     */
    const setContainerRoot = (element) => {
        setContainer(element)
    }

    const setThreshold = (threshold) => {
        setLoadThreshold(threshold)
    }

    return {
        setScroller,
        setContainerRoot,
        setThreshold,
        shouldLoadMore
    }
}