import { useNavigate } from "react-router-dom";


const defaults = {
    baseUrl: "/api",
    headers: ()=> ({
        'Content-Type': 'application/json',
    }),
    error: {
        code: 'INTERNAL_ERROR',
        message: '网络或网站异常',
        status: 503,
        data: {}
    }
}

const api = (method, url, variables) => (
    new Promise((resolve, reject) => {
        fetch(`${defaults.baseUrl}${url}`, {
            method,
            headers: defaults.headers(),
            body: JSON.stringify(variables),
        })
        .then(response => {
            if(response.status === 401 || response.status === 403) {
                useNavigate()("/login");
            } else if(response.ok) {
                resolve(response.json());
            } else {
                reject(defaults.error);
            }
        })
        .catch(err => {
            reject(defaults.error);
        })
    })
)

export default {
    get: (...arg) => api('get', ...arg),
    post: (...arg) => api('post', ...arg),
    put: (...arg) => api('put', ...arg),
    delete: (...arg) => api('delete', ...arg),
}