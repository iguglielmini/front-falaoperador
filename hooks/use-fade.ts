import { useState, useEffect, useCallback } from "react";

type FadeDirection = "in" | "out" | "up" | "down" | "left" | "right";
type FadeSpeed = "fast" | "normal" | "slow";

interface UseFadeOptions {
  /** Direção da animação */
  direction?: FadeDirection;
  /** Velocidade da animação */
  speed?: FadeSpeed;
  /** Delay antes de iniciar a animação (ms) */
  delay?: number;
  /** Estado inicial (visível ou não) */
  initialState?: boolean;
  /** Duração total da animação (ms) - usado para auto-hide */
  duration?: number;
  /** Callback quando a animação terminar */
  onAnimationEnd?: () => void;
}

interface UseFadeReturn {
  /** Se o elemento está visível */
  isVisible: boolean;
  /** Classe CSS para aplicar no elemento */
  className: string;
  /** Função para mostrar o elemento */
  fadeIn: () => void;
  /** Função para esconder o elemento */
  fadeOut: () => void;
  /** Função para alternar visibilidade */
  toggle: () => void;
  /** Props para adicionar ao elemento */
  props: {
    className: string;
    onAnimationEnd?: () => void;
  };
}

/**
 * Hook para controlar animações de fade in/out
 *
 * @example
 * ```tsx
 * const { isVisible, className, fadeIn, fadeOut } = useFade({
 *   direction: 'up',
 *   speed: 'fast',
 *   delay: 200
 * });
 *
 * return (
 *   <>
 *     <button onClick={fadeIn}>Mostrar</button>
 *     {isVisible && <div className={className}>Conteúdo</div>}
 *   </>
 * );
 * ```
 */
export function useFade({
  direction = "in",
  speed = "normal",
  delay = 0,
  initialState = false,
  duration,
  onAnimationEnd,
}: UseFadeOptions = {}): UseFadeReturn {
  const [isVisible, setIsVisible] = useState(initialState);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Gera a classe CSS baseada nos parâmetros
  const generateClassName = useCallback(
    (fadeOut: boolean = false) => {
      const classes: string[] = [];

      // Tipo de animação
      if (fadeOut) {
        if (direction === "in" || direction === "out") {
          classes.push("animate-fade-out");
        } else {
          classes.push(`animate-fade-out-${direction}`);
        }
      } else {
        if (direction === "in" || direction === "out") {
          classes.push("animate-fade-in");
        } else {
          classes.push(`animate-fade-in-${direction}`);
        }
      }

      // Velocidade
      if (speed !== "normal") {
        classes.push(`animate-fade-${fadeOut ? "out" : "in"}-${speed}`);
      }

      // Delay
      if (delay > 0) {
        classes.push(`animate-delay-${delay}`);
      }

      return classes.join(" ");
    },
    [direction, speed, delay],
  );

  const className = generateClassName(isAnimatingOut);

  const fadeOut = useCallback(() => {
    setIsAnimatingOut(true);

    // Aguarda a animação terminar antes de esconder
    const animationDuration =
      speed === "fast" ? 300 : speed === "slow" ? 800 : 500;
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
      onAnimationEnd?.();
    }, animationDuration + delay);
  }, [speed, delay, onAnimationEnd]);

  const fadeIn = useCallback(() => {
    setIsAnimatingOut(false);
    setIsVisible(true);

    // Auto-hide se duration foi especificado
    if (duration) {
      setTimeout(() => {
        fadeOut();
      }, duration);
    }
  }, [duration, fadeOut]);

  const toggle = useCallback(() => {
    if (isVisible && !isAnimatingOut) {
      fadeOut();
    } else if (!isVisible) {
      fadeIn();
    }
  }, [isVisible, isAnimatingOut, fadeIn, fadeOut]);

  return {
    isVisible,
    className,
    fadeIn,
    fadeOut,
    toggle,
    props: {
      className,
      onAnimationEnd,
    },
  };
}

/**
 * Hook simplificado para fade in/out básico
 *
 * @example
 * ```tsx
 * const fade = useSimpleFade();
 *
 * return (
 *   <>
 *     <button onClick={fade.toggle}>Toggle</button>
 *     {fade.isVisible && (
 *       <div className={fade.className}>Conteúdo</div>
 *     )}
 *   </>
 * );
 * ```
 */
export function useSimpleFade(initialState = false) {
  return useFade({ initialState });
}

/**
 * Hook para lista com animação staggered (em sequência)
 *
 * @example
 * ```tsx
 * const items = ['Item 1', 'Item 2', 'Item 3'];
 * const { getItemClassName } = useStaggeredFade({ staggerDelay: 100 });
 *
 * return (
 *   <div>
 *     {items.map((item, index) => (
 *       <div key={item} className={getItemClassName(index)}>
 *         {item}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useStaggeredFade({
  staggerDelay = 100,
  direction = "up",
  speed = "normal",
  maxDelay = 1000,
}: {
  staggerDelay?: number;
  direction?: FadeDirection;
  speed?: FadeSpeed;
  maxDelay?: number;
} = {}) {
  const getItemClassName = useCallback(
    (index: number) => {
      const delay = Math.min(index * staggerDelay, maxDelay);
      const classes: string[] = [];

      // Animação
      if (direction === "in" || direction === "out") {
        classes.push("animate-fade-in");
      } else {
        classes.push(`animate-fade-in-${direction}`);
      }

      // Velocidade
      if (speed !== "normal") {
        classes.push(`animate-fade-in-${speed}`);
      }

      // Delay
      if (delay > 0 && delay <= maxDelay) {
        classes.push(`animate-delay-${delay}`);
      }

      return classes.join(" ");
    },
    [staggerDelay, direction, speed, maxDelay],
  );

  return { getItemClassName };
}

/**
 * Hook para toast/notificação com auto-dismiss
 *
 * @example
 * ```tsx
 * const toast = useToastFade({ duration: 3000 });
 *
 * const showToast = () => toast.show();
 *
 * return (
 *   <>
 *     <button onClick={showToast}>Mostrar Toast</button>
 *     {toast.isVisible && (
 *       <div className={toast.className}>
 *         Mensagem de sucesso!
 *       </div>
 *     )}
 *   </>
 * );
 * ```
 */
export function useToastFade({
  duration = 3000,
  direction = "down",
  speed = "fast",
}: {
  duration?: number;
  direction?: FadeDirection;
  speed?: FadeSpeed;
} = {}) {
  const fade = useFade({ direction, speed, duration });

  const show = useCallback(() => {
    fade.fadeIn();
  }, [fade]);

  return {
    ...fade,
    show,
  };
}
