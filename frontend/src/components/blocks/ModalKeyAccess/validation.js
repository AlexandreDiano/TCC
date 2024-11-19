import * as Yup from "yup";
import moment from "moment";
import MESSAGE from "~/utils/messages";

export const schema = Yup.object().shape({
  entry: Yup.string().matches(
    "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
    MESSAGE.invalidTime
  ),
  exit: Yup.string()
    .matches("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$", MESSAGE.invalidTime)
    .test("is-greater", MESSAGE.greaterTime, function(value) {
      const { entry } = this.parent;
      return moment(value, "HH:mm").isSameOrAfter(moment(entry, "HH:mm"));
    }),
});
