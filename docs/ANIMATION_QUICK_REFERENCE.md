# 🎨 Guia Rápido de Animações

## Classes CSS Disponíveis

### Fade In
```css
animate-fade-in              /* Fade in padrão */
animate-fade-in-fast         /* 0.3s */
animate-fade-in-slow         /* 0.8s */
animate-fade-in-up           /* ↑ De baixo para cima */
animate-fade-in-down         /* ↓ De cima para baixo */
animate-fade-in-left         /* ← Da esquerda */
animate-fade-in-right        /* → Da direita */
```

### Fade Out
```css
animate-fade-out             /* Fade out padrão */
animate-fade-out-fast        /* 0.3s */
animate-fade-out-slow        /* 0.8s */
animate-fade-out-up          /* ↑ Para cima */
animate-fade-out-down        /* ↓ Para baixo */
animate-fade-out-left        /* ← Para esquerda */
animate-fade-out-right       /* → Para direita */
```

### Delays
```css
animate-delay-100            /* 100ms */
animate-delay-200            /* 200ms */
animate-delay-300            /* 300ms */
animate-delay-500            /* 500ms */
animate-delay-700            /* 700ms */
animate-delay-1000           /* 1000ms */
```

## Uso Rápido

### HTML/JSX Direto
```tsx
<div className="animate-fade-in-up">Conteúdo</div>
```

### Com Delay
```tsx
<div className="animate-fade-in-left animate-delay-200">Conteúdo</div>
```

### Lista Staggered
```tsx
{items.map((item, i) => (
  <div key={i} className={`animate-fade-in-up animate-delay-${i * 100}`}>
    {item}
  </div>
))}
```

## Componentes Prontos

### FadeIn
```tsx
import { FadeIn } from '@/components/animations';

<FadeIn direction="up" speed="fast" delay={200}>
  <Card>Conteúdo</Card>
</FadeIn>
```

### FadeList
```tsx
import { FadeList } from '@/components/animations';

<FadeList staggerDelay={100} direction="left">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</FadeList>
```

## Hooks

### useFade
```tsx
import { useFade } from '@/hooks/use-fade';

const fade = useFade({ direction: 'up', speed: 'fast' });

<button onClick={fade.toggle}>Toggle</button>
{fade.isVisible && <div className={fade.className}>Conteúdo</div>}
```

### useToastFade
```tsx
import { useToastFade } from '@/hooks/use-fade';

const toast = useToastFade({ duration: 3000 });

<button onClick={toast.show}>Mostrar</button>
{toast.isVisible && (
  <div className={toast.className}>Toast!</div>
)}
```

## Padrões Comuns

### Modal
```tsx
<DialogContent className="animate-fade-in-up animate-fade-in-fast">
```

### Toast
```tsx
<div className="fixed top-4 right-4 animate-fade-in-down animate-fade-in-fast">
```

### Grid de Cards
```tsx
{cards.map((card, i) => (
  <Card className={`animate-fade-in-up animate-delay-${i * 100}`}>
```

### Formulário
```tsx
{fields.map((field, i) => (
  <div className={`animate-fade-in-right animate-delay-${i * 100}`}>
```

---

📚 **Documentação Completa**: [ANIMATIONS.md](./ANIMATIONS.md)  
💡 **Exemplos Práticos**: [ANIMATION_EXAMPLES.md](./ANIMATION_EXAMPLES.md)
