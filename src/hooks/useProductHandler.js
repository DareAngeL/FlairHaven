import { useState } from "react"
import Utility from "../util/Utility"
import useDBStorage from "./useDBStorage"
import { useCallback } from "react"

const {addProduct} = require('../Requests').default

export default function useProductHandler(onAddedProduct=()=>{}) {


    const { uploadBytes } = useDBStorage()
    const [uploadProgress, setUploadProgress] = useState(0)

    const [origImg, setOrigImg] = useState('')
    const [resizedImg, setResizedImg] = useState('')
    const [imgErr, setImgErr] = useState(false)
    
    const [name, setName] = useState('')
    const [nameErr, setNameErr] = useState(false)

    const [desc, setDesc] = useState('')
    const [descErr, setDescErr] = useState(false)

    const [price, setPrice] = useState(0)
    const [priceErr, setPriceErr] = useState(false)

    const [isSuccess, setIsSuccess] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isFetchingImg, setIsFetchingImg] = useState(false)

    const handleFileSelect = (e) => {
        setIsFetchingImg(true)
        // Get the selected file
        const file = e.target.files[0];
        setOrigImg(file)
        
        // resize the file
        Utility.resizeImage(file, file.type, (uri) => {
            // on resized complete
            setResizedImg(uri)
            setIsFetchingImg(false)
        })
    }

    const handleAddImageClick = async (fileInputRef) => {
        fileInputRef.current.click()
    }

    const handleAddProductToDB = useCallback(async (imageURL, token) => {
        const result = await addProduct({
            name: name,
            imageData: {
                originalImage: imageURL,
                resizedImage: resizedImg
            },
            description: desc,
            price: price,
        }, token)

        if (result) {
            setResizedImg('')
            setName('')
            setNameErr(false)
            setDesc('')
            setDescErr(false)
            setPrice(0)
            setPriceErr(false)

            setIsSuccess(true)
            setIsUploading(false)
            setUploadProgress(0)
            setTimeout(() => {
                setIsSuccess(false)
                onAddedProduct(result)
            }, 1000)
        }
    }, [desc, name, onAddedProduct, price, resizedImg])

    const handleProceedBtn = useCallback(async () => {

        let hasError = false
        checkError(name, 'name')
        checkError(desc, 'desc')
        checkError(price, 'price')

        if (nameErr) {
            setNameErr(true)
            hasError = true
        }
        if (descErr) {
            setDescErr(true)
            hasError = true
        }
        if (priceErr) {
            setPriceErr(true)
            hasError = true
        }

        if (resizedImg === '') {
            setImgErr(true)
            hasError = true
        }

        if (hasError) {
            return
        }

        if (!hasError) {
            setIsUploading(true)
            const token = localStorage.getItem('token')
            //uploads the original image
            uploadBytes(
                origImg, 
                (progress) => {
                    setUploadProgress(progress)
                },
                async (imageURL) => {
                    // after successful upload add it to the database
                    await handleAddProductToDB(imageURL, token)
                },
                (err) => {
                    console.log(err)
                }
            )
        }
    }, [desc, descErr, handleAddProductToDB, name, nameErr, origImg, price, priceErr, resizedImg, uploadBytes])

    const handleOnBlur = useCallback((e, input) => {
        const value = e.target.value
        checkError(value, input)
    }, [])

    const checkError = (value, input) => {
        if (value === '' || Utility.isWhiteSpacesOnly(value)) {
            switch (input) {
                case 'name':
                    setNameErr(true)
                    break
                case 'desc':
                    setDescErr(true)
                    break
                case 'price':
                    setPriceErr(true)
                    break
                default:
            }
        }
    }

    const handleOnHide = (onHide) => {
        setResizedImg('')
        setName('')
        setNameErr(false)
        setDesc('')
        setDescErr(false)
        setPrice(0)
        setPriceErr(false)

        onHide()
    }

    const handleSetImgErr = (value) => {
        setImgErr(value)
    }

    const handleSetName = (value) => {
        setName(value)
    }

    const handleSetNameErr = (value) => {
        setNameErr(value)
    }

    const handleSetDesc = (value) => {
        setDesc(value)
    }

    const handleSetDescErr = (value) => {
        setDescErr(value)
    }

    const handleSetPriceErr = (value) => {
        setPriceErr(value)
    }

    const handleSetPrice = (value) => {
        setPrice(value)
    }

    const getData = () => ({
        handleOnHide,
        handleFileSelect,
        imgErr,
        resizedImg,
        handleAddImageClick,
        handleSetImgErr,
        isFetchingImg,
        nameErr,
        name,
        handleSetName,
        handleOnBlur,
        handleSetNameErr,
        descErr,
        desc,
        handleSetDesc,
        handleSetDescErr,
        priceErr,
        handleSetPriceErr,
        price,
        handleSetPrice,
        handleProceedBtn,
        isSuccess,
        isUploading,
        uploadProgress
    })

    return getData()
}