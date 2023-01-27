import { SDK_COINGEN_API } from "@/services/sdk.js";

export const FUNDING_API = () => SDK_COINGEN_API.post("llama-raises");
