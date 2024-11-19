import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDashboard, MdPerson, MdVpnKey, MdSwapVert } from "react-icons/md";
import { FaDoorClosed } from "react-icons/fa";
import {
  NavMenuCell,
  NavMenuDivider,
  NavMenuText,
  MenuIconHolder,
} from "./styles";
import { userRole } from "~/utils/tools";

export default function NavMenu() {
  const roleType = useSelector((state) => state.authentication.user.roletype);

  return (
    <>
      <Link to="/dashboard">
        <NavMenuCell>
          <MenuIconHolder>
            <MdDashboard />
          </MenuIconHolder>
          <NavMenuText>Dashboard</NavMenuText>
        </NavMenuCell>
      </Link>
      <NavMenuDivider />
      {userRole(roleType) !== 2 && (
        <>
          <Link to="/users">
            <NavMenuCell>
              <MenuIconHolder>
                <MdPerson />
              </MenuIconHolder>
              <NavMenuText>Usuários</NavMenuText>
            </NavMenuCell>
          </Link>
          {userRole(roleType) !== 0 && (
            <Link to="/keys">
              <NavMenuCell>
                <MenuIconHolder>
                  <MdVpnKey />
                </MenuIconHolder>
                <NavMenuText>Chaves</NavMenuText>
              </NavMenuCell>
            </Link>
          )}
          <Link to="/doors">
            <NavMenuCell>
              <MenuIconHolder>
                <FaDoorClosed />
              </MenuIconHolder>
              <NavMenuText>Portas</NavMenuText>
            </NavMenuCell>
          </Link>
        </>
      )}
      {userRole(roleType) !== 0 && (
        <Link to="/accesses">
          <NavMenuCell>
            <MenuIconHolder>
              <MdSwapVert />
            </MenuIconHolder>
            <NavMenuText>Acessos</NavMenuText>
          </NavMenuCell>
        </Link>
      )}
    </>
  );
}
