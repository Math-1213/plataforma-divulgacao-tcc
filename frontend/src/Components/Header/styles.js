import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  background-color: #333;
  color: white;
  position: relative;
`;

export const Logo = styled.div`
  h1 {
    margin: 0;
    font-size: 1.6rem;
  }
`;

export const SearchWrapper = styled.div`
  flex: 1;
  margin: 0 2rem;
  max-width: 500px;

  form {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    padding: 0.4rem 0.6rem;
    border: none;
    border-radius: 5px;
    outline: none;
  }

  button {
    background-color: #555;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
  }

  button:hover {
    background-color: #777;
  }
`;

export const Nav = styled.nav`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
  }

  li {
    margin-left: 1.2rem;
    position: relative;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.4rem;
    background: none;
    border: none;
    padding: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .icon-btn:hover {
    background-color: #555;
  }

  svg {
    color: white;
    font-size: 1.4rem;
  }
`;

export const AccountDropdown = styled.div`
  position: absolute;
  top: 3rem;
  right: 0;
  background-color: #222;
  border: 1px solid #444;
  border-radius: 5px;
  padding: 0.8rem;
  min-width: 200px;
  z-index: 10;

  .user-info {
    font-size: 0.9rem;
    line-height: 1.2;
  }

  hr {
    border: 0;
    border-top: 1px solid #555;
    margin: 0.6rem 0;
  }

  button {
    width: 100%;
    background: none;
    border: none;
    color: white;
    text-align: left;
    padding: 0.4rem 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  button:hover {
    color: #00bcd4;
  }
`;
