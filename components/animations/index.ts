
export {
  FadeIn,
  FadeOut,
  FadeList,
  ConditionalFade,
} from "../shared/FadeComponents";

export { FadeAnimationDemo } from "../shared/FadeAnimationDemo";

// Tipos para facilitar o uso
export type FadeDirection = "up" | "down" | "left" | "right";
export type FadeSpeed = "fast" | "normal" | "slow";

// Re-exportar hooks do diretório correto
export {
  useFade,
  useSimpleFade,
  useStaggeredFade,
  useToastFade,
} from "../../hooks/use-fade";
