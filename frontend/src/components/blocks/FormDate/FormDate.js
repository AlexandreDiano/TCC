import React from "react";
import { Formik } from "formik";
import { Grid } from "@material-ui/core";
import { Input, Button } from "~/components/elements";
import { GridButton } from "./styles";
import isMobile from "~/hooks/isMobile";

export default function FormDate({
  field1,
  field1label,
  field2,
  field2label,
  field3,
  field3label,
  field4,
  field4label,
  action,
  onSubmit,
  schema,
  mask,
  mask2,
}) {
  const mobile = isMobile();

  const initialValues = () => {
    const values = {};
    values[field1] = "";
    values[field2] = "";
    return values;
  };

  const validationForm = (valid, values) => {
    if (field3) {
      return !(
        ((values[field1] && values[field2]) ||
          values[field3] ||
          values[field4]) &&
        valid
      );
    }
    if (Object.values(values).every((val) => val) && valid) {
      return false;
    }
    return true;
  };
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues()}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(false);
        onSubmit(values);
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
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              justifyContent={mobile ? "center" : "space-between"}
            >
              <Grid item xs={12} sm={field3 ? 2 : 5}>
                <Input
                  name={field1}
                  mask={mask}
                  placeholder={field1label}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values[field1]}
                  errors={errors[field1] && touched[field1] && errors[field1]}
                />
              </Grid>
              <Grid item xs={12} sm={field3 ? 2 : 5}>
                <Input
                  name={field2}
                  mask={mask}
                  placeholder={field2label}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values[field2]}
                  errors={errors[field2] && touched[field2] && errors[field2]}
                />
              </Grid>
              {field3 && (
                <Grid item xs={12} sm={3}>
                  <Input
                    name={field3}
                    mask={mask2}
                    placeholder={field3label}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values[field3]}
                    errors={errors[field3] && touched[field3] && errors[field3]}
                  />
                </Grid>
              )}
              {field4 && (
                <Grid item xs={12} sm={3}>
                  <Input
                    name={field4}
                    placeholder={field4label}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values[field4]}
                    errors={errors[field4] && touched[field4] && errors[field4]}
                  />
                </Grid>
              )}
              <GridButton
                mobile={mobile ? mobile : undefined}
                item
                xs={12}
                sm={2}
              >
                <Button
                  className={
                    validationForm(isValid, values)
                      ? "button-chat animation-size"
                      : "button-chat"
                  }
                  disabled={validationForm(isValid, values)}
                  type="submit"
                  size="large"
                >
                  {action}
                </Button>
              </GridButton>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
}
