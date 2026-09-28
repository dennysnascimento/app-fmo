import "@testing-library/jest-dom"
import { TextDecoder, TextEncoder } from "util"

// O jsdom do Jest 27 (CRA 5) não expõe TextEncoder, e o React Router v7 o usa ao carregar.
Object.assign(globalThis, { TextEncoder, TextDecoder })
