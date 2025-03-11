export default function RegisterSuccess() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
            <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg text-center">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">注册成功！</h1>
                <p className="text-sm text-gray-600 mb-6">恭喜您，您的账户已成功创建！请点击下方按钮进入登录页面。</p>
                
                <a
                    href="/login"
                    className="block w-full py-3 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    去登录
                </a>
            </div>
        </div>
    );
}
