import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import API from "../../../Services/api";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const response = await API.get("/users");
    setUsers(response.data || []);
  }

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.courseName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <h3 className="fw-bold mb-4">Usuários</h3>

      <Form.Control
        type="text"
        placeholder="Buscar por nome, curso ou email..."
        className="mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Curso</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.courseName}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
