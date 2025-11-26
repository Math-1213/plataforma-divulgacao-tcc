import React, { useState } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import Header from "../../Components/Header";

// Componentes que serão renderizados
import UsersList from "./Components/UsersList";
import WorksList from "./Components/WorksList";
import CoursesList from "./Components/CoursesList";

export default function AdminPage() {
  const [active, setActive] = useState("usuarios");

  const renderComponent = () => {
    switch (active) {
      case "usuarios":
        return <UsersList />;
      case "trabalhos":
        return <WorksList />;
      case "cursos":
        return <CoursesList />;
      default:
        return <UsersList />;
    }
  };

  return (
    <>
      <Header />

      <Container fluid className="mt-4">
        <Row>
          {/* Sidebar */}
          <Col xs={12} md={3} lg={2} className="border-end">
            <h5 className="fw-bold mt-3 mb-3">Administração</h5>

            <ListGroup>
              <ListGroup.Item
                action
                active={active === "usuarios"}
                onClick={() => setActive("usuarios")}
              >
                Usuários
              </ListGroup.Item>

              <ListGroup.Item
                action
                active={active === "trabalhos"}
                onClick={() => setActive("trabalhos")}
              >
                Trabalhos
              </ListGroup.Item>

              <ListGroup.Item
                action
                active={active === "cursos"}
                onClick={() => setActive("cursos")}
              >
                Cursos
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Conteúdo Principal */}
          <Col xs={12} md={9} lg={10} className="p-4">
            {renderComponent()}
          </Col>
        </Row>
      </Container>
    </>
  );
}
