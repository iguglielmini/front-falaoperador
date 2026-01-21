'use client';

import { ReactNode } from 'react';

type FadeDirection = 'up' | 'down' | 'left' | 'right';
type FadeSpeed = 'fast' | 'normal' | 'slow';

interface FadeInProps {
  children: ReactNode;
  /** Direção da animação */
  direction?: FadeDirection;
  /** Velocidade da animação */
  speed?: FadeSpeed;
  /** Delay antes de iniciar (ms) */
  delay?: number;
  /** Classes adicionais */
  className?: string;
  /** Callback quando animação terminar */
  onAnimationEnd?: () => void;
}

/**
 * Componente wrapper para fade in
 * 
 * @example
 * ```tsx
 * <FadeIn direction="up" speed="fast" delay={200}>
 *   <div>Conteúdo que aparece</div>
 * </FadeIn>
 * ```
 */
export function FadeIn({
  children,
  direction,
  speed = 'normal',
  delay,
  className = '',
  onAnimationEnd,
}: FadeInProps) {
  const classes: string[] = [];
  
  // Animação base
  if (direction) {
    classes.push(`animate-fade-in-${direction}`);
  } else {
    classes.push('animate-fade-in');
  }
  
  // Velocidade
  if (speed !== 'normal') {
    classes.push(`animate-fade-in-${speed}`);
  }
  
  // Delay
  if (delay) {
    classes.push(`animate-delay-${delay}`);
  }
  
  // Classes adicionais
  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')} onAnimationEnd={onAnimationEnd}>
      {children}
    </div>
  );
}

type FadeOutProps = FadeInProps;

/**
 * Componente wrapper para fade out
 * 
 * @example
 * ```tsx
 * <FadeOut direction="down" speed="fast">
 *   <div>Conteúdo que desaparece</div>
 * </FadeOut>
 * ```
 */
export function FadeOut({
  children,
  direction,
  speed = 'normal',
  delay,
  className = '',
  onAnimationEnd,
}: FadeOutProps) {
  const classes: string[] = [];
  
  // Animação base
  if (direction) {
    classes.push(`animate-fade-out-${direction}`);
  } else {
    classes.push('animate-fade-out');
  }
  
  // Velocidade
  if (speed !== 'normal') {
    classes.push(`animate-fade-out-${speed}`);
  }
  
  // Delay
  if (delay) {
    classes.push(`animate-delay-${delay}`);
  }
  
  // Classes adicionais
  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')} onAnimationEnd={onAnimationEnd}>
      {children}
    </div>
  );
}

interface FadeListProps {
  children: ReactNode[];
  /** Delay entre cada item (ms) */
  staggerDelay?: number;
  /** Direção da animação */
  direction?: FadeDirection;
  /** Velocidade da animação */
  speed?: FadeSpeed;
  /** Classes adicionais para o container */
  containerClassName?: string;
  /** Classes adicionais para cada item */
  itemClassName?: string;
  /** Delay máximo permitido */
  maxDelay?: number;
}

/**
 * Componente para lista com animação em sequência
 * 
 * @example
 * ```tsx
 * <FadeList staggerDelay={100} direction="left">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </FadeList>
 * ```
 */
export function FadeList({
  children,
  staggerDelay = 100,
  direction = 'up',
  speed = 'normal',
  containerClassName = '',
  itemClassName = '',
  maxDelay = 1000,
}: FadeListProps) {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div className={containerClassName}>
      {childrenArray.map((child, index) => {
        const delay = Math.min(index * staggerDelay, maxDelay);
        const classes: string[] = [];
        
        // Animação
        classes.push(`animate-fade-in-${direction}`);
        
        // Velocidade
        if (speed !== 'normal') {
          classes.push(`animate-fade-in-${speed}`);
        }
        
        // Delay
        if (delay > 0) {
          classes.push(`animate-delay-${delay}`);
        }
        
        // Classes adicionais
        if (itemClassName) {
          classes.push(itemClassName);
        }

        return (
          <div key={index} className={classes.join(' ')}>
            {child}
          </div>
        );
      })}
    </div>
  );
}

interface ConditionalFadeProps {
  children: ReactNode;
  /** Se deve mostrar o conteúdo */
  show: boolean;
  /** Direção do fade in */
  fadeInDirection?: FadeDirection;
  /** Direção do fade out */
  fadeOutDirection?: FadeDirection;
  /** Velocidade */
  speed?: FadeSpeed;
  /** Classes adicionais */
  className?: string;
  /** Callback quando fade out terminar */
  onFadeOut?: () => void;
}

/**
 * Componente que faz fade in quando aparece e fade out quando desaparece
 * 
 * @example
 * ```tsx
 * const [show, setShow] = useState(false);
 * 
 * <ConditionalFade 
 *   show={show} 
 *   fadeInDirection="up" 
 *   fadeOutDirection="down"
 * >
 *   <div>Conteúdo condicional</div>
 * </ConditionalFade>
 * ```
 */
export function ConditionalFade({
  children,
  show,
  fadeInDirection = 'up',
  fadeOutDirection,
  speed = 'normal',
  className = '',
  onFadeOut,
}: ConditionalFadeProps) {
  if (!show) return null;

  // Se não especificou fadeOutDirection, usa a mesma do fadeIn
  const outDirection = fadeOutDirection || fadeInDirection;

  return (
    <FadeIn 
      direction={fadeInDirection} 
      speed={speed} 
      className={className}
      onAnimationEnd={!show ? onFadeOut : undefined}
    >
      {children}
    </FadeIn>
  );
}
