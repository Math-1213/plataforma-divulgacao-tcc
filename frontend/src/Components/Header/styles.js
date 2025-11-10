import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
`;

export const Logo = styled.div`
  h1 {
    margin: 0;
    font-size: 1.8rem;
  }
`;

export const Nav = styled.nav`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  li {
    margin-left: 2rem;
  }

  a {
    text-decoration: none;
    color: white;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  a:hover,
  button:hover {
    background-color: #555;
  }
`;
