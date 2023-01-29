import { SDK_COINGEN_API } from "@/services/sdk.js";

export const FUNDING_API = () => SDK_COINGEN_API.post("llama-raises");

export const BTC_API = () => SDK_COINGEN_API.post("v3/coincap");
