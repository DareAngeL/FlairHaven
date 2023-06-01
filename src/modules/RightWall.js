import { useState } from "react"
import useLazyLoader from "../hooks/useLazyLoader"
import WallFragment from "./WallFragment"
import { useEffect } from "react"
import { Container, Stack } from "react-bootstrap"
import { Skeleton } from "@mui/material"

const {getActiveProducts} = require("../Requests").default

/**
 * A module where to view products in a listview format.
 * @param {Array} props 
 * @returns 
 */
export default function RightWall(props) {
    const RENDER_LIMIT = 5

    const {products, onBuyBtnClick, onCartAdd} = props

    const [origProducts, setOrigProducts] = useState(products)

    const [renderedProducts, setRenderedProducts] = useState(origProducts.slice(0, RENDER_LIMIT))

    const [hasNoMoreProducts, setHasNoMoreProducts] = useState(false)

    const [setNum, setSetNum] = useState(1)

    const {setContainerRoot, setThreshold} = useLazyLoader(hasNoMoreProducts, async (set) => {
        // on load more
        // load all the origProducts first, if it's all loaded
        // then try to retrieve another products from the database if there is any.
        if (renderedProducts.length !== origProducts.length) {
            setRenderedProducts([...renderedProducts, ...origProducts.slice(RENDER_LIMIT * set, renderedProducts.length + RENDER_LIMIT)])
            return
        }

        const newProds = await getActiveProducts(setNum)
        if (newProds.length === 0) {
            setHasNoMoreProducts(true)
            return
        }

        const newOrig = [...origProducts, ...newProds]

        setSetNum(setNum+1)
        setOrigProducts(newOrig)
        setRenderedProducts([...renderedProducts, ...newOrig.slice(RENDER_LIMIT * set, renderedProducts.length + RENDER_LIMIT)])
    })

    useEffect(() => {
        setContainerRoot(document.documentElement)
        setThreshold(800)

        if (products.length === 0) {
            setHasNoMoreProducts(true)
        }
    }, [])

    return (
        <Container key={'a'} className="p-0" fluid>
            {
                renderedProducts.map((product) =>
                    <WallFragment 
                        key={product._id} 
                        onBuyBtnClick={onBuyBtnClick} 
                        product={product} 
                        onCartAdd={onCartAdd}

                    />
                )
            }

            {!hasNoMoreProducts ?
                <Stack className="m-2">
                    <div className="d-flex mt-2">
                        <Skeleton className="mt-1" variant="circular" width={30} height={30}/>
                        <Stack>
                            <Skeleton className="mt-1 ms-2" variant="rounded" width="50%" height={10}/>
                            <Skeleton className="mt-1 ms-2" variant="rounded" width="20%" height={10}/>
                        </Stack>
                    </div>
                    <Skeleton className="mt-1" variant="rounded" width="100%" height={400}/>
                </Stack>
                :
                <></>
            }
        </Container>
    )
}