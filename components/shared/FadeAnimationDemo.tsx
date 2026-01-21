'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Componente de demonstração das animações de Fade In/Out
 */
export function FadeAnimationDemo() {
  const [showBasic, setShowBasic] = useState(true);
  const [showDirectional, setShowDirectional] = useState(true);
  const [showStaggered, setShowStaggered] = useState(true);

  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  return (
    <div className="space-y-8 p-6">
      {/* Fade In/Out Básico */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Fade In/Out Básico</h2>
        <Button onClick={() => setShowBasic(!showBasic)} className="mb-4">
          {showBasic ? 'Esconder' : 'Mostrar'}
        </Button>
        
        {showBasic && (
          <Card className="p-6 animate-fade-in">
            <p>Este card aparece com fade in e desaparece com fade out!</p>
          </Card>
        )}
      </section>

      {/* Fade In Direcionais */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Fade In Direcionais</h2>
        <Button onClick={() => setShowDirectional(!showDirectional)} className="mb-4">
          {showDirectional ? 'Esconder' : 'Mostrar'}
        </Button>
        
        {showDirectional && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 animate-fade-in-up">
              <p className="font-semibold">Fade In Up ↑</p>
              <p className="text-sm text-muted-foreground">Vem de baixo</p>
            </Card>
            
            <Card className="p-6 animate-fade-in-down">
              <p className="font-semibold">Fade In Down ↓</p>
              <p className="text-sm text-muted-foreground">Vem de cima</p>
            </Card>
            
            <Card className="p-6 animate-fade-in-left">
              <p className="font-semibold">Fade In Left ←</p>
              <p className="text-sm text-muted-foreground">Vem da esquerda</p>
            </Card>
            
            <Card className="p-6 animate-fade-in-right">
              <p className="font-semibold">Fade In Right →</p>
              <p className="text-sm text-muted-foreground">Vem da direita</p>
            </Card>
          </div>
        )}
      </section>

      {/* Animação em Sequência (Staggered) */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Animação em Sequência</h2>
        <Button onClick={() => setShowStaggered(!showStaggered)} className="mb-4">
          {showStaggered ? 'Esconder' : 'Mostrar'}
        </Button>
        
        {showStaggered && (
          <div className="space-y-3">
            {items.map((item, index) => (
              <Card 
                key={item}
                className={`p-4 animate-fade-in-left animate-delay-${index * 100}`}
              >
                <p>{item} - Aparece com {index * 100}ms de delay</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Velocidades */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Velocidades Diferentes</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6 animate-fade-in-fast">
            <p className="font-semibold">Rápido</p>
            <p className="text-sm text-muted-foreground">0.3s</p>
          </Card>
          
          <Card className="p-6 animate-fade-in">
            <p className="font-semibold">Normal</p>
            <p className="text-sm text-muted-foreground">0.5s</p>
          </Card>
          
          <Card className="p-6 animate-fade-in-slow">
            <p className="font-semibold">Lento</p>
            <p className="text-sm text-muted-foreground">0.8s</p>
          </Card>
        </div>
      </section>

      {/* Cards em Grid com Delays */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Grid Animado</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num, index) => {
            const delays = [0, 100, 200, 100, 200, 300];
            const delayClass = delays[index] > 0 ? `animate-delay-${delays[index]}` : '';
            
            return (
              <Card 
                key={num}
                className={`p-6 text-center animate-fade-in-up ${delayClass}`}
              >
                <p className="text-2xl font-bold">{num}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {delays[index]}ms delay
                </p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
