import LoginPage from "_core/pages/Login";
import { useLogin } from "../hooks/useAuth";

const Login = () => <LoginPage useLogin={useLogin} />;

export default Login;
