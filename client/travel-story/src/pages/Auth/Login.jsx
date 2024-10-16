import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
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

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg  shadow-cyan-200/20">
          <form onSubmit={() => {}}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>
            <input type="text" placeholder="Email" className="input-box" />
            <PasswordInput />
            <p className="text-xs text-slate-500 text-right my-4">
              You don&apos;t have account?{" "}
              <strong
                className="text-[14px] cursor-pointer"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Let&apos;s create
              </strong>
            </p>
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
