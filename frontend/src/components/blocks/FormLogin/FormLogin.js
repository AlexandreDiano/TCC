import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import { FaUserCircle, FaUnlockAlt } from "react-icons/fa";
import { Input, Title, Margin, Button, Loading } from "~/components/elements";
import { Box } from "./styles";
import { Formik } from "formik";
import { schema } from "./validation";
import { Creators as AuthenticationActions } from "~/store/modules/authentication/actions";

function FormLogin() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authentication.loading);

  function validationForm(valid, values) {
    if (Object.values(values).every((val) => val) && valid) {
      return false;
    }
    return true;
  }

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        dispatch(AuthenticationActions.getAuthentication({ values }));
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
      }) => (
        <form onSubmit={handleSubmit}>
          <Title as="2" level="9" levelDesktop="9">
            <Box>
              <Input
                textField
                name="username"
                type="text"
                placeholder="Nome de Usuário"
                min={5}
                max={20}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                errors={errors.username && touched.username && errors.username}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <FaUserCircle />
                    </InputAdornment>
                  ),
                }}
                transparent
              />
              <Margin mt={1} mb={4}>
                <Input
                  textField
                  name="password"
                  type="password"
                  placeholder="Senha"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  errors={
                    errors.password && touched.password && errors.password
                  }
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <FaUnlockAlt />
                      </InputAdornment>
                    ),
                  }}
                  transparent
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
                {loading ? <Loading button /> : "Acessar"}
              </Button>
            </Box>
          </Title>
        </form>
      )}
    </Formik>
  );
}

FormLogin.defaultProps = {
  history: {},
};

FormLogin.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default FormLogin;
