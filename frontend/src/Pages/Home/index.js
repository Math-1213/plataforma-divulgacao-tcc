import React, { useState, useEffect } from "react";
import WorkCard from "../../Components/WorkCard";
import Header from "../../Components/Header";
import FilterDropdown from "./FilterDropdown";
import { Container, Row, Col } from "react-bootstrap";
import { GridContainer } from "./styles";
import API from "../../Services/api";

export default function Home() {
  const baseWidth = 400;
  const [columns, setColumns] = useState(
    Math.floor(window.innerWidth / baseWidth)
  );
  const [works, setWorks] = useState([]);

  const handleSearch = (term) => {
    console.log("Buscando por:", term);
  };

  // const works = [
  //   {
  //     title: "Análise de Dados em Ambientes de IoT",
  //     author: "Matheus Silva",
  //     date: "22/10/2025",
  //     labels: ["IoT", "Big Data", "Engenharia de Computação"],
  //     description:
  //       "Este trabalho explora a coleta e análise de dados em sistemas IoT utilizando técnicas de aprendizado de máquina para otimização de energia.",
  //   },
  //   {
  //     title: "Blockchain e Segurança de Informação",
  //     author: "Dante Costa",
  //     date: "18/10/2025",
  //     labels: ["Blockchain", "Criptografia"],
  //     description:
  //       "Um estudo sobre o uso de blockchain para aumentar a segurança em redes corporativas e armazenamento de dados sensíveis.",
  //   },
  // ];

  // GET WORKS
  useEffect(() => {
    async function loadWorks() {
      const workList = await API.get("/works");
      const sortedData = workList.data.sort((a, b) => {
        const dateA = new Date(a.creationDate)
        const dateB = new Date(b.creationDate)
        return dateA - dateB;
      });
      setWorks(sortedData);
      console.log(sortedData);
    }
    loadWorks();
  }, []);

  // Tela Responsivel
  useEffect(() => {
    const calculateColumns = () => {
      const windowWidth = window.innerWidth; // Largura da janela
      const numberOfColumns = Math.floor(windowWidth / baseWidth); // Calcula o número de colunas
      setColumns(numberOfColumns); // Atualiza o estado com o número de colunas calculado
    };
    calculateColumns();
    window.addEventListener("resize", calculateColumns);

    return () => {
      window.removeEventListener("resize", calculateColumns);
    };
  }, []);

  return (
    <>
      {/* Cabeçalho com busca */}
      <Header
        enableSearch={true}
        onSearch={handleSearch}
        FilterDropdown={FilterDropdown}
      />

      {/* Conteúdo principal */}
      <Container fluid className="py-4">
        <Row className="justify-content-center text-center mb-4">
          <Col xs={12}>
            <h2 className="fw-bold text-dark">Trabalhos Acadêmicos</h2>
          </Col>
        </Row>

        {/* Grid responsivo de cards */}
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
              <p>Nenhum trabalho encontrado.</p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}
