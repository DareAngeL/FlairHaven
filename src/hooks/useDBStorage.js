import { ref, uploadBytesResumable, uploadString, getDownloadURL } from 'firebase/storage'
import { useContext } from 'react'
import AppContext from '../AppContext'

export default function useDBStorage() {
    const appContext = useContext(AppContext)
    const storage = appContext.storage
    const userId = appContext.user() && appContext.user()._id ? appContext.user()._id : ''

    const uploadBytes = (file, onProgress, onSuccess, onError) => {
        const storageRef = ref(storage, `${userId}/${file.name}`)
        const task = uploadBytesResumable(storageRef, file)

        task.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                onProgress(progress.toFixed())
            },
            (error) => {
                // Handle unsuccessful uploads
                onError(error)
            },
            () => {
                getDownloadURL(task.snapshot.ref).then((downloadURL) => {
                    onSuccess(downloadURL)
                })
            }
        )
    }

    const uploadDataUrl = async (dataUrl) => {
        const storageRef = ref(storage, userId)
        const snapshot = await uploadString(storageRef, dataUrl, 'data_url')
        const downloadURL = await getDownloadURL(snapshot.ref)

        return downloadURL
    }

    const getData = () => ({
        uploadBytes,
        uploadDataUrl
    })

    return getData()
}