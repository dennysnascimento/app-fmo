import axios from "axios"

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:1411",
  timeout: 15000,
})

/** Extrai a mensagem de erro do backend, com fallback genérico. */
export const extractError = (error: unknown, fallback = "Erro inesperado"): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === "string" && data) return data
    if (data?.message) return Array.isArray(data.message) ? data.message.join(". ") : data.message
    if (!error.response) return "Não foi possível falar com o servidor. Confira se a API está no ar."
  }
  if (error instanceof Error) return error.message
  return fallback
}

export default api
