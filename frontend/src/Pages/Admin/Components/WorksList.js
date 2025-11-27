import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import API from "../../../Services/api";

export default function WorksList() {
  const [works, setWorks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadWorks();
  }, []);

  async function loadWorks() {
    const response = await API.get("/works");
    setWorks(response.data || []);
  }
  const filtered = works.filter((w) => {
    const term = search.toLowerCase();

    const authorsString = Array.isArray(w.users)
      ? w.users.join(" ").toLowerCase()
      : "";

    const courseName =
      typeof w.course === "string"
        ? w.course.toLowerCase()
        : typeof w.course === "object" && w.course?.name
        ? w.course.name.toLowerCase()
        : "";

    return authorsString.includes(term) || courseName.includes(term);
  });

  // Função para mostrar o nome do curso
  function getCourseName(course) {
    if (!course) return "—";
    if (typeof course === "object") return course.name || "—";

    return "—";
  }

  return (
    <>
      <h3 className="fw-bold mb-4">Trabalhos</h3>

      <Form.Control
        type="text"
        placeholder="Buscar por curso ou usuário..."
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Curso</th>
            <th>Titulo</th>
            <th>Usuários</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((w) => (
            <tr key={w.id}>
              <td>{getCourseName(w.course)}</td>
              <td>{w.title}</td>

              <td>
              {console.log(w.authors)}
                {Array.isArray(w.authors)
                  ? w.authors.map(a => a.name).join(", ")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
