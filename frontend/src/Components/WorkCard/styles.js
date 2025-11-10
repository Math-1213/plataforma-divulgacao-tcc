import styled from "styled-components";

// Container para a grid dos cards
export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 0 1rem;
`;

// Estilo do Card
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

// Título do Card
export const CardTitle = styled.h5`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

// Autor e Data
export const CardSubtitle = styled.h6`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

// Labels dentro do Card
export const Label = styled.span`
  background-color: #f0f0f0;
  padding: 0.3rem 0.6rem;
  border-radius: 16px;
  font-size: 0.85rem;
  color: #666;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

// Descrição do Card
export const Description = styled.p`
  font-size: 0.95rem;
  color: #444;
  margin-top: 1rem;
`;

// Mensagem de "Sem temas definidos"
export const NoLabels = styled.span`
  font-size: 0.9rem;
  color: #aaa;
`;
