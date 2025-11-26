import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaEdit } from "react-icons/fa";
import API from "../../../Services/api";

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    color: "#000000",
    description: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const res = await API.get("/courses");
    setCourses(res.data || []);
  }

  function openCreateModal() {
    setEditingCourse(null);
    setForm({
      name: "",
      code: "",
      color: "#000000",
      description: "",
    });
    setShowModal(true);
  }

  function openEditModal(course) {
    setEditingCourse(course);
    setForm({
      name: course.name,
      code: course.code,
      color: course.color || "#000000",
      description: course.description || "",
    });
    setShowModal(true);
  }

  async function saveCourse() {
    try {
      const payload = {
        ...form,
        updated_at: new Date(),
      };

      if (editingCourse) {
        // EDITAR
        await API.put(`/courses/${editingCourse.id}`, payload);
      } else {
        // CRIAR
        payload.created_at = new Date();
        await API.post("/courses", payload);
      }

      setShowModal(false);
      loadCourses();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar o curso");
    }
  }

  const filtered = courses.filter((c) => {
    const t = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(t) ||
      c.code?.toLowerCase().includes(t)
    );
  });

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Cursos</h3>

        <Button variant="primary" onClick={openCreateModal}>
          <FaPlus className="me-2" />
          Criar novo curso
        </Button>
      </div>

      {/* Filtro */}
      <Form.Control
        placeholder="Buscar por nome ou código..."
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tabela */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Curso</th>
            <th>Código</th>
            <th>Cor</th>
            <th className="text-center" style={{ width: "90px" }}>
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.code}</td>
              <td>
                <span
                  style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    backgroundColor: c.color || "#000000",
                    borderRadius: "4px",
                    border: "1px solid #555",
                  }}
                ></span>
              </td>

              <td className="text-center">
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => openEditModal(c)}
                >
                  <FaEdit />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCourse ? "Editar Curso" : "Criar Curso"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Nome do Curso</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Código</Form.Label>
              <Form.Control
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cor (HEX)</Form.Label>
              <Form.Control
                type="color"
                value={form.color}
                onChange={(e) =>
                  setForm({ ...form, color: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>

          <Button variant="primary" onClick={saveCourse}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
