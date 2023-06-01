import { Stack } from "react-bootstrap";

export default function OrderFragment(props) {

    const {
        product,
        onDownloadClick
    } = props

    return (
        <Stack id="o-frag-container" className="mt-3 mb-3">
            <div className="d-flex">
                <img
                    id="o-img"
                    width={50} 
                    height={50} 
                    src={product.imageData.resizedImage}
                    alt="img"
                    className="rounded-3"
                />
                <div className="ms-3">
                    <h5 className="m-0 p-0">{product.name}</h5>
                    <label className="m-0 p-0">{product.creatorName}</label>
                </div>
                <div id="c-i-deletebtn" className="px-2 ms-auto">
                    <label id="o-dlbtn" onClick={onDownloadClick}>Download</label>
                </div>
            </div>
        </Stack>
    )
}