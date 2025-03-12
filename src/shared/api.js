import { useNavigate } from "react-router-dom";
import { setUserInformation, getUserInformation, removeUserInformation } from "../shared/user";
import toast from "react-hot-toast";


const useApi = () => {

    const navigate = useNavigate();

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
    
    const apiCall = (method, url, variables) => {
        return new Promise((resolve, reject) => {
            fetch(`${defaults.baseUrl}${url}`, {
                method,
                headers: defaults.headers(),
                body: JSON.stringify(variables),
            })
            .then(response => {
                if(response.status === 401 || response.status === 403) {
                    navigate("/login");
                    return Promise.reject({
                        status: response.status,
                        message: "验证实效",
                    });
                } else if(response.ok) {
                    return response.json();
                } else {
                    return response.json().then(json => {
                        return Promise.reject({
                            status: response.status,
                            json: json.message,
                        })
                    });
                }
            })
            .then(json => {
                return resolve(json);
            })
            .catch(err => {
                if(err && err.status) {
                    toast.error(`${err.status} - ${err.message}`)
                } else {
                    toast.error(defaults.error.message);
                }
                return reject(defaults.error.message);
            })
        })
    }

    const api = {
        get: (...arg) => apiCall('get', ...arg),
        post: (...arg) => apiCall('post', ...arg),
        put: (...arg) => apiCall('put', ...arg),
        delete: (...arg) => apiCall('delete', ...arg),
    }

    const register = ({ username, password, confirmPassword }) => {
        api.post('/auth/register', {
            username,
            password,
            confirmPassword
        }).then(json => {
            navigate("/register_success");
        })
    }

    const login = ({ username, password, rememberMe }) => {
        api.post(`/auth/login?remember-me=${rememberMe}`, {
            username,
            password
        }).then(json => {
            setUserInformation(json.name);
            navigate("/");
        })
    }

    const guestLogin = () => {
        api.post('/auth/anonymous').then(json => {
            setUserInformation(json.name);
            navigate("/");
        })
    }

    const logout = () => {
        api.post('/auth/logout').then(() => {
            removeUserInformation();
            navigate("/login");
        })
    }

    const getAllTask = () => {
        return api.get('/task');
    }

    const moveCard = (payload)=> {
        return api.post('/task/moveitem', payload);
    }

    const reorderCard = (payload) => {
        return api.post('/task/reorder', payload);
    }

    const addCard = (payload) => {
        return api.post('/task', payload);
    }

    const deleteCard = (id)=> {
        return api.delete(`/task/${id}`);
    }

    return {
        register,
        login,
        guestLogin,
        logout,
        getAllTask,
        moveCard,
        reorderCard,
        addCard,
        deleteCard,
    }
}

export default useApi;