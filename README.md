# Controle Financeiro 💰

Sistema web moderno de controle financeiro pessoal construído com React, TypeScript e Vite.

## 🚀 Características

- ✅ **Autenticação Google** - Login seguro com Google OAuth
- 📊 **Dashboard Intuitivo** - Visualize seu saldo com gráficos
- 💳 **Gerenciamento de Compromissos** - Organize suas obrigações financeiras
- 💸 **Controle de Gastos** - Registre e categorize seus gastos
- 📈 **Rastreamento de Receitas** - Monitore suas entradas
- 🎨 **Interface Responsiva** - Funciona em desktop, tablet e mobile
- ⚡ **Performance Otimizada** - Carregamento rápido e suave
- 🛡️ **Validações Robustas** - Verificação de dados com Zod
- 🔄 **Tratamento de Erros Global** - ErrorBoundary + Centralized Error Handler

## 📚 Documentação de Padrões

### Arquitetura do Projeto

```
src/
├── api/                 # Chamadas HTTP para o backend
│   └── endpoints/       # Organizado por feature (gasto.ts, receita.ts, etc.)
├── components/          # Componentes React reutilizáveis
│   ├── layout/          # Componentes de layout
│   ├── ui/              # Componentes base (Modal, Input, etc.)
│   └── [feature]/       # Componentes específicos por feature
├── contexts/            # React Context (Global State)
│   └── toast/           # Sistema de notificações
├── hooks/               # Custom hooks
│   ├── use[Feature].ts  # Hooks para cada feature
│   ├── useValidation.ts # Validação com Zod
│   └── useApiError.ts   # Tratamento centralizado de erros
├── schemas/             # Schemas Zod para validação
├── types/               # Tipos TypeScript
├── utils/               # Funções utilitárias
└── pages/               # Páginas da aplicação
```

### Padrões de Código

#### 1. **Componentes Funcionais com Hooks**

```tsx
// ✅ Padrão: Componente funcional com hooks
import { useState, useCallback } from 'react';

interface ModalProps {
   aberto: boolean;
   onClose: () => void;
}

export function MinhaModal({ aberto, onClose }: ModalProps) {
   const [estado, setEstado] = useState('');
   
   const handleSalvar = useCallback(() => {
      // lógica aqui
      onClose();
   }, [onClose]);

   return (
      <div>
         {/* JSX aqui */}
      </div>
   );
}
```

#### 2. **Custom Hooks para Lógica de Negócio**

```tsx
// ✅ Padrão: Separar lógica em hooks
export function useGasto(mes: string, ano: string) {
   const queryClient = useQueryClient();
   
   const { data: gastos } = useQuery({
      queryKey: ['gastos', mes, ano],
      queryFn: () => listarGastos(mes, ano),
      staleTime: Infinity,
      retry: 1
   });

   const criarMutation = useMutation({
      mutationFn: (novoGasto) => criarGasto(novoGasto),
      onSuccess: () => {
         // Atualizar cache
      },
      onError: (error) => {
         handleError(error); // Centralizado!
      }
   });

   return { gastos, criar: criarMutation.mutateAsync };
}
```

#### 3. **Validação com Zod**

```tsx
// ✅ Padrão: Schema centralizado em /schemas
import { z } from 'zod';

export const GastoCreateSchema = z.object({
   descricao: z.string().min(1, 'Descrição obrigatória'),
   valor: z.number().positive('Valor deve ser positivo'),
   categoria: z.string().min(1, 'Categoria obrigatória')
});

// Usar em componentes
const { validar } = useValidation();
const dados = validar(GastoCreateSchema, payload);
if (!dados) return; // Erro já exibido
```

#### 4. **Tratamento Centralizado de Erros**

```tsx
// ✅ Padrão: useApiError para tratamento global
import { useApiError } from '@/hooks/useApiError';

export function useGasto(mes: string, ano: string) {
   const { handleError } = useApiError();

   const criarMutation = useMutation({
      mutationFn: criarGasto,
      onError: (error) => handleError(error) // Centralizado!
   });
}
```

