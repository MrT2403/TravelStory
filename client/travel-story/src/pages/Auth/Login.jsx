import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput.jsx";
import { useState } from "react";
import { validEmail } from "../../utils/helper.js";
import userApi from "../../api/modules/user.api.js";
import { setToken } from "../../utils/token.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validEmail(email)) {
      setError("Please enter a valid email!");
      return;
    }

    if (!password) {
      setError("Please enter your secret ^^");
      return;
    }

    setError("");

    try {
      const { response, error } = await userApi.signin({ email, password });

      if (response && !error) {
        setToken(response.accessToken);
        navigate("/dashboard");
      } else {
        setError(response?.message || error || "An unexpected error occurred.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40"></div>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2"></div>

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-[17px] text-white leading-6 pr-7 mt-4">
              Record your fking life with memorable pictures
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">
              Welcome back, my friend!
            </h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-slate-500 text-right my-4">
              You don&apos;t have an account?{" "}
              <strong
                className="text-[16px] cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Let&apos;s create
              </strong>
            </p>

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
