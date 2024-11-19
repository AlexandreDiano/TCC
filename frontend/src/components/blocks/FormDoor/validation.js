import * as Yup from "yup";
import MESSAGE from "~/utils/messages";

export const schema = (showDescription) => {
  let userSchema = {
    identification: Yup.string()
      .test("len", MESSAGE.doorSerialLength, (val) => !!val && val.length === 32)
      .matches(/^[a-z0-9]+$/, MESSAGE.doorSerialWrongChar)
      .required(MESSAGE.requiredField),
    id: Yup.string().required("Porta sem ID"),
  };
  if (showDescription) {
    userSchema.description = Yup.string()
      .min(5, MESSAGE.doorMinChar)
      .max(30, MESSAGE.doorMaxChar);
  }
  return Yup.object().shape(userSchema);
};
