import { baseUrl } from './constant'
import { useNavigate } from "react-router-dom";
import { setUserInformation, getUserInformation, removeUserInformation } from "../shared/user"

const useApi = () => {

    const navigate = useNavigate();

    const processLogic = ({ call, onSucceed = (json) => { }, onFailed = (err) => { } }) => {
        call().then(response => {
            if (response.status === 401 || response.status === 403) {
                removeUserInformation();
                navigate("/login");
                return;
            } else if (response.ok) {
                return response.json();
            } else {
                throw new Error(`failed with status ${response.status}`);
            }
        })
            .then(json => {
                onSucceed(json);
            })
            .catch(err => {
                console.log("err", err);
                onFailed(err);
            })
    }

    const register = ({ username, password})=> {
        fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        }) 
        .then((response)=> {
            if (response.ok) {
                navigate("/register_success");
            } else {
                const errorData = response.json();
                throw new Error(`${response.status} ${errorData}`)
            }
        })
        .catch(err => {
            console.log("err", err);
        });
    }

    const login = ({ username, password, rememberMe}) => {
        fetch(`${baseUrl}/auth/login?remember-me=${rememberMe}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password}),
        })
        .then((response)=> {
            if (response.ok) { 
               return response.json();
            } else {
                const errorData = response.json();
                throw new Error(`${response.status} ${errorData}`)
            }
        })
        .then(json => {
            setUserInformation(json.name);
            navigate("/");
        })
        .catch(err => {
            console.log("err", err);
        });
    }

    const guestLogin = () => {
        fetch(`${baseUrl}/auth/anonymous`, {
            method: "POST",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`anonymous login failed, ${response.status}`);
                } else {
                    return response.json();
                }
            })
            .then(json => {
                setUserInformation(json.name);
                navigate("/");
            })
    }

    const logout = () => {
        processLogic({
            call: ()=> {
                return fetch(`${baseUrl}/auth/logout`, {
                    method: "POST",
                    // credentials: 'include',
                })
            },
            onSucceed: ()=> {
                removeUserInformation();
                navigate("/login");
            }
        })
    }

    const getAllTask = ({ onSucceed }) => {
        processLogic({
            call: () => {
                return fetch(`${baseUrl}/task`, {

                })
            },
            onSucceed: onSucceed,
        })
    }

    return {
        register,
        login,
        guestLogin,
        logout,
        getAllTask,
    }
}

export default useApi;