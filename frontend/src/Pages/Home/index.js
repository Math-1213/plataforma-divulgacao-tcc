import React, { useState, useEffect } from "react";
import WorkCard from "../../Components/WorkCard";
import Header from "../../Components/Header";
import FilterDropdown from "./FilterDropdown";
import { GridContainer } from "./styles";

export default function Home() {
  const baseWidth = 400;
  const [columns, setColumns] = useState(
    Math.floor(window.innerWidth / baseWidth)
  );

  const handleSearch = (term) => {
    console.log("Buscando por:", term);
  };

  const trabalhos = [
    {
      title: "Análise de Dados em Ambientes de IoT",
      author: "Matheus Silva",
      date: "22/10/2025",
      labels: ["IoT", "Big Data", "Engenharia de Computação"],
      description:
        "Este trabalho explora a coleta e análise de dados em sistemas IoT utilizando técnicas de aprendizado de máquina para otimização de energia.",
    },
    {
      title: "Blockchain e Segurança de Informação",
      author: "Dante Costa",
      date: "18/10/2025",
      labels: ["Blockchain", "Criptografia"],
      description:
        "Um estudo sobre o uso de blockchain para aumentar a segurança em redes corporativas e armazenamento de dados sensíveis.",
    },
  ];

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
      <>
        <Header
          enableSearch={true}
          onSearch={handleSearch}
          FilterDropdown={FilterDropdown}
        />
      </>
      <h2 className="mb-4">Trabalhos Acadêmicos</h2>
      <GridContainer columns={columns} className="py-4">
        {trabalhos.map((t, index) => (
          <div key={index} className="work-card">
            <WorkCard
              title={t.title}
              author={t.author}
              date={t.date}
              labels={t.labels}
              description={t.description}
            />
          </div>
        ))}
      </GridContainer>
    </>
  );
}
