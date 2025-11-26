import React, { useState, useEffect } from "react";
import WorkCard from "../../Components/WorkCard";
import { Container, Row, Col } from "react-bootstrap";
import API from "../../Services/api";
import Cookies from "js-cookie";
import Header from "../../Components/Header";

export default function WorkInfo() {
  const baseWidth = 400;
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Novo estado para tratar erros de autenticação/API

  // --- 1. CHAMADA DE API FILTRADA ---
  useEffect(() => {
    async function loadMyWorks() {
      try {
        // CHAMADA CHAVE: Usa o endpoint que filtra pelo usuário logado.
        const workList = await API.get("/my-works");

        // Ordenação de data (mantida)
        const sortedData = workList.data.sort((a, b) => {
          const dateA = new Date(a.creationDate);
          const dateB = new Date(b.creationDate);
          return dateA - dateB;
        });

        setWorks(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar Meus Trabalhos:", err.response || err);

        // Trata erro 401 (Não autorizado) ou falha de conexão
        if (err.response && err.response.status === 401) {
          setError("Sessão expirada. Faça login novamente para ver seus trabalhos.");
        } else {
          setError("Falha ao carregar trabalhos. Verifique sua conexão com a API.");
        }
        setLoading(false);
      }
    }
    loadMyWorks();
  }, []); // Array de dependências vazio para rodar apenas uma vez.

  // 2. Lógica Responsiva (Mantida)
  useEffect(() => {
    const calculateColumns = () => {
      const windowWidth = window.innerWidth;
      const numberOfColumns = Math.floor(windowWidth / baseWidth);
      // Não é estritamente necessário salvar em 'columns' se o layout for puramente Bootstrap,
      // mas mantemos para seguir a estrutura original do Home.js.
    };
    calculateColumns();
    window.addEventListener("resize", calculateColumns);

    return () => {
      window.removeEventListener("resize", calculateColumns);
    };
  }, []);

  // --- 3. RENDERIZAÇÃO DE ESTADO ---
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <p>Carregando seus trabalhos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h2 style={{ color: 'red' }}>{error}</h2>
      </Container>
    );
  }

  return (

    <>
      <Header
        enableSearch={false}
      />
      <Container fluid className="py-4">
        <Row className="justify-content-center text-center mb-4">
          <Col xs={12}>
            <h2 className="fw-bold text-dark">Meus Trabalhos Publicados</h2> {/* Título alterado */}
          </Col>
        </Row>

        <Row className="g-4 justify-content-center">
          {works && works.length > 0 ? (
            works.map((t, index) => (
              <Col
                key={index}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="d-flex justify-content-center"
              >
                <WorkCard
                  title={t.title}
                  author={t.authors}
                  date={new Date(t.creationDate)}
                  labels={t.labels}
                  description={t.description}
                />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center text-muted py-5">
              <p>Você ainda não é autor de nenhum trabalho publicado.</p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}