#### 5. **ErrorBoundary para Erros React**

```tsx
// ✅ Padrão: Envolver App com ErrorBoundary
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
   return (
      <ErrorBoundary>
         <AppProvider>
            <AppRouter />
         </AppProvider>
      </ErrorBoundary>
   );
}
```

### Padrão de Nomeclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Componentes** | PascalCase | `ModalNovoGasto.tsx` |
| **Hooks** | camelCase `use*` | `useGasto.ts` |
| **Tipos** | PascalCase | `Gasto.ts` |
| **Constantes** | UPPER_SNAKE_CASE | `API_TIMEOUT_MS` |
| **Variáveis** | camelCase | `descricao`, `valorTotal` |

### React Query (TanStack Query)

**Convenção de Query Keys:**
```tsx
// Formato: ['entidade', 'filtro_opcional', 'periodo']
['gastos', mes, ano]
['compromissos', 'alertas', ano]
['receitas', mes, ano]
```

### Context API

**PeriodoContext** - Estado global de período (mês/ano)
```tsx
const { mes, ano, resumo, gastos, receitas } = usePeriodo();
```

## 🔧 Como Executar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
npm run lint:fix
```

### Formato
```bash
npm run format
```

## 📦 Dependências Principais

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **React Router 7** - Roteamento
- **TanStack Query 5** - State management (server state)
- **Zod** - Validação de schemas
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **React Swipeable** - Gestos de swipe

## 🏗️ Estrutura de Componentes

### Modal Pattern
```tsx
// Todos os modais seguem este padrão:
interface Props {
   aberto: boolean;
   onClose: () => void;
}

export function ModalNovoGasto({ aberto, onClose }: Props) {
   const { validar } = useValidation();
   const { criar } = useGasto();

   const handleSalvar = async () => {
      const dados = validar(GastoCreateSchema, payload);
      if (!dados) return;
      await criar(dados);
      onClose();
   };

   return <ModalBase>{/* ... */}</ModalBase>;
}
```

### Hook Pattern
```tsx
// Todos os hooks de feature seguem este padrão:
export function useGasto(mes: string, ano: string) {
   const queryClient = useQueryClient();
   const { handleError } = useApiError();

   const { data } = useQuery({ /* ... onError */ });
   const mutation = useMutation({ /* ... onError */ });

   return {
      gastos: data,
      criar: mutation.mutateAsync,
      isSalvando: mutation.isPending
   };
}
```

## 🧪 Testes

> ⚠️ Não implementado ainda
> 
> Próximos passos:
> - [ ] Configurar Vitest
> - [ ] Testes unitários para hooks
> - [ ] Testes de componentes com React Testing Library
> - [ ] Testes de integração

## 🔒 Segurança

### Implementado
- ✅ **Autenticação Google** - OAuth 2.0
- ✅ **Validação de entrada** - Zod schemas
- ✅ **Tipagem TypeScript** - Evita erros de tipo

### Faltando
- ⚠️ CSRF protection
- ⚠️ Rate limiting
- ⚠️ Input sanitization no backend

## 📝 Contribuindo

### Workflow
1. Sempre validar com Zod schemas
2. Usar hooks customizados para lógica
3. Centralizar erros com `useApiError`
4. Adicionar tipos TypeScript
5. Testar localmente antes de commitar

### Exemplo: Adicionar Nova Feature

1. **Criar schema** (`src/schemas/nova-feature.schema.ts`)
2. **Criar hook** (`src/hooks/useNovaFeature.ts`)
3. **Criar componente** (`src/components/nova-feature/`)
4. **Integrar com types** (`src/types/NovaFeature.ts`)

## 📞 Suporte

Dúvidas sobre padrões? Consulte este README ou os comentários no código.

---

**Última atualização:** Fevereiro 2026
