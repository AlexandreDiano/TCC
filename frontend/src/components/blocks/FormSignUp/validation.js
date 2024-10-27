import * as Yup from "yup";
import MESSAGE from "~/utils/messages";
import { cpfValidation } from "~/utils/tools";

export const schema = Yup.object().shape({
  name: Yup.string()
    .min(3, MESSAGE.invalidName)
    .max(20, MESSAGE.invalidName)
    .matches(/^[a-zA-Z]+$/, MESSAGE.invalidName),
  surname: Yup.string()
    .min(2, MESSAGE.userMinChar)
    .max(20, MESSAGE.userMaxChar)
    .matches(/^[a-zA-Z]+$/, MESSAGE.invalidSurname),
  cpf: Yup.mixed().test({
    name: "cpf",
    message: MESSAGE.invalidCPF,
    test: (value) => value && cpfValidation(value),
  }),
  email: Yup.string()
    .email(MESSAGE.invalidMail)
    .required(MESSAGE.requiredField),
  username: Yup.string()
    .min(5, MESSAGE.userMinChar)
    .max(20, MESSAGE.userMaxChar)
    .matches(/^[a-z0-9]+$/, MESSAGE.userWrongChar),
  password: Yup.string()
    .min(5, MESSAGE.invalidCaracteres)
    .required(MESSAGE.requiredField),
});
