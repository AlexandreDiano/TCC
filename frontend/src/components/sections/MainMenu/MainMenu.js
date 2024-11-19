import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import history from "~/routes/history";
import ReactSVG from "react-svg";
import { MdPowerSettingsNew } from "react-icons/md";
import { NavMenu } from "~/components/blocks";
import { Modal } from "~/components/elements";
import {
  MenuHolder,
  IconHolder,
  ModalPerson,
  ModalHolder,
  ModalPersonCell,
  ModalPersonCellDivider,
  MenuPersonTitle,
  MenuPersonText,
  MenuIconHolder,
} from "./styles";
import menuToggler from "~/assets/img/navbar-toggler.svg";
import smallLogo from "~/assets/img/sd-logo-row.png";
import iconPerson from "~/assets/img/usuario.png";
import isMobile from "~/hooks/isMobile";
import { Creators as AuthenticationActions } from "~/store/modules/authentication/actions";

export default function MainMenu() {
  const dispatch = useDispatch();
  const mobile = isMobile();
  const [menuModalOpened, openMenuModal] = useState(false);
  const [personModalOpened, openPersonModal] = useState(false);

  const logout = () => {
    dispatch(AuthenticationActions.purgeAuthentication());
    history.push("/");
  };

  return (
    <>
      <MenuHolder
        container
        justifyContent={mobile ? "space-between" : "center"}
        alignItems="center"
      >
        {mobile && (
          <IconHolder cell="true" onClick={() => openMenuModal(true)}>
            <ReactSVG src={menuToggler} />
          </IconHolder>
        )}
        <IconHolder cell="true" width="auto">
          <Link to="/dashboard">
            <img src={smallLogo} alt="SmartDoor" />
          </Link>
        </IconHolder>
        {mobile && (
          <IconHolder cell="true" onClick={() => openPersonModal(true)}>
            <img src={iconPerson} alt="Ícone Pessoa" />
          </IconHolder>
        )}
        {!mobile && (
          <>
            <NavMenu />
            <ModalPersonCellDivider />
            <ModalPersonCell action="true" onClick={logout}>
              <MenuIconHolder>
                <MdPowerSettingsNew />
              </MenuIconHolder>
              <MenuPersonText>Sair</MenuPersonText>
            </ModalPersonCell>
          </>
        )}
      </MenuHolder>
      <Modal open={menuModalOpened} onClose={() => openMenuModal(false)}>
        <NavMenu />
      </Modal>
      <ModalPerson
        open={personModalOpened}
        onClick={() => openPersonModal(false)}
      >
        <ModalHolder open={personModalOpened}>
          <ModalPersonCell mobile={mobile}>
            <MenuPersonTitle level="10">Bem vindo!</MenuPersonTitle>
          </ModalPersonCell>
          <ModalPersonCellDivider />
          <ModalPersonCell action="true" onClick={logout}>
            <MenuIconHolder>
              <MdPowerSettingsNew />
            </MenuIconHolder>
            <MenuPersonText>Sair</MenuPersonText>
          </ModalPersonCell>
        </ModalHolder>
      </ModalPerson>
    </>
  );
}
