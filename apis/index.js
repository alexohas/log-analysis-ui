import { blackAxios } from "./config";
export const searchFunction = async function (args) {
    return blackAxios.get('/'+args)
        .then(response => response.data)
}

export const loginFunction = async function (args) {
    return blackAxios.post('/login', args)
        .then(response => response.data)
}

export const resetPasswordFunction = async function (args) {
    return blackAxios.post('/reset-password', args)
        .then(response => response.data)
}

export const updateFunction = async function (args) {
    return blackAxios.post('/update-username', args)
        .then(response => response.data)
}

export const statsFunction = async function (args) {
    return blackAxios.get('/stats')
        .then(response => response.data)
}

export const uploadFunction = async function (args) {
    return blackAxios.post('/upload-log-file', args, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => response.data)
}