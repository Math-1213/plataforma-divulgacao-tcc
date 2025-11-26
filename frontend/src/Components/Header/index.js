import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeaderWrapper,
  Logo,
  Nav,
  SearchWrapper,
  AccountDropdown,
} from "./styles";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Cookies from "js-cookie";

export default function Header({
  enableSearch = false,
  onSearch,
  FilterDropdown: FilterDropdownComponent,
}) {
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCloseTrigger, setFilterCloseTrigger] = useState(false);
  const [user, setUser] = useState(null);

  // Guarda os filtros retornados pelo FilterDropdown
  const [activeFilters, setActiveFilters] = useState({
    filters: ["Autor", "Curso"],
    dateRange: { start: "", end: "" },
  });

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (err) {
        console.error("Erro ao ler cookie do usuário:", err);
      }
    }
  }, []);

  function logout() {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login");
  }

  function handleSearch(e) {
    e.preventDefault();

    if (onSearch) {
      // envia busca + filtros juntos para o Home
      onSearch(searchTerm, activeFilters);
    }

    // Fecha dropdown depois de buscar
    setFilterCloseTrigger(Date.now());
  }

  // Recebe filtros do componente filho
  function handleFilterChange(filterData) {
    setActiveFilters(filterData);
  }

  return (
    <HeaderWrapper>
      <Logo>
        <h1>Compartilha TCC</h1>
      </Logo>

      {enableSearch && (
        <SearchWrapper>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Pesquisar trabalhos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {FilterDropdownComponent && (
              <FilterDropdownComponent
                onFilterChange={handleFilterChange}
                closeTrigger={filterCloseTrigger}
              />
            )}

            <button type="submit">Buscar</button>
          </form>
        </SearchWrapper>
      )}

      <Nav>
        <ul>
          <li>
            <button onClick={() => navigate("/home")} className="icon-btn">
              <FaHome />
            </button>
          </li>

          <li className="account">
            <button
              onClick={() => setShowAccount(!showAccount)}
              className="icon-btn"
            >
              <FaUserCircle />
            </button>

            {showAccount && (
              <AccountDropdown>
                <div className="user-info">
                  <p>
                    <strong>{user ? `${user.name}` : ""}</strong>
                  </p>
                  {user?.course && <p>{user.course.name}</p>}
                </div>
                <hr />
                <button onClick={() => navigate("/myworks")}>
                  Meus Trabalhos
                </button>
                <button onClick={() => navigate("/addworks")}>
                  Publicar Trabalhos
                </button>
                <hr />
                <button onClick={() => navigate("/account/settings")}>
                  Configurações
                </button>
                <button onClick={logout}>
                  <RiLogoutBoxRLine /> Sair
                </button>
              </AccountDropdown>
            )}
          </li>
        </ul>
      </Nav>
    </HeaderWrapper>
  );
}
