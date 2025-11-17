import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api'; 

// Estilo simples para organizar o formulário
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '500px',
  margin: '20px auto',
};
const inputStyle = {
  marginBottom: '10px',
  padding: '8px',
  fontSize: '16px',
};
const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

export default function AddWork() {
  // States para os campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [authorIds, setAuthorIds] = useState(''); 
  const [labelsIds, setLabelsIds] = useState(''); 
  const [file, setFile] = useState(null);

  // States de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title) {
      setError('Título e Arquivo são obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();

    // 1. Adiciona o arquivo
    formData.append('work_file', file);

    // 2. Adiciona os campos de texto
    formData.append('title', title);
    formData.append('description', description);
    formData.append('courseId', courseId);

    // 3. Converte as strings de IDs (separadas por vírgula) em arrays JSON
    const authorIdsArray = authorIds.split(',').map(id => id.trim()).filter(Boolean);
    const labelsIdsArray = labelsIds.split(',').map(id => id.trim()).filter(Boolean);
    
    formData.append('authorIds', JSON.stringify(authorIdsArray));
    formData.append('labelsIds', JSON.stringify(labelsIdsArray));

    try {
      // 4. Enviar FormData para a API
      await api.post('/works', formData);

      setLoading(false);
      alert('Trabalho enviado com sucesso!');
      navigate('/myworks');

    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data?.error || err.message;
      setError('Falha ao enviar o trabalho: ' + errorMsg);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Adicionar Novo Trabalho</h2>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        
        <label style={labelStyle} htmlFor="title">Título (Obrigatório):</label>
        <input
          style={inputStyle}
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label style={labelStyle} htmlFor="description">Descrição:</label>
        <textarea
          style={{...inputStyle, minHeight: '80px'}}
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label style={labelStyle} htmlFor="courseId">ID do Curso:</label>
        <input
          style={inputStyle}
          type="text"
          id="courseId"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />

        <label style={labelStyle} htmlFor="authorIds">IDs dos Autores (separados por vírgula):</label>
        <input
          style={inputStyle}
          type="text"
          id="authorIds"
          value={authorIds}
          onChange={(e) => setAuthorIds(e.target.value)}
          placeholder="ex: uid1, uid2, uid3"
        />

        <label style={labelStyle} htmlFor="labelsIds">IDs das Labels (separados por vírgula):</label>
        <input
          style={inputStyle}
          type="text"
          id="labelsIds"
          value={labelsIds}
          onChange={(e) => setLabelsIds(e.target.value)}
          placeholder="ex: label1, label2"
        />

        <label style={labelStyle} htmlFor="file">Arquivo (Obrigatório):</label>
        <input
          style={inputStyle}
          type="file"
          id="file"
          onChange={handleFileChange}
          required
        />
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" style={{...inputStyle, background: '#007BFF', color: 'white', cursor: 'pointer'}} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Trabalho'}
        </button>
      </form>
    </div>
  );
}