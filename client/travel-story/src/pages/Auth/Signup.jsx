import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput.jsx";
import { useState } from "react";
import { validEmail } from "../../utils/helper.js";
import userApi from "../../api/modules/user.api.js";
import { setToken } from "../../utils/token.js";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Input validation
    if (!validEmail(email)) {
      setError("Please enter a valid email!");
      return;
    }

    if (!password) {
      setError("Please enter your secret password ^^");
      return;
    }

    setError("");

    try {
      const { response, error } = await userApi.signup({
        fullname: name,
        email,
        password,
      });

      if (response && !error) {
        setToken(response.accessToken);
        navigate("/dashboard");
      } else {
        setError(
          error?.message || "An unexpected error occurred. Please try again."
        );
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box left-10 -top-40"></div>
      <div className="login-ui-box bg-cyan-200 -bottom-40 left-1/2"></div>

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Join The <br /> Adventure
            </h4>
            <p className="text-[17px] text-white leading-6 pr-7 mt-4">
              Create an account to share some sh!t memories on this cute app bro
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl font-semibold mb-7">Signup</h4>
            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              You already have an account?{" "}
              <strong
                className="text-[16px] cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Let&apos;s jump right in!
              </strong>
            </p>

            {error && (
              <p className="text-red-500 text-xs pb-1">
                {error.message || error}
              </p>
            )}

            <button type="submit" className="btn-primary">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
