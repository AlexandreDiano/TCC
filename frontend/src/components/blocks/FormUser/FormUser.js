import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Input, Select, Margin, Button, Loading } from "~/components/elements";
import { Box, HiddenInput, ClickP } from "./styles";
import { Formik } from "formik";
import { schema } from "./validation";
import {
  userRole,
  translateRole,
  cpfMask,
  removeMaskString,
} from "~/utils/tools";
import { Creators as UsersActions } from "~/store/modules/users/actions";

export default function FormUser({ initial }) {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({});
  const [changePass, setChangePass] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(true);
  const loading = useSelector((state) => state.users.loading);
  const roleType = useSelector((state) => state.authentication.user.roletype);
  const userDomain = useSelector((state) => state.authentication.user.domain);

  function validationForm(valid, values) {
    if (Object.values(values).every((val) => val) && valid) {
      return false;
    }
    return true;
  }
  const userTypeOptions = [
    {
      value: 1,
      label: "Supervisor",
    },
    {
      value: 2,
      label: "Usuário",
    },
  ];
  if (userRole(roleType) === 0) {
    userTypeOptions.unshift({ value: 0, label: "Admin" });
  }
  const handleSubmit = (values) => {
    let payload = {
      user: {
        email: values.email,
        cpf: removeMaskString(values.cpf),
        name: values.name,
        surname: values.surname,
        username: values.username,
        password: values.password,
        roletype: roleType !== 2 ? values.roletype.value : 2,
      },
    };
    if (roleType !== 2) {
      payload.user.domain = values.domain;
    }
    if (initial) {
      payload.user.userId = initial.id;
      dispatch(UsersActions.updateUser(payload));
    } else {
      dispatch(UsersActions.createUser(payload));
    }
  };

  useEffect(() => {
    setInitialValues({
      name: initial && initial.name ? initial.name : "",
      surname: initial && initial.surname ? initial.surname : "",
      cpf: initial && initial.cpf ? initial.cpf : "",
      email: initial && initial.email ? initial.email : "",
      username: initial && initial.username ? initial.username : "",
      roletype:
        initial && initial.roletype
          ? {
              value: userRole(initial.roletype),
              label: translateRole(initial.roletype),
            }
          : { label: "Tipo de usuário" },
      domain: initial && initial.domain ? initial.domain : userDomain,
    });
  }, [userDomain, initial, roleType]);

  useEffect(() => {
    setPasswordRequired(!!(changePass && initial) || (!changePass && !initial));
  }, [changePass, initial]);
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={schema(roleType, passwordRequired)}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(false);
        handleSubmit(values);
        resetForm({});
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isValid,
      }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box>
              <Margin mb={2}>
                <Input
                  placeholder="Nome"
                  htmlFor="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.name && touched.name && errors.name}
                  margin="normal"
                />
              </Margin>
              <Margin mt={1} mb={2}>
                <Input
                  placeholder="Sobrenome"
                  htmlFor="surname"
                  name="surname"
                  value={values.surname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.surname && touched.surname && errors.surname}
                  margin="normal"
                />
              </Margin>
              <Margin mt={1} mb={2}>
                <Input
                  placeholder="C.P.F."
                  htmlFor="cpf"
                  name="cpf"
                  mask={cpfMask}
                  value={values.cpf}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.cpf && touched.cpf && errors.cpf}
                  margin="normal"
                />
              </Margin>
              <Margin mt={1} mb={2}>
                <Input
                  placeholder="Email"
                  htmlFor="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.email && touched.email && errors.email}
                  margin="normal"
                />
              </Margin>

              <Margin mt={1} mb={2}>
                <Input
                  placeholder="Nome de usuário"
                  htmlFor="username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={
                    errors.username && touched.username && errors.username
                  }
                  margin="normal"
                  autoComplete="none"
                />
              </Margin>
              {!changePass && initial && (
                <ClickP onClick={() => setChangePass(true)}>
                  Alterar senha
                </ClickP>
              )}
              {((changePass && initial) || (!changePass && !initial)) && (
                <>
                  <Margin mt={1} mb={2}>
                    <Input
                      type="password"
                      placeholder={initial ? "Nova senha" : "Senha"}
                      htmlFor="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        errors.password && touched.password && errors.password
                      }
                      margin="normal"
                      autoComplete="new-password"
                    />
                  </Margin>
                  <Margin mt={1} mb={2}>
                    <Input
                      type="password"
                      placeholder={`Confirme a ${initial ? "nova " : ""}senha`}
                      htmlFor="confirmPassword"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={
                        errors.confirmPassword &&
                        touched.confirmPassword &&
                        errors.confirmPassword
                      }
                      margin="normal"
                      autoComplete="new-password"
                    />
                  </Margin>
                </>
              )}
              {changePass && initial && (
                <ClickP onClick={() => setChangePass(false)}>
                  Cancelar alterar senha
                </ClickP>
              )}
              {(userRole(roleType) === 0 || userRole(roleType) === 1) && (
                <Margin mt={1} mb={2}>
                  <Select
                    name="roletype"
                    placeholder="Tipo de usuário"
                    onChange={setFieldValue}
                    onBlur={handleBlur}
                    errors={
                      errors.roletype && touched.roletype && errors.roletype
                    }
                    value={values.roletype}
                    options={userTypeOptions}
                  />
                </Margin>
              )}
              <HiddenInput name="domain" value={values.domain} />
              <Button
                className={
                  validationForm(isValid, values) || loading
                    ? "button-chat animation-size"
                    : "button-chat"
                }
                disabled={validationForm(isValid, values) || loading}
                type="submit"
                size="full"
              >
                {loading ? (
                  <Loading button />
                ) : initial ? (
                  "Editar"
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
}

FormUser.defaultProps = {
  history: {},
};

FormUser.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
