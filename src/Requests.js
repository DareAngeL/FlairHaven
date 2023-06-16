const host = 'http://192.168.254.105:4000' //'https://capstone-2-tajos.onrender.com' //'http://192.168.254.105:4000'

const archiveProduct = async (productId, token) => {
    const res = await patch(`/products/archive/${productId}`, JSON.stringify({}), token)

    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message===true) {
            return jsonData.message
        }

        return jsonData.message
    }

    return undefined
}

const unArchiveProduct = async (productId, token) => {
    const res = await patch(`/products/unarchive/${productId}`, JSON.stringify({}), token)
    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message===true) {
            return jsonData.message
        }

        return jsonData.message
    }

    return undefined
}

const searchProduct = async (productName, sortType=null, filterType=null) => {
    const res = await get(`/products/search/name=${productName}/${sortType}/${filterType}`)
    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message===true) {
            return jsonData.body
        }

        return jsonData.body
    }

    return undefined
}

let retrievedProductIds = []
let prevSet = -1
/**
 * Get all the products that were not archived
 * @returns 
 */
const getActiveProducts = async (set) => {

    if (prevSet === set) {
        return []
    }

    prevSet = set
    
    const res = await post(`/products/active`, JSON.stringify(retrievedProductIds))
    const data = await res.json()

    if (data.message) {

        retrievedProductIds = [...retrievedProductIds, ...data.body.map(prods => prods._id)]

        return data.body
    }

    return []
}

const resetRetrievedProdIds = () => {
    retrievedProductIds = []
    prevSet = -1
}

const addToCart = async (productId, token) => {
    const res = await post(`/products/cart/${productId}`, '', token)
    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message) {
            return jsonData.body
        }

        return undefined
    }

    return undefined
}

const clearCart = async (products, token) => {
    const res = await post(`/products/clear_cart`, JSON.stringify(products), token)
    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message===true) {
            return true
        }

        return false
    }

    return false

}

const getUserCartProducts = async (token) => {
    const res = await get(`/products/cart_products`, token)
    if (res.ok) {
        const jsonData = await res.json()

        if (jsonData.message) {
            return jsonData.body
        }

        return undefined
    }

    return undefined
}

const removeProductInCart = async (productId, token) => {
    const res = await get(`/products/cart_remove_prod/${productId}`, token)
    if (res.ok) {
        const jsonData = await res.json()
        return jsonData.message
    }

    return undefined
}

const getUserDetail = async (token) => {
    const res = await get('/user/details', token)
    const data = await res.json()

    if (data.message) {
        return data.body
    }

    return undefined
}

const getUserDetailWithId = async (userId) => {
    const res = await get(`/user/details/${userId}`)
    const data = await res.json()

    if (data.message) {
        return data.body
    }

    return undefined
}

/**
 * Check the existence of the provided email
 * @param {String} _email 
 * @returns True/False -- if the email exist or undefined when the server returns an error
 */
const checkEmailExistence = async (_email) => {
    const res = await post('/user/checkEmailExists', JSON.stringify({
        email: _email
    }))

    if (res.ok) {
        const data = await res.json()
        return data.message
    }

    return undefined
}

/**
 * Register to the server
 * @param {object} data 
 * @returns 
 */
const register = async (data) => {
    const res = await post('/user/register', JSON.stringify(data))

    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message) {
            return jsonData.body
        }

        return jsonData.message
    }

    return undefined
}

/**
 * Login to the server
 * @param {Object} data 
 * @returns The token
 */
const login = async (data) => {
    const res = await post('/user/login', JSON.stringify(data))

    if (res.ok) {
        const jsonData = await res.json()
        if (!jsonData.access) {
            return {
                success: false,
                msg: jsonData.message
            }
        }

        return {
            success: true,
            token: jsonData.access
        }
    }

    return {
        success: false,
        msg: 'Something went wrong-- unable to login'
    }
}

const convertToDesigner = async (token) => {
    const res = await fetch(host + '/user/updateDesigner', {
        method: 'PATCH',
        headers: {Authorization:'Bearer ' + token}
    })

    if (res.ok) {
        const data = await res.json()
        if (data.message) {
            return data.body
        }

        return undefined
    }

    return undefined
}

const addProduct = async (data, token) => {
    const res = await post('/products/create', JSON.stringify(data), token)

    if (res.ok) {
        const data = await res.json()
        if (data.message) {
            return data.body
        }

        return undefined
    }

    return undefined
}

const getAvailableProducts = async () => {
    const res = await get('/products/active')
    if (res.ok) {
        const data = await res.json()
        if (data.message) {
            return data.body
        }

        return []
    }

    return []
}

const getDesignerAllProducts = async (token) => {
    const res = await get('/products/all/designer', token)
    if (res.ok) {
        const data = await res.json()
        if (data.message) {
            return data.body
        }

        return []
    }

    return []
}

