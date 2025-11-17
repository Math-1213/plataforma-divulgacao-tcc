import React, { useState, useEffect } from 'react';
import api from '../../Services/api'; // Importa sua instância do axios

export default function WorkInfo() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      try {
        // 1. Chamar a API do Adonis
        const response = await api.get('/meus-trabalhos');
        setWorks(response.data); // Os dados vêm prontos do backend
        setLoading(false);

      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message;
        setError('Falha ao buscar trabalhos: ' + errorMsg);
        setLoading(false);
      }
    };

    fetchWorks();
  }, []); // Executa na montagem do componente

  // Renderização
  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Meus Trabalhos</h2>
      {works.length === 0 ? (
        <p>Você ainda não enviou nenhum trabalho.</p>
      ) : (
        <ul>
          {works.map(work => (
            <li key={work.id}>
              <h3>{work.title}</h3>
              <p>{work.description}</p>
              {work.fileURL && (
              <a href={work.fileURL} target="_blank" rel="noopener noreferrer">
                Baixar/Ver {work.fileName}
              </a>
              )}
              <p><small>Enviado em: {new Date(work.createdAt._seconds * 1000).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}