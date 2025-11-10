import styled from "styled-components";

// Container estilizado para a grid
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    `repeat(${props.columns}, 1fr)`}; /* Define o número de colunas dinamicamente */
  gap: 1rem; /* Espaçamento entre os cards */
  padding: 0 1rem;
  margin-top: 1rem;
`;

export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;

  .dropdown-btn {
    background-color: #555;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.4rem 0.6rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 0.9rem;
  }

  .dropdown-btn:hover {
    background-color: #777;
  }

  .dropdown-menu {
    position: absolute;
    top: 2.5rem;
    right: 0;
    background-color: #222;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.8rem;
    min-width: 220px;
    z-index: 15;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .section-title {
    font-size: 0.85rem;
    color: #aaa;
    margin-bottom: 0.3rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #ddd;
    font-size: 0.9rem;
    cursor: pointer;
    margin: 0;
    padding: 0.1rem 0;
    user-select: none;
    width: fit-content;
  }

  input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #666;
    border-radius: 4px;
    background-color: #1e1e1e;
    cursor: pointer;
    position: relative;
    display: inline-block;
    transition: all 0.2s ease;
  }

  input[type="checkbox"]:hover {
    border-color: #00bcd4;
  }

  input[type="checkbox"]:checked {
    background-color: #00bcd4;
    border-color: #00bcd4;
  }

  input[type="checkbox"]:checked::after {
    content: "";
    position: absolute;
    left: 4.5px;
    top: 1.5px;
    width: 5px;
    height: 9px;
    border: solid #0a0a0a; /* preto quase puro pra contraste */
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  select {
    background-color: #333;
    color: white;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 0.2rem 0.4rem;
    font-size: 0.85rem;
    width: auto;
    max-width: 140px;
    cursor: pointer;
  }

  .date-range {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
  }

  input[type="date"] {
    background-color: #333;
    color: white;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 0.3rem;
    font-size: 0.85rem;
  }

  span {
    color: #bbb;
    font-size: 0.85rem;
  }

  hr {
    border: none;
    border-top: 1px solid #444;
    margin: 0.5rem 0;
  }

  @media (max-width: 768px) {
    .dropdown-menu {
      right: auto;
      left: 50%;
      transform: translateX(-50%);
      min-width: 90vw;
    }
  }
`;
