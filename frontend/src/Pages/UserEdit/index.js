import { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Cookies from "js-cookie";
import API from "../../Services/api";
import { useForm } from "react-hook-form";

export default function UserEdit() {
   const [courses, setCourses] = useState([]);
   const [user, setUser] = useState(null);
   const [profile, setProfile] = useState(null);
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (!userCookie) return;

    try {
      const { id } = JSON.parse(userCookie);

      API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));

      API.get("/users/" + id)
        .then(res => {
          const userData = res.data;
          setUser(userData);

          // Se existe profileId, pega
        if (userData.profileId) {
          const profileId = userData.profileId._path?.segments?.[1];
          if (profileId) {
            API.get("/profiles/" + profileId)
              .then(res => setProfile(res.data))
              .catch(err => console.error(err));
          }
        }
      })
      .catch(err => console.error(err));
  } catch (err) {
    console.error("Erro ao ler cookie:", err);
  }
}, []);

  console.log(user)
  console.log(profile)


  const onSubmit = async (data) => {
      try {
       
      } catch (err) {
        console.error(err);
        setErrorMessage(
          err.response?.data?.error || "Erro ao atualizar usuário"
        );
      }
    };

  return (
  <>
    {/* Cabeçalho sem busca */}
        <Header/>

    
       <form onSubmit={handleSubmit(onSubmit)}>
          {/* Formulário de usuário */}

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


            {/* Formulário de perfil */}

            {/* Bio */}
            <div>
              <textarea></textarea>
            </div>
       </form>

    
  </>
  );
}
