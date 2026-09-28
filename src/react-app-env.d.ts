/// <reference types="react-scripts" />

// O react-scripts tipa imagens e fontes, mas não vídeo.
declare module "*.mp4" {
  const src: string
  export default src
}
