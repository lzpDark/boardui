import { useEffect, useState } from 'react';
import useApi from '../shared/api'
import { getUserInformation } from "../shared/user"

const Head = ({ }) => {
    const Api = useApi();
    const [name, setName] = useState('unknown');

    useEffect(() => {
        const userInfo = getUserInformation();
        if (userInfo !== null) {
            setName(userInfo);
        }
    }, []);

    const onLogout = () => {
        Api.logout();
    }

    return (
        <div className="flex justify-between items-center w-full bg-gray-600 text-white px-6 py-3 shadow-md">
            <div className="text-xl font-bold">看板任务管理</div>
            <div className="flex items-center gap-4">
                <p className="text-lg font-medium bg-gray-500/50 text-white px-4 py-1 rounded-md">
                    {name}
                </p>
                <button onClick={onLogout} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md transition-all shadow">
                    登出
                </button>
            </div>
        </div>

    );

}

export default Head;