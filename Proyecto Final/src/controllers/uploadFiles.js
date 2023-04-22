async function uploadFileController (req, res) {
    const file = req.file
    if (!file) {
        res.status(400)
        return res.send('Please upload a file')
    }
    res.send(file.path)
}

export {
    uploadFileController
}