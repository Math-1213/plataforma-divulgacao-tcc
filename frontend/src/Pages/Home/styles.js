import styled from "styled-components";

// Container estilizado para a grid
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    `repeat(${props.columns}, 1fr)`}; /* Define o número de colunas dinamicamente */
  gap: 1rem; /* Espaçamento entre os cards */
  padding: 0 1rem; /* Espaçamento interno (padding) */
  margin-top: 1rem;
`;
