import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Input, Margin, Button, Loading } from "~/components/elements";
import { Box, HiddenInput } from "./styles";
import { Formik } from "formik";
import { schema } from "./validation";
import { userRole } from "~/utils/tools";
import { Creators as DoorsActions } from "~/store/modules/doors/actions";

export default function FormDoor({ initial }) {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({});
  const loading = useSelector((state) => state.doors.loading);
  const roleType = useSelector((state) => state.authentication.user.roletype);

  const showDescription = !userRole(roleType) || !!initial;

  function validationForm(valid, values) {
    if (Object.values(values).every((val) => val) && valid) {
      return false;
    }
    return true;
  }

  const handleSubmit = (values) => {
    if (initial) {
      values.id = initial.id;
      dispatch(DoorsActions.updateDoor(values));
    } else if (userRole(roleType)) {
      dispatch(DoorsActions.bindDoor(values));
    } else {
      dispatch(DoorsActions.createDoor(values));
    }
  };

  const actionText = () => {
    if (initial) {
      return "Editar";
    }
    if (userRole(roleType)) {
      return "Vincular";
    }
    return "Cadastrar";
  };

  useEffect(() => {
    const initialValues = {
      identification:
        initial && initial.identification ? initial.identification : "",
      id: initial && initial.id ? initial.id : "0",
    };
    if (showDescription) {
      initialValues.description =
        initial && initial.description ? initial.description : "";
    }
    setInitialValues(initialValues);
  }, [initial, showDescription]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={schema(userRole(roleType))}
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
        isValid,
      }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box>
            {showDescription && (
              <Margin mb={2}>
                <Input
                  placeholder="Descrição"
                  maxLength="20"
                  htmlFor="description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={
                    errors.description &&
                    touched.description &&
                    errors.description
                  }
                  margin="normal"
                />
              </Margin>
            )}
            <Margin mt={userRole(roleType) === 0 ? 1 : 0} mb={2}>
              <Input
                placeholder="Serial"
                maxLength="32"
                htmlFor="identification"
                name="identification"
                value={values.identification}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={
                  errors.identification &&
                  touched.identification &&
                  errors.identification
                }
                margin="normal"
              />
            </Margin>

            <HiddenInput name="id" value={values.id} />
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
              {loading ? <Loading button /> : actionText()}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

FormDoor.defaultProps = {
  history: {},
};

FormDoor.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
