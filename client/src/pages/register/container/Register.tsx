
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import loginBG from "../../login/assets/loginImage.png";
import logo from "../../../shared/assets/Logo.png";
import RegisterForm from "../components/RegisterForm";
const Register = () => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 bg-white">
      <div className="hidden md:block">
        <img
          src={loginBG}
          alt="Login Background"
          className="h-screen w-full object-cover"
        />
      </div>


      <div className="w-full flex items-center justify-center h-screen bg-[#F8F8FD]">
        <div className="w-full max-w-md px-8">
          <img
            src={logo}
            alt="Quick Hire Logo"
            className="mx-auto mb-6 object-contain"
          />

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to RentEase 👋
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign up to hire skilled professionals quickly and securely.
            </p>

            <h2 className="mt-4 text-xl font-semibold text-[#034DA2]">
              Registration
            </h2>
          </div>
          <RegisterForm></RegisterForm>

        

          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
                <BsArrowRight size={16} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
