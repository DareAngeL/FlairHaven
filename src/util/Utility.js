import Resizer from "react-image-file-resizer";
import seedrandom from "seedrandom";

const Utility = {
    isWhiteSpacesOnly: (str) => {
        return /^\s*$/.test(str)
    },
    resizeImage: (file, fileType, onResized) => {
        try {
            Resizer.imageFileResizer(
                file,
                300,
                300,
                fileType,
                80,
                0,
                (uri) => {
                    onResized(uri)
                },
                "base64"
            )
        } catch (err) {
            console.log(err)
        }
    },
    formatDate: (strDate) => {
        const dateOpt = { month: 'long', day: 'numeric', year: 'numeric' }
        const date = new Date(strDate)
        return date.toLocaleDateString('en-US', dateOpt)
    },
    shortTermVersion: (value) => {
        if (value < 1000) {
            return value
        } else if (value < 1000000) {
            return `${value/1000}K`
        } else if (value < 1000000000) {
            return `${value/1000000}M`
        } else if (value < 1000000000000) {
            return `${value/1000000000}B`
        } else {
            return `${value/1000000000000}T`
        }
    },
    shuffle: (array, seed) => {
        if (!array)
            return

        const _seed = seedrandom(new Date().getTime())
        return array.sort(() => _seed() - 0.5)
    },
    moveToTop: (arr, elem) => {
        /*
        Given an array `arr` and an element `elem`, this function moves `elem` to the top of the array.
        If `elem` is not found in `arr`, the function returns `null`.
        */
        // Find the index of the element
        let index = -1
        for (let i=0; i<arr.length; i++) {
            if (elem._id === arr[i]._id) {
                index = i
                break
            }
        }

        if (index === -1) {
            return null // element not found in array
        }
        // Move the element to the top of the array
        arr.splice(index, 1)
        arr.splice(0, 0, elem)
        return arr
    }
}

export default Utility