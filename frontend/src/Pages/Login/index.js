import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from '../../Services/api'
import Cookies from 'js-cookie'


export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/auth/login', {
        email: data.login,
        password: data.senha,
      })

      console.log('Login bem-sucedido:', res.data)
      Cookies.set('token', res.data.token)
      navigate('/home')
    } catch (err) {
      console.error(err)
      if (err.response?.status === 404) {
        setErrorMessage("Usuário não encontrado");
      } else {
        setErrorMessage(err.response?.data?.error || "Erro de conexão");
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "22rem" }}>
        <h3 className="text-center mb-4">Acesso ao Hub</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de Login */}
          <div className="mb-3">
            <label className="form-label">Login</label>
            <input
              type="text"
              className={`form-control ${errors.login ? "is-invalid" : ""}`}
              placeholder="Digite seu login"
              {...register("login", { required: "O login é obrigatório" })}
            />
            {errors.login && (
              <div className="invalid-feedback">{errors.login.message}</div>
            )}
          </div>

          {/* Campo de Senha */}
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.senha ? "is-invalid" : ""}`}
                placeholder="Digite sua senha"
                {...register("senha", { required: "A senha é obrigatória" })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.senha && (
              <div className="invalid-feedback d-block">{errors.senha.message}</div>
            )}
          </div>

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          {/* Botão */}
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>

        {/* Link de cadastro */}
        <div className="text-center mt-3">
          <span>Não tem conta? </span>
          <Link to="/register" className="text-decoration-none">
            Crie uma agora
          </Link>
        </div>
      </div>
    </div>
  );
}
