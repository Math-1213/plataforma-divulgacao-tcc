import React, { useState, useEffect } from "react";
import WorkCard from "../../Components/WorkCard";
import Header from "../../Components/Header";
import FilterDropdown from "./FilterDropdown";
import { Container, Row, Col } from "react-bootstrap";
import API from "../../Services/api";

export default function Home() {
  const baseWidth = 400;

  const [columns, setColumns] = useState(
    Math.floor(window.innerWidth / baseWidth)
  );

  const [allWorks, setAllWorks] = useState([]); // Lista original
  const [works, setWorks] = useState([]); // Lista filtrada

  const [searchTerm, setSearchTerm] = useState("");
  const [filterData, setFilterData] = useState({
    filters: ["Autor", "Curso"],
    dateRange: { start: "", end: "" },
  });

  // GET WORKS
  useEffect(() => {
    async function loadWorks() {
      const response = await API.get("/works");
      const sorted = response.data.sort(
        (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
      );

      setAllWorks(sorted);
      setWorks(sorted);
    }

    loadWorks();
  }, []);

  // Tela Responsiva
  useEffect(() => {
    const calculateColumns = () => {
      setColumns(Math.floor(window.innerWidth / baseWidth));
    };
    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    return () => window.removeEventListener("resize", calculateColumns);
  }, []);

  // Recebe filtros do dropdown
  function handleFilterChange(data) {
    setFilterData(data);
  }

  // Recebe termo de busca
  function handleSearch(term, activeFilters) {
    setSearchTerm(term);
    handleSearchAndFilter(term, activeFilters);
  }

  // Aplica filtro + busca
  function handleSearchAndFilter(term, filtersData) {
    let filtered = [...allWorks];

    const { filters, dateRange } = filtersData;
    const { start, end } = dateRange;

    function parseLocalDate(dateString) {
      if (!dateString) return null;

      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day); // <- sem timezone
    }
    const startDate = parseLocalDate(start);
    const endDate = parseLocalDate(end);

    term = term.toLowerCase();

    // BUSCA POR TEXTO
    if (term.trim() !== "") {
      filtered = filtered.filter((w) => {
        const matchTitle = w.title?.toLowerCase().includes(term);

        const matchAuthor =
          filters.includes("Autor") &&
          w.course.name.toLowerCase().includes(term);

        const matchCurso =
          filters.includes("Curso") &&
          Array.isArray(w.authors) &&
          w.authors.some((a) => String(a.name).toLowerCase().includes(term));

        return matchTitle || matchCurso || matchAuthor;
      });
    }

    // FILTRO DE DATA
    if (startDate) {
      filtered = filtered.filter((w) => {
        const workDate = new Date(w.creationDate).setHours(0, 0, 0, 0);
        return workDate >= startDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter((w) => {
        const workDate = new Date(w.creationDate).setHours(0, 0, 0, 0);
        console.log(workDate, endDate);
        return workDate <= endDate;
      });
    }

    console.log(filtered);
    setWorks(filtered);
  }

  // Toda vez que filtros mudam → aplica novamente
  useEffect(() => {
    handleSearchAndFilter(searchTerm, filterData);
  }, [filterData]);

  // DOWNLOAD
  async function downloadWork(t) {
    try {
      const endpoint = t.fileURL.startsWith("/uploads")
        ? t.fileURL
        : `/download/${t.id}`;

      const response = await API.get(endpoint, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = t.fileName || "download";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Erro ao baixar arquivo:", err);
    }
  }

  return (
    <>
      {/* Cabeçalho com busca e filtros */}
      <Header
        enableSearch={true}
        onSearch={handleSearch}
        FilterDropdown={FilterDropdown}
        filterProps={{ onFilterChange: handleFilterChange }}
      />

      <Container fluid className="py-4">
        <Row className="justify-content-center text-center mb-4">
          <Col xs={12}>
            <h2 className="fw-bold text-dark">Trabalhos Acadêmicos</h2>
          </Col>
        </Row>

        <Row className="g-4 justify-content-center">
          {works.length > 0 ? (
            works.map((t, i) => (
              <Col
                key={i}
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
                  action={() => downloadWork(t)}
                />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center py-5 text-muted">
              Nenhum trabalho encontrado.
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}
