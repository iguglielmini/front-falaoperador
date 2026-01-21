# Exemplos Práticos de Uso das Animações

## Aplicando em Componentes Existentes

### 1. TacticalCard com Fade In

```tsx
import { TacticalCard } from '@/components/shared/TaticalCard';

// Cards em grid com animação staggered
function DashboardCards() {
  const cards = [
    { title: 'Tarefas Ativas', value: 24 },
    { title: 'Eventos Hoje', value: 5 },
    { title: 'Usuários Online', value: 12 },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <TacticalCard 
          key={card.title}
          className={`animate-fade-in-up animate-delay-${index * 100}`}
        >
          <h3 className="text-sm text-muted-foreground">{card.title}</h3>
          <p className="text-3xl font-bold mt-2">{card.value}</p>
        </TacticalCard>
      ))}
    </div>
  );
}
```

### 2. Modals com Animação

```tsx
import { CreateEventoModal } from '@/components/eventos/CreateEventoModal';

// Adicione a animação ao Dialog do shadcn/ui
function AnimatedEventoModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Criar Evento</Button>
      </DialogTrigger>
      <DialogContent className="animate-fade-in-up animate-fade-in-fast">
        {/* Conteúdo do modal */}
      </DialogContent>
    </Dialog>
  );
}
```

### 3. Tabelas com Linhas Animadas

```tsx
import { EventosTable } from '@/components/eventos/EventosTable';

// Adicione animação às linhas da tabela
function AnimatedEventosTable({ eventos }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {eventos.map((evento, index) => (
          <TableRow 
            key={evento.id}
            className={`animate-fade-in-left animate-delay-${Math.min(index * 50, 300)}`}
          >
            <TableCell>{evento.nome}</TableCell>
            <TableCell>{evento.data}</TableCell>
            <TableCell>{evento.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 4. Header com Animação

```tsx
import { Header } from '@/components/layout/Header';

// Modifique o Header para ter fade in ao carregar
function AnimatedHeader() {
  return (
    <header className="animate-fade-in-down animate-fade-in-fast">
      {/* Conteúdo do header */}
    </header>
  );
}
```

### 5. Carousel de Eventos

```tsx
import { EventosCarousel } from '@/components/shared/EventosCarousel';

// Cards do carousel com animação
function AnimatedCarousel({ eventos }) {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {eventos.map((evento, index) => (
        <div
          key={evento.id}
          className={`
            min-w-[300px] 
            animate-fade-in-right 
            animate-delay-${index * 100}
          `}
        >
          <TacticalCard>
            <h3>{evento.titulo}</h3>
            <p>{evento.descricao}</p>
          </TacticalCard>
        </div>
      ))}
    </div>
  );
}
```

### 6. Toast/Notificações

```tsx
import { useToastFade } from '@/hooks/use-fade';
import { Card } from '@/components/ui/card';

function ToastNotification() {
  const toast = useToastFade({ duration: 3000, direction: 'down' });

  const showSuccess = () => {
    toast.show();
  };

  return (
    <>
      <Button onClick={showSuccess}>Salvar</Button>
      
      {toast.isVisible && (
        <Card className={`fixed top-4 right-4 p-4 bg-tactical-green text-white ${toast.className}`}>
          ✓ Salvo com sucesso!
        </Card>
      )}
    </>
  );
}
```

### 7. Sidebar com Animação

```tsx
import { Sidebar } from '@/components/ui/sidebar';

// Items do menu com fade in em sequência
function AnimatedSidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Tarefas', icon: '✓' },
    { name: 'Eventos', icon: '📅' },
    { name: 'Usuários', icon: '👥' },
  ];

  return (
    <Sidebar>
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <a
            key={item.name}
            href={`/${item.name.toLowerCase()}`}
            className={`
              flex items-center gap-2 p-2 rounded
              animate-fade-in-left
              animate-delay-${index * 100}
            `}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
    </Sidebar>
  );
}
```

### 8. Cards de Estatísticas

```tsx
import { useFade } from '@/hooks/use-fade';
import { TacticalCard } from '@/components/shared/TaticalCard';

function StatCard({ title, value, icon }) {
  const fade = useFade({ direction: 'up', delay: 0 });

  // Animar quando o valor mudar
  useEffect(() => {
    fade.fadeIn();
  }, [value]);

  return fade.isVisible ? (
    <TacticalCard className={fade.className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </TacticalCard>
  ) : null;
}
```

### 9. Formulário com Campos Animados

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function AnimatedForm() {
  const fields = [
    { name: 'nome', label: 'Nome', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'senha', label: 'Senha', type: 'password' },
  ];

  return (
    <form className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.name}
          className={`animate-fade-in-right animate-delay-${index * 100}`}
        >
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
          />
        </div>
      ))}
      
      <Button 
        type="submit" 
        className="animate-fade-in animate-delay-300"
      >
        Salvar
      </Button>
    </form>
  );
}
```

### 10. Página com Seções Animadas

```tsx
import { SectionTitle } from '@/components/shared/SectionTitle';

function DashboardPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Título */}
      <div className="animate-fade-in-down">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao sistema</p>
      </div>

      {/* Cards de Estatísticas */}
      <section className="animate-fade-in-up animate-delay-100">
        <SectionTitle>Estatísticas</SectionTitle>
        {/* Cards aqui */}
      </section>

      {/* Tabela de Tarefas */}
      <section className="animate-fade-in-up animate-delay-200">
        <SectionTitle>Tarefas Recentes</SectionTitle>
        {/* Tabela aqui */}
      </section>

      {/* Eventos */}
      <section className="animate-fade-in-up animate-delay-300">
        <SectionTitle>Próximos Eventos</SectionTitle>
        {/* Carousel aqui */}
      </section>
    </div>
  );
}
```

## Dicas de Implementação

1. **Use animações sutis**: Prefira velocidades normais ou rápidas para não deixar a interface lenta
2. **Limite delays**: Não use delays muito longos (max 500-700ms) para evitar frustração
3. **Stagger moderado**: Em listas, use delays de 50-100ms entre items
4. **Performance**: Evite animar muitos elementos ao mesmo tempo
5. **Consistência**: Use os mesmos padrões de animação em toda a aplicação
6. **Mobile**: Considere usar animações mais rápidas em dispositivos móveis

## Animações Recomendadas por Tipo de Componente

| Componente | Animação Recomendada | Velocidade |
|------------|---------------------|------------|
| Modal/Dialog | `fade-in-up` | fast |
| Toast | `fade-in-down` | fast |
| Cards/Grid | `fade-in-up` com stagger | normal |
| Sidebar Items | `fade-in-left` com stagger | fast |
| Tabela Rows | `fade-in-left` com stagger | fast |
| Forms Fields | `fade-in-right` com stagger | normal |
| Hero Section | `fade-in-up` | slow |
| Carousel Items | `fade-in-right` | normal |
