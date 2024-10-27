import * as Yup from "yup";
import MESSAGE from "~/utils/messages";

export const schema = Yup.object().shape({
  username: Yup.string()
    .min(5, MESSAGE.userMinChar)
    .max(20, MESSAGE.userMaxChar)
    .matches(/^[a-z0-9]+$/, MESSAGE.userWrongChar),
  password: Yup.string()
    .min(5, MESSAGE.invalidCaracteres)
    .required(MESSAGE.requiredField),
});
