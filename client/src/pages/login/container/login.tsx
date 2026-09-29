import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import loginBG from "../assets/loginImage.png";
import logo from "../../../shared/assets/Logo.png";
import LoginForm from "../components/LoginForm";
const Login = () => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 bg-white">
      <div className="hidden md:block">
        <img
          src={loginBG}
          alt="Login Background"
          className="h-screen w-full object-cover"
        />
      </div>

      {/* Right Side */}
      <div className="w-full flex items-center justify-center h-screen bg-[#F8F8FD]">
        <div className="w-full max-w-md px-8">
          <img
            src={logo}
            alt="FixIt Logo"
            className="mx-auto mb-6 object-contain"
          />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

            <p className="mt-2 text-gray-500">
              Sign in to access your FixIt account and manage your services.
            </p>

            <h2 className="mt-6 text-xl font-semibold text-[#034DA2]">
              Login to Your Account
            </h2>
          </div>

          <LoginForm></LoginForm>

          {/* Back Home */}
          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-600">
            <p>
              Do not have an account?{" "}
              <Link
                to="/registration"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create one now
                <BsArrowRight size={16} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
