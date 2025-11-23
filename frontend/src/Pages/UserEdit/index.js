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

      <div className="flex justify-center mt-10 px-4">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            ✏️ Editar Perfil
          </h1>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Nome */}
            <div>
              <label className="block mb-1 font-medium">Nome</label>
              <input
                {...register("name", { required: "O nome é obrigatório" })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
                placeholder="Seu nome"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Curso */}
            <div>
              <label className="block mb-1 font-medium">Curso</label>
              <select
                {...register("courseId", { required: "Selecione um curso" })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  errors.courseId
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
              >
                <option value="">Selecione um curso</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-1 font-medium">Bio</label>
              <textarea
                {...register("bio")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                rows={4}
                placeholder="Fale um pouco sobre você..."
              ></textarea>
            </div>

            {/* Redes Sociais */}
            <div className="mt-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Redes sociais
              </label>

              {fields.length === 0 && (
                <p className="text-sm text-gray-500 mb-3">
                  Nenhuma rede social adicionada.
                </p>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col md:flex-row gap-3 items-start bg-gray-50 p-4 rounded-lg border"
                  >
                    {/* Tipo */}
                    <input
                      {...register(`social.${index}.type`, {
                        required: "Informe o tipo",
                      })}
                      placeholder="Tipo (ex: GitHub)"
                      className="w-full px-3 py-2 border rounded-lg"
                    />

                    {/* URL */}
                    <input
                      {...register(`social.${index}.url`, {
                        required: "Informe a URL",
                      })}
                      placeholder="URL"
                      className="w-full px-3 py-2 border rounded-lg"
                    />

                    {/* Remover */}
                    <button
                      type="button"
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => remove(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => append({ type: "", url: "" })}
              >
                + Adicionar rede social
              </button>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Salvar alterações
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
