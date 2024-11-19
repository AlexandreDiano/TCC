import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Input, Margin, Button, Loading } from "~/components/elements";
import { Box } from "./styles";
import { Formik } from "formik";
import { schema } from "./validation";
import { cpfMask, removeMaskString } from "~/utils/tools";
import { Creators as AuthenticationActions } from "~/store/modules/authentication/actions";

export default function FormSignUp() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.users.loading);

  function validationForm(valid, values) {
    if (Object.values(values).every((val) => val) && valid) {
      return false;
    }
    return true;
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
      },
    };
    dispatch(AuthenticationActions.signUp(payload));
  };

  const initialValues = {
    name: "",
    surname: "",
    cpf: "",
    email: "",
    username: "",
    password: "",
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={schema}
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
      }) => (
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
                transparent
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
                transparent
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
                transparent
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
                transparent
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
                errors={errors.username && touched.username && errors.username}
                margin="normal"
                transparent
                autoComplete="none"
              />
            </Margin>
            <Margin mt={1} mb={2}>
              <Input
                placeholder="Senha"
                htmlFor="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.password && touched.password && errors.password}
                margin="normal"
                transparent
                type="password"
                autoComplete="none"
              />
            </Margin>
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
              {loading ? <Loading button /> : "Cadastrar"}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

FormSignUp.defaultProps = {
  history: {},
};

FormSignUp.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
