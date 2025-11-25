import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../Services/api";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
        courseRef: data.courseId, 
      });

      setSuccessMessage("Usuário criado com sucesso!");
      setErrorMessage("");

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.error || "Erro ao criar usuário"
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "25rem" }}>
        <h3 className="text-center mb-4">Criar Conta</h3>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Nome */}
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Seu nome"
              {...register("name", {
                required: "O nome é obrigatório",
              })}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Digite seu email"
              {...register("email", {
                required: "O email é obrigatório",
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* courseId */}
          <select
            className={`form-control ${errors.courseId ? "is-invalid" : ""}`}
            {...register("courseId", { required: "Selecione um curso" })}
          >
            <option value="">Selecione um curso</option>
  
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>


          {/* Senha */}
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Crie uma senha"
                {...register("password", {
                  required: "A senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres",
                  },
                })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="mb-3">
            <label className="form-label">Confirmar Senha</label>
            <div className="input-group">
              <input
                type={showConfirm ? "text" : "password"}
                className={`form-control ${errors.confirm ? "is-invalid" : ""}`}
                placeholder="Repita a senha"
                {...register("confirm", {
                  required: "Confirme sua senha",
                  validate: (value) =>
                    value === watch("password") || "As senhas não coincidem",
                })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirm && (
              <div className="invalid-feedback d-block">
                {errors.confirm.message}
              </div>
            )}
          </div>

          {/* Mensagens */}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Botão */}
          <button type="submit" className="btn btn-primary w-100">
            Criar Conta
          </button>
        </form>

        <div className="text-center mt-3">
          <span>Já possui conta? </span>
          <Link to="/" className="text-decoration-none">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
