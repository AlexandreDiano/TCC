import * as Yup from "yup";
import moment from "moment";
import { cpfValidation } from "~/utils/tools";
import MESSAGE from "~/utils/messages";

export const schema = Yup.object().shape({
  initialDate: Yup.string().matches(
    "^(0[0-9]|1[0-9]|2[0-9]|3[0-1])/(0[0-9]|1[0-2])/20[2-9][0-9]$",
    MESSAGE.invalidDate
  ),
  finalDate: Yup.string()
    .matches(
      "^(0[0-9]|1[0-9]|2[0-9]|3[0-1])/(0[0-9]|1[0-2])/20[2-9][0-9]$",
      MESSAGE.invalidDate
    )
    .test("is-greater", MESSAGE.greaterDate, function(value) {
      const { initialDate } = this.parent;
      if (value)
        return moment(value, "dd/mm/yyyy").isSameOrAfter(
          moment(initialDate, "dd/mm/yyyy")
        );
      return true;
    }),
  cpf: Yup.mixed().test({
    name: "cpf",
    message: MESSAGE.invalidCPF,
    test: (value) => {
      if (value) return cpfValidation(value);
      return true;
    },
  }),
  door: Yup.string(),
});
