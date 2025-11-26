import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Services/api";
import Cookies from "js-cookie";
import Header from "../../Components/Header";
import {
  formStyle,
  inputStyle,
  labelStyle,
  selectedItemStyle,
  resultListStyle,
  resultItemStyle,
  selectedContainerStyle,
} from "./styles";

export default function AddWork() {
  // --- Dados do Formulário ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  // IDs selecionados (o que será enviado para o back)
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);
  const [UserID, setUserID] = useState();

  // --- Dados Disponíveis (vindos da API) ---
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableLabels, setAvailableLabels] = useState([]);

  // --- Search States ---
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [labelSearchTerm, setLabelSearchTerm] = useState("");

  // --- Controle ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- Edição ---
  const { id } = useParams(); // se existir, estamos editando
  const isEditing = Boolean(id);

  // 1. Buscar os dados ao carregar a página
  useEffect(() => {
    // Carrega o uid
    const uid = JSON.parse(Cookies.get("user")).uid || null;
    setUserID(uid);

    const courseId = JSON.parse(Cookies.get("user")).course.id || null;
    setSelectedCourseId(courseId);

    // Carrega Informações
    async function loadData() {
      try {
        const [coursesRes, usersRes, labelsRes] = await Promise.all([
          api.get("/courses"),
          api.get("/users"),
          api.get("/labels"),
        ]);
        setAvailableCourses(coursesRes.data);
        setAvailableUsers(usersRes.data);
        setAvailableLabels(labelsRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados auxiliares:", err);
        setError(
          "Não foi possível carregar as listas de cursos, usuários ou labels."
        );
      }
    }
    // Se estiver editando, buscar dados do trabalho
    if (isEditing) {
      const loadWorkToEdit = async () => {
        try {
          const res = await api.get(`/works/${id}`);
          const w = res.data;

          setTitle(w.title);
          setDescription(w.description || "");
          setSelectedAuthorIds(w.authorIds || []);

          // Arquivo não precisa setar (você não recebe o arquivo bruto)
          // Só precisa permitir enviar um novo se quiser.
        } catch (err) {
          console.error("Erro ao carregar trabalho:", err);
          setError("Não foi possível carregar os dados do trabalho.");
        }
      };

      loadWorkToEdit();
    }
    loadData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  // --- LÓGICA DE BUSCA E SELEÇÃO REUTILIZÁVEL ---

  // Função genérica para adicionar um ID e limpar a busca
  const addItem = (id, setter, searchSetter) => {
    setter((prev) => (prev.includes(id) ? prev : [...prev, id]));
    searchSetter(""); // Limpa o campo de busca
  };

  // Função genérica para remover um ID
  const removeItem = (id, setter) => {
    setter((prev) => prev.filter((item) => item !== id));
  };

  // Filtra a lista de usuários baseada no termo de busca
  const filteredUsers = availableUsers.filter(
    (user) =>
      (user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())) &&
      !selectedAuthorIds.includes(user.id) &&
      userSearchTerm.length > 1 // Só mostra resultados após 2+ caracteres
  );

  // Filtra a lista de labels baseada no termo de busca
  const filteredLabels = availableLabels.filter(
    (label) =>
      label.name?.toLowerCase().includes(labelSearchTerm.toLowerCase()) &&
      !selectedLabelIds.includes(label.id) &&
      labelSearchTerm.length > 1
  );

  // Encontra o objeto completo do item selecionado para mostrar o nome
  const getSelectedItems = (selectedIds, availableItems) => {
    return availableItems.filter((item) => selectedIds.includes(item.id));
  };

  // --- LÓGICA DE SUBMISSÃO ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !selectedCourseId) {
      setError("Título e Curso são obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("work_file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("courseId", selectedCourseId);
    formData.append("authorIds", JSON.stringify(selectedAuthorIds));
    formData.append("labelsIds", JSON.stringify(selectedLabelIds));
    formData.append("uploaderId", UserID);

    // ENVIAR ARQUIVO SOMENTE SE O USUÁRIO TROCAR
    if (file) formData.append("work_file", file);

    try {
      if (isEditing) {
        await api.put(`/works/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Trabalho atualizado com sucesso!");
      } else {
        await api.post("/works", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Trabalho enviado com sucesso!");
      }

      navigate("/myworks");
    } catch (err) {
      console.error(err);
      setError("Falha ao salvar o trabalho.");
    }

    setLoading(false);
  };

  return (
    <>
      <Header enableSearch={false} />
      <div style={{ padding: "20px" }}>
        <h2>{isEditing ? "Editar Trabalho" : "Adicionar Novo Trabalho"}</h2>

        {error && (
          <div
            style={{
              padding: "10px",
              color: "white",
              backgroundColor: "red",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* TÍTULO */}
          <label style={labelStyle}>Título (Obrigatório):</label>
          <input
            style={inputStyle}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* DESCRIÇÃO */}
          <label style={labelStyle}>Descrição:</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* CURSO (DROPDOWN) */}
          {/* <label style={labelStyle}>Curso (Obrigatório):</label>
        <select
          style={inputStyle}
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          required
        >
          <option value="">Selecione um curso...</option>
          {availableCourses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select> */}

          {/* --- AUTORES (SEARCHABLE MULTI-SELECT) --- */}
          <label style={labelStyle}>Co-Autores (Nome ou Email):</label>
          <div style={{ position: "relative" }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Digite para buscar e selecionar autores..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
            {filteredUsers.length > 0 && (
              <div style={resultListStyle}>
                {filteredUsers.slice(0, 5).map(
                  (
                    user // Limita a 5 resultados
                  ) => (
                    <div
                      key={user.id}
                      style={resultItemStyle}
                      onClick={() =>
                        addItem(
                          user.id,
                          setSelectedAuthorIds,
                          setUserSearchTerm
                        )
                      }
                    >
                      {user.name} ({user.email})
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Chips de Autores Selecionados */}
          <div style={selectedContainerStyle}>
            {getSelectedItems(selectedAuthorIds, availableUsers).map((user) => (
              <span key={user.id} style={selectedItemStyle}>
                {user.name}
                <button
                  type="button"
                  onClick={() => removeItem(user.id, setSelectedAuthorIds)}
                  style={{
                    marginLeft: "5px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#888",
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
            {selectedAuthorIds.length === 0 && (
              <span style={{ color: "#999" }}>
                Nenhum co-autor selecionado.
              </span>
            )}
          </div>

          {/* --- LABELS (SEARCHABLE MULTI-SELECT) --- */}
          {/* <label style={labelStyle}>Tags / Labels:</label>
        <div style={{ position: 'relative' }}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Digite para buscar e selecionar tags..."
            value={labelSearchTerm}
            onChange={(e) => setLabelSearchTerm(e.target.value)}
          />
          {filteredLabels.length > 0 && (
            <div style={resultListStyle}>
              {filteredLabels.slice(0, 5).map(label => (
                <div
                  key={label.id}
                  style={resultItemStyle}
                  onClick={() => addItem(label.id, setSelectedLabelIds, setLabelSearchTerm)}
                >
                  {label.name}
                </div>
              ))}
            </div>
          )}
        </div> */}

          {/* Chips de Labels Selecionadas */}
          {/* <div style={selectedContainerStyle}>
          {getSelectedItems(selectedLabelIds, availableLabels).map(label => (
            <span key={label.id} style={selectedItemStyle}>
              {label.name}
              <button
                type="button"
                onClick={() => removeItem(label.id, setSelectedLabelIds)}
                style={{ marginLeft: '5px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#888' }}
              >
                &times;
              </button>
            </span>
          ))}
          {selectedLabelIds.length === 0 && <span style={{ color: '#999' }}>Nenhuma tag selecionada.</span>}
        </div> */}

          {/* ARQUIVO */}
          <label style={labelStyle}>Arquivo (Obrigatório):</label>
          <input
            style={inputStyle}
            type="file"
            name="work_file"
            onChange={handleFileChange}
            required={!isEditing}
          />

          <button
            type="submit"
            style={{
              ...inputStyle,
              background: isEditing ? "#ffc107" : "#28a745",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            disabled={loading}
          >
            {loading
              ? "Salvando..."
              : isEditing
              ? "Salvar Alterações"
              : "Enviar Trabalho"}
          </button>
        </form>
      </div>
    </>
  );
}