const getProductInfo = async (productId, token) => {
    const res = await get(`/products/${productId}`, token)
    if (res.ok) {
        const data = await res.json()

        if (data.message) {
            return data.body
        }

        return data.message
    }

    return undefined
}

const updateProductInfo = async (productId, data, token) => {
    const res = await put(`/products/update/${productId}`, JSON.stringify(data), token)
    if (res.ok) {
        const data = await res.json()

        if (data.message) {
            return data.body
        }

        return undefined
    }

    return undefined
}

const getAllProducts = async (token) => {
    const res = await get('/products/all', token)
    if (res.ok) {
        const data = await res.json()
        if (data.message) {
            return data.body
        }

        return []
    }

    return []
}

const getFollowers = async (token) => {
    const res = await get('/user/getFollowers', token)
    if (res.ok) {
        const data = await res.json()
        if (data.message) {
            return  data.body
        }

        return data.message
    }

    return undefined
}

const updateUserDetails = async (data, token) => {
    const res = await put('/user/updateDetails', JSON.stringify(data), token)

    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message) {
            return jsonData.body
        }

        return undefined
    }

    return undefined
}

const placeOrder = async (data, token) => {
    const res = await post(`/orders/create`, JSON.stringify(data), token)

    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message===true) {
            return jsonData.body
        }

        return []
    }

    return undefined
}

const getOrders = async (token) => {
    const res = await get(`/orders/get`, token)

    if (res.ok) {
        const json = await res.json()
        if (json.message===true) {
            return json.body
        }

        return json.message
    }

    return undefined
}

const addComment = async (productId, data, token) => {
    const res = await post(`/products/${productId}/add_comment`, JSON.stringify(data), token)
    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message===true) {
            return jsonData.body
        }

        return undefined
    }

    return undefined
}

const getComments = async (productId) => {
    const res = await get(`/products/${productId}/comments`)

    if (res.ok) {
        const jsonData = await res.json()
        return jsonData.body
    }

    return []
}

const editComment = async (productId, data, token) => {
    const res = await post(`/products/${productId}/update_comment`, JSON.stringify(data), token)

    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message===true) {
            return jsonData.body
        }

        return jsonData.message
    }

    return undefined
}

const removeComment = async (productId, data, token) => {
    const res = await fetch(host + `/products/${productId}/remove_comment`, {
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            Authorization:'Bearer ' + token
        },
        body: JSON.stringify(data)
    })

    if (res.ok) {
        const jsonData = await res.json()

        if (jsonData.message===true) {
            return true
        }

        return false
    }

    return false
}

const addReaction = async (productId, reaction, ratings, token) => {
    const res = await post(`/products/${productId}/add_reactor/rating=${reaction}/avgRating=${ratings}`, JSON.stringify({}), token)

    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.message===true) {
            return jsonData.body
        }

        return jsonData.message
    }

    return undefined
}

const hasAccess = async (token) => {
    const res = await get(`/user/authenticate`, token)

    if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.auth === 'success') {
            return true
        }

        return false
    }

    return false
}

const get = async (path, token=undefined, data=undefined) => {

    const req = token ? 
        fetch(host + path, {
            headers: {Authorization:'Bearer ' + token},
            body: data
        })
        :
        fetch(host + path, {body: data})

    return await req
}

const post = async (path, data, token=undefined) => {

    const header = !token ? 
        {
            'Content-Type':'application/json',
        }
        :
        {
            'Content-Type':'application/json',
            Authorization:'Bearer ' + token
        }


    return await fetch(host + path, {
        method: 'POST',
        headers: header,
        body: data,
    })
}

const put = async(path, data, token=undefined) => {
    const header = !token ? 
    {
        'Content-Type':'application/json',
    }
    :
    {
        'Content-Type':'application/json',
        Authorization:'Bearer ' + token
    }

    return await fetch(host + path, {
        method: 'PUT',
        headers: header,
        body: data,
    })
}

const patch = async (path, data, token) => {
    return await fetch(host + path, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json',
            Authorization:'Bearer ' + token
        },
        body: data,
    })
}

const Requests = {
    hasAccess,
    resetRetrievedProdIds,
    searchProduct,
    unArchiveProduct,
    archiveProduct,
    getOrders,
    addReaction,
    removeComment,
    editComment,
    getComments,
    addComment,
    clearCart,
    placeOrder,
    removeProductInCart,
    getUserCartProducts,
    addToCart,
    getUserDetailWithId,
    updateUserDetails,
    getFollowers,
    updateProductInfo,
    getProductInfo,
    getDesignerAllProducts,
    getAllProducts,
    getAvailableProducts,
    addProduct,
    getActiveProducts,
    getUserDetail,
    checkEmailExistence,
    register,
    login,
    convertToDesigner
}

export default Requests