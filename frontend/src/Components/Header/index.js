import { useNavigate } from "react-router-dom";
import { HeaderWrapper, Logo, Nav } from "./styles";
import { FaBars } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";

export default function Header() {
  const navigate = useNavigate();
  function logout() {
    // Exclui as informações do cache
    console.log("Logout");
    navigate("/login");
  }

  return (
    <HeaderWrapper>
      <Logo>
        <h1>Compartilha TCC</h1>
      </Logo>

      <Nav>
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/account">Conta</a>
          </li>
          <li>
            <button onClick={logout} className="icon-btn">
              <RiLogoutBoxRLine />
            </button>
          </li>
          <li>
            <button onClick={() => {}} className="icon-btn">
              <FaBars />
            </button>
          </li>
        </ul>
      </Nav>
    </HeaderWrapper>
  );
}
