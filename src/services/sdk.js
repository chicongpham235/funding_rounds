import axios from "axios";

const PREFIX = process.env.VUE_APP_PREFIX ?? "api";
const COINGEN_API = process.env.VUE_APP_COINGEN_API ?? "";

export const SDK_COINGEN_API = axios.create({
  baseURL: `${COINGEN_API}/${PREFIX}`,
  headers: {},
});
