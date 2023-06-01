import { Container } from "react-bootstrap";
import DashProdCard from "../components/DashProdCard";
import Shelves from "./Shelves";
import { useNavigate } from "react-router-dom";

export default function DashProducts(props) {

    const navigate = useNavigate()

    const {
        products=[],
        onArchive,
        onUnarchive
    } = props

    const handleOnProductClick = (productId) => {
        navigate(`/edit_prod/${productId}`)
    }

    return (
        <Container id="dash-r-shelves" className="mt-3" fluid>
            <Shelves spacing={3}>
                {products.map(prod => <DashProdCard
                                         key={prod._id}
                                         data={prod}
                                         onClick={handleOnProductClick}
                                         onArchive={onArchive}
                                         onUnarchive={onUnarchive}
                                      />
                            )
                }
            </Shelves>
        </Container>
    )
}