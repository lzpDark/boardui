import {useRef} from "react";
import useApi from '../shared/api'

const LoginPage = () => {
    const Api = useApi();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const rememberMeRef = useRef();

    const handleLogin = (e) => {
        Api.login({
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            rememberMe: rememberMeRef.current.checked,
        });
    };

    const handleGuestLogin = (e) => {
        Api.guestLogin();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
            <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">欢迎登录</h1>
                    <div className="flex flex-row m-0 p-0 justify-center items-end">
                        <p className="text-sm text-gray-500">请输入您的账号和密码</p>
                    </div>
                </div>

                <form>
                    <div className="mb-6">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-600"
                        >
                            用户名
                        </label>
                        <input
                            ref={usernameRef}
                            type="text"
                            placeholder="请输入用户名"
                            id="username"
                            autoComplete="username" 
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-600"
                        >
                            密码
                        </label>
                        <input
                            ref={passwordRef}
                            type="password"
                            placeholder="请输入密码"
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input
                                ref={rememberMeRef}
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                className="ml-2 text-sm text-gray-600"
                            >
                                记住我
                            </label>
                        </div>
                        <div>
                            <a
                                href="#reset-password"
                                className="text-sm text-blue-500 hover:text-blue-700"
                            >
                                忘记密码?那就没辙了
                            </a>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        type="button"
                        className="w-full py-3 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        登录
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 text-gray-500 bg-white">或</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGuestLogin}
                        className="w-full py-3 text-sm font-medium text-blue-700 transition-colors bg-white border border-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        游客登录
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        还没有账号?
                        <a
                            href="/register"
                            className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                            立即注册
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;