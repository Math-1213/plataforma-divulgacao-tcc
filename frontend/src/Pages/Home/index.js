import WorkCard from "../../Components/WorkCard";

export default function Home() {
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

  return (
    <div className="container py-4">
      <h2 className="mb-4">Trabalhos Acadêmicos</h2>

      {trabalhos.map((t, index) => (
        <WorkCard
          key={index}
          title={t.title}
          author={t.author}
          date={t.date}
          labels={t.labels}
          description={t.description}
        />
      ))}
    </div>
  );
}
