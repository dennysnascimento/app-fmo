import logo from "../assets/fmo.png"
import { cn } from "../lib/utils"

export default function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="Loja Maçônica Flaviano Mendes de Oliveira Nº 43" className={cn("object-contain", className)} />
}
