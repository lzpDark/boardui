import { useRef } from "react";
import useApi from "../shared/api"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const UserSchema = z
    .object({
        username: z
            .string()
            .min(1, { message: "用户名不能为空" })
            .max(20, { message: "用户名长度不合法" }),
        // email: z.string().email({ message: "邮箱格式不正确" }),
        password: z
            .string()
            .min(6, { message: "密码长度必须大于6" })
            .max(20, { message: "密码长度必须小于20" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "密码不匹配",
        path: ["confirmPassword"], // path of error
    });

const Register = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: zodResolver(UserSchema), // Apply the zodResolver
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }); // Make a POST request
            const { errors = {} } = await response.json();

            // Define a mapping between server-side field names and their corresponding client-side names
            const fieldErrorMapping = {
                username: "username",
                email: "email",
                password: "password",
                confirmPassword: "confirmPassword",
            };

            // Find the first field with an error in the response data
            const fieldWithError = Object.keys(fieldErrorMapping).find(
                (field) => errors[field]
            );

            // If a field with an error is found, update the form error state using setError
            if (fieldWithError) {
                // Use the ValidFieldNames type to ensure the correct field names
                setError(fieldErrorMapping[fieldWithError], {
                    type: "server",
                    message: errors[fieldWithError],
                });
            }
            // success
            if(response.status === 200 && !fieldWithError) {
                navigate("/register_success");
                return;
            }
        } catch (error) {
            console("Submitting form failed!", error);
        }
    };

    const FormField = ({
        type,
        placeholder,
        name,
        register,
        error,
        label,
    }) => {
        return (
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">{label}</label>
                <input
                    type={type}
                    placeholder={placeholder}
                    {...register(name)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
            <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">欢迎注册</h1>
                    <p className="text-sm text-gray-500">请填写以下信息以创建账户</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        type="text"
                        placeholder="请输入用户名"
                        name="username"
                        register={register}
                        error={errors.username}
                        label="用户名"
                    />

                    {false && <FormField
                        type="email"
                        placeholder="请输入邮箱"
                        name="email"
                        register={()=>{}}
                        error={errors.email}
                        label="邮箱"
                    />}

                    <FormField
                        type="password"
                        placeholder="请输入密码"
                        name="password"
                        register={register}
                        error={errors.password}
                        label="密码"
                    />

                    <FormField
                        type="password"
                        placeholder="请再次输入密码"
                        name="confirmPassword"
                        register={register}
                        error={errors.confirmPassword}
                        label="确认密码"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        注册
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    已有账号？
                    <a href="/login" className="ml-1 text-blue-500 hover:text-blue-700">立即登录</a>
                </div>
            </div>
        </div>

    );
}

export default Register;