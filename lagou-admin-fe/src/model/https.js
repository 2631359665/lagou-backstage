const get = (url, data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            type: 'GET',
            data,
            success: (res) => {
                resolve(res)
            },
            error: (err) => {
                reject(err);
            }
        })
    })
}


const post = (url, data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            type: 'POST',
            data,
            success: (res, status, xhr) => {
                res.status = status;
                res.xhr = xhr;
                resolve(res)
            },
            error: (err) => {
                reject(err);
            }
        })
    })
}


export {
    get,
    post
}