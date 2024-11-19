import { animateScroll as scroll } from "react-scroll";
import { format } from "date-fns";

export function formatCPF(value) {
  return (
    value &&
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  );
}

export function removeMaskString(value) {
  return value && value.replace(/\D+/g, "");
}

export function limitText(text, limit = 80) {
  while (limit < text.length) {
    if (text[limit] === " ") {
      return `${text.substring(0, limit)}...`;
    }
    limit -= 1;
  }
  return text;
}

export function cpfMask() {
  return [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];
}

export function dateMask() {
  return [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
}

export function hourMask() {
  return [/\d/, /\d/, ":", /\d/, /\d/];
}

export function cepValidation() {
  return /^[0-9]{8}$/;
}
export function cpfValidation(strCpf) {
  const cpf = removeMaskString(strCpf);
  if (!/[0-9]{11}/.test(cpf)) return false;
  if (cpf === "00000000000") return false;
  if (cpf === "11111111111") return false;
  if (cpf === "22222222222") return false;
  if (cpf === "33333333333") return false;
  if (cpf === "44444444444") return false;
  if (cpf === "55555555555") return false;
  if (cpf === "66666666666") return false;
  if (cpf === "77777777777") return false;
  if (cpf === "88888888888") return false;
  if (cpf === "99999999999") return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i += 1)
    soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10), 10)) return false;

  soma = 0;
  for (let i = 1; i <= 10; i += 1)
    soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11), 10)) return false;
  return true;
}

export function scrollTop() {
  scroll.scrollToTop();
}

export function scrollBottom() {
  scroll.scrollToBottom();
}
export function isObjectEmpty(obj) {
  if (Object.keys(obj).length > 0) {
    return false;
  }
  return true;
}

export function formatDateToBr(date) {
  return format(new Date(date), "dd/MM/yyyy");
}
export function formatTimeToBr(date) {
  return format(new Date(date), "HH:mm");
}
export function formatDateTimeToBr(date) {
  return format(new Date(date), "dd/MM/yyyy - HH:mm");
}
export function formatDateToSchedule(time) {
  const dateString = format(new Date(), "yyyy-MM-dd");
  return `${dateString}T${time}:00.000-03:00`;
}
export function formatScheduleToTime(schedule) {
  return format(new Date(schedule), "HH:mm");
}
export function formatDateStringToBr(dateString) {
  const dateSplit = dateString.split("-");
  const year = dateSplit[0];
  const month = dateSplit[1];
  const day = dateSplit[2];
  return `${day}/${month}/${year}`;
}

export function formatDateStringToSend(dateString) {
  const dateSplit = dateString.split("/");
  const year = dateSplit[2];
  const month = dateSplit[1];
  const day = dateSplit[0];
  return `${year}-${month}-${day}`;
}

export function formatWeekDayToBr(weekDay) {
  switch (weekDay) {
    case "sunday":
      return "Domingo";
    case "monday":
      return "Segunda";
    case "tuesday":
      return "Terça";
    case "wednesday":
      return "Quarta";
    case "thursday":
      return "Quinta";
    case "friday":
      return "Sexta";
    case "saturday":
      return "Sábado";
    default:
      return "";
  }
}

export function userRole(user) {
  if (typeof user === "number") {
    switch (user) {
      case 0:
        return "admin";
      case 1:
        return "superuser";
      default:
        return "user";
    }
  } else if (typeof user === "string") {
    switch (user) {
      case "admin":
        return 0;
      case "superuser":
        return 1;
      default:
        return 2;
    }
  }
}
export function translateRole(user) {
  switch (user) {
    case "admin":
      return "Administrador";
    case "superuser":
      return "Supervisor";
    default:
      return "Usuário";
  }
}
