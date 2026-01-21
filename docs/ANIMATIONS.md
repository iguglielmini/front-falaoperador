# Guia de Animações Fade In/Out

Este projeto inclui um conjunto completo de animações de fade in e fade out prontas para uso.

## Animações Disponíveis

### Fade In

#### Básicas
- `animate-fade-in` - Fade in padrão (0.5s)
- `animate-fade-in-fast` - Fade in rápido (0.3s)
- `animate-fade-in-slow` - Fade in lento (0.8s)

#### Direcionais
- `animate-fade-in-up` - Fade in vindo de baixo
- `animate-fade-in-down` - Fade in vindo de cima
- `animate-fade-in-left` - Fade in vindo da esquerda
- `animate-fade-in-right` - Fade in vindo da direita

### Fade Out

#### Básicas
- `animate-fade-out` - Fade out padrão (0.5s)
- `animate-fade-out-fast` - Fade out rápido (0.3s)
- `animate-fade-out-slow` - Fade out lento (0.8s)

#### Direcionais
- `animate-fade-out-up` - Fade out indo para cima
- `animate-fade-out-down` - Fade out indo para baixo
- `animate-fade-out-left` - Fade out indo para esquerda
- `animate-fade-out-right` - Fade out indo para direita

### Delays

Combine com delays para animações em sequência:
- `animate-delay-100` - 100ms
- `animate-delay-200` - 200ms
- `animate-delay-300` - 300ms
- `animate-delay-500` - 500ms
- `animate-delay-700` - 700ms
- `animate-delay-1000` - 1000ms

## Exemplos de Uso

### Fade In Simples
```tsx
<div className="animate-fade-in">
  Conteúdo aparece suavemente
</div>
```

### Fade In com Direção
```tsx
<div className="animate-fade-in-up">
  Conteúdo aparece de baixo para cima
</div>
```

### Fade In com Delay
```tsx
<div className="animate-fade-in animate-delay-300">
  Conteúdo aparece após 300ms
</div>
```

### Animação em Sequência
```tsx
<div className="space-y-4">
  <div className="animate-fade-in-left">Item 1</div>
  <div className="animate-fade-in-left animate-delay-100">Item 2</div>
  <div className="animate-fade-in-left animate-delay-200">Item 3</div>
  <div className="animate-fade-in-left animate-delay-300">Item 4</div>
</div>
```

### Fade Out Condicional
```tsx
const [isVisible, setIsVisible] = useState(true);

<div className={isVisible ? "animate-fade-in" : "animate-fade-out"}>
  Conteúdo que aparece/desaparece
</div>
```

### Componente com Estado
```tsx
import { useState } from 'react';

export function FadeExample() {
  const [show, setShow] = useState(true);

  return (
    <div className="p-4">
      <button 
        onClick={() => setShow(!show)}
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Toggle
      </button>
      
      {show && (
        <div className="animate-fade-in-up">
          <p>Este conteúdo aparece com fade in!</p>
        </div>
      )}
    </div>
  );
}
```

### Lista Animada
```tsx
const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

<div className="space-y-2">
  {items.map((item, index) => (
    <div 
      key={item}
      className={`animate-fade-in-right animate-delay-${index * 100}`}
    >
      {item}
    </div>
  ))}
</div>
```

### Modal com Animação
```tsx
import { useState } from 'react';

export function AnimatedModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg animate-fade-in-up">
              <h2>Modal Animado</h2>
              <button onClick={() => setIsOpen(false)}>Fechar</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
```

### Cards com Stagger
```tsx
const cards = [1, 2, 3, 4, 5, 6];

<div className="grid grid-cols-3 gap-4">
  {cards.map((card, index) => (
    <div
      key={card}
      className={`
        p-6 bg-card rounded-lg
        animate-fade-in
        animate-delay-${Math.min(index * 100, 500)}
      `}
    >
      Card {card}
    </div>
  ))}
</div>
```

## Combinando Animações

Você pode combinar com outras classes do Tailwind:

```tsx
<div className="
  animate-fade-in-up 
  animate-delay-200
  hover:scale-105 
  transition-transform
">
  Conteúdo com múltiplos efeitos
</div>
```

## Dicas de Performance

1. **Use `will-change`** para animações complexas:
```tsx
<div className="animate-fade-in will-change-transform">
  Conteúdo
</div>
```

2. **Remova animações após completar** para evitar re-renders:
```tsx
const [isAnimating, setIsAnimating] = useState(true);

<div 
  className={isAnimating ? "animate-fade-in" : ""}
  onAnimationEnd={() => setIsAnimating(false)}
>
  Conteúdo
</div>
```

3. **Use `prefers-reduced-motion`** para acessibilidade:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-out {
    animation: none;
  }
}
```
