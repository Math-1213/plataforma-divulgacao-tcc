import { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Cookies from "js-cookie";
import API from "../../Services/api";
import { useForm, useFieldArray } from "react-hook-form";

export default function UserEdit() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      courseId: "",
      bio: "",
      social: [],  // redes sociais dinâmicas
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userCookie = Cookies.get("user");
        if (!userCookie) return;

        const { id } = JSON.parse(userCookie);

        const [resUser, resCourses] = await Promise.all([
          API.get("/users/" + id),
          API.get("/courses"),
        ]);

        const userData = resUser.data;
        setUser(userData);
        setCourses(resCourses.data);

        let profileData = null;

        if (userData.profileId) {
          const profileId = userData.profileId?._path?.segments?.[1];
          if (profileId) {
            const resProfile = await API.get("/profiles/" + profileId);
            profileData = resProfile.data;
            setProfile(profileData);
            console.log(profileData);
          }
        }

        reset({
          name: userData.name ?? "",
          courseId: userData.courseId?._path?.segments?.[1] ?? "",
          bio: profileData?.bio ?? "",
          social: profileData?.redes ?? [], // redes sociais
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setSuccessMessage("");
      setErrorMessage("");

      // 1. Atualizar ou criar o profile
      let profileId = profile?.id;

      if (profile) {
        // Se já existe, apenas atualiza
        await API.put(`/profiles/${profile.id}`, {
          bio: data.bio,
          redes: data.social,
        });

      } else {
        // Se NÃO existe, cria e obtém o ID retornado
        const res = await API.post(`/profiles`, {
          bio: data.bio,
          redes: data.social,
        });

      profileId = res.data.id;  // <- ID do novo profile
    }

    await API.put(`/users/${user.id}`, {
      name: data.name,
      courseId: data.courseId,
      profileId: profileId,  // IMPORTANTE
    });


      setSuccessMessage("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.error || "Erro ao atualizar o perfil"
      );
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Carregando...</div>;
  }

  return (
    <>
      <Header />

      <div className="container d-flex justify-content-center mt-5">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6 bg-white shadow p-4 rounded-4">

          <h1 className="h4 fw-bold mb-4 text-secondary">
            ✏️ Editar Perfil
          </h1>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Nome */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Nome</label>
            <input
            {...register("name", { required: "O nome é obrigatório" })}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Seu nome"
          />
          {errors.name && (
            <div className="invalid-feedback">
              {errors.name.message}
            </div>
          )}
        </div>

        {/* Curso */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Curso</label>
          <select
            {...register("courseId", { required: "Selecione um curso" })}
            className={`form-select ${errors.courseId ? "is-invalid" : ""}`}
          >
            <option value="">Selecione um curso</option>
              {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
            ))}
          </select>

          {errors.courseId && (
            <div className="invalid-feedback">
              {errors.courseId.message}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Bio</label>
          <textarea
            {...register("bio")}
            className="form-control"
            rows={4}
            placeholder="Fale um pouco sobre você..."
          ></textarea>
        </div>

        {/* Redes sociais */}
        <div className="mt-4">
          <label className="form-label fw-bold text-secondary">Redes sociais</label>

          {fields.length === 0 && (
            <p className="text-muted small">Nenhuma rede social adicionada.</p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="border rounded p-3 mb-3 bg-light">

              <div className="row g-3 align-items-end">

                {/* Tipo */}
                <div className="col-md-4">
                  <label className="form-label">Tipo</label>
                  <input
                    {...register(`social.${index}.type`, {
                    required: "Informe o tipo",
                    })}
                    className="form-control"
                    placeholder="GitHub"
                  />
                </div>

                {/* URL */}
                <div className="col-md-6">
                  <label className="form-label">URL</label>
                  <input
                    {...register(`social.${index}.url`, {
                      required: "Informe a URL",
                    })}
                    className="form-control"
                    placeholder="https://..."
                  />
                </div>

                {/* Remover */}
                <div className="col-md-2 text-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={() => remove(index)}
                  >
                    Remover
                  </button>
                </div>
              </div>

            </div>
          ))}

          {/* Botão adicionar */}
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={() => append({ type: "", url: "" })}
          >
            + Adicionar rede social
          </button>
        </div>
        
        
          {/* Sucesso */}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {/* Erro */}
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
        

        {/* Botão submit */}
        <button
          type="submit"
          className="btn btn-success w-100 mt-4 py-2 fw-semibold"
        >
          Salvar alterações
        </button>

      </form>
    </div>
  </div>

    </>
  );
}
