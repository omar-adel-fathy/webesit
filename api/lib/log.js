const PREFIX = "[lead]";

function stamp(message) {
  return `${PREFIX} ${new Date().toISOString()} ${message}`;
}

export function maskPhone(phone) {
  if (!phone) {
    return "none";
  }
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length <= 2) {
    return "***";
  }
  return `***${digits.slice(-2)}`;
}

export const log = {
  info(message, extra) {
    console.info(stamp(message), extra === undefined ? "" : JSON.stringify(extra));
  },
  warn(message, extra) {
    console.warn(stamp(message), extra === undefined ? "" : JSON.stringify(extra));
  },
  error(message, extra) {
    console.error(stamp(message), extra === undefined ? "" : JSON.stringify(extra));
  },
};