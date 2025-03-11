import { useNavigate } from "react-router-dom";
import { setUserInformation, getUserInformation, removeUserInformation } from "../shared/user"
import api from './utils/api'


const useApi = () => {

    const navigate = useNavigate();

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