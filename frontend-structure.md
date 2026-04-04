# Estructura Frontend
> Next.js + Screaming Architecture + Clean Architecture (Opción C) + Co-location

```
src/
│
├── app/                                  # Solo routing — Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                  # importa LoginContainer
│   │   ├── register/
│   │   │   └── page.tsx                  # importa RegisterContainer
│   │   └── forgot-password/
│   │       └── page.tsx                  # importa ForgotPasswordContainer
│   ├── (dashboard)/
│   │   ├── layout.tsx                    # layout con sidebar/navbar
│   │   ├── home/
│   │   │   └── page.tsx                  # importa HomeContainer
│   │   ├── categories/
│   │   │   ├── page.tsx                  # importa CategoryListContainer
│   │   │   ├── create/
│   │   │   │   └── page.tsx              # importa CategoryCreateContainer
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx          # importa CategoryEditContainer
│   │   ├── products/
│   │   │   ├── page.tsx                  # importa ProductListContainer
│   │   │   ├── create/
│   │   │   │   └── page.tsx              # importa ProductCreateContainer
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx          # importa ProductEditContainer
│   │   ├── orders/
│   │   │   ├── page.tsx                  # importa OrderListContainer
│   │   │   └── [id]/
│   │   │       └── page.tsx              # importa OrderDetailContainer
│   │   └── users/
│   │       ├── page.tsx                  # importa UserListContainer
│   │       └── [id]/
│   │           └── page.tsx              # importa UserDetailContainer
│   ├── layout.tsx                        # root layout
│   └── not-found.tsx
│
│
├── auth/                                 # Módulo — autenticación
│   ├── ui/
│   │   ├── login-container/
│   │   │   ├── index.tsx                 # orquesta los sub-componentes
│   │   │   ├── login-form/
│   │   │   │   └── index.tsx             # solo lo usa login-container
│   │   │   ├── login-header/
│   │   │   │   └── index.tsx
│   │   │   └── social-buttons/
│   │   │       └── index.tsx
│   │   ├── register-container/
│   │   │   ├── index.tsx
│   │   │   ├── register-form/
│   │   │   │   └── index.tsx
│   │   │   └── register-header/
│   │   │       └── index.tsx
│   │   ├── forgot-password-container/
│   │   │   └── index.tsx
│   │   └── shared/                       # compartido entre containers de auth
│   │       └── auth-layout/
│   │           └── index.tsx
│   ├── application/
│   │   ├── use-login.ts                  # TanStack Query mutation
│   │   ├── use-register.ts
│   │   └── use-forgot-password.ts
│   ├── domain/
│   │   ├── auth.types.ts                 # interfaces, tipos
│   │   └── auth.schemas.ts               # Yup schemas (Formik)
│   └── infra/
│       └── auth.service.ts               # llamadas HTTP con http-client
│
│
├── categories/                           # Módulo — categorías
│   ├── ui/
│   │   ├── category-list-container/
│   │   │   ├── index.tsx
│   │   │   ├── category-stats-card/
│   │   │   │   └── index.tsx             # privado: solo lo usa este container
│   │   │   ├── category-empty-state/
│   │   │   │   └── index.tsx
│   │   │   └── category-filters-bar/
│   │   │       └── index.tsx
│   │   ├── category-create-container/
│   │   │   └── index.tsx
│   │   ├── category-edit-container/
│   │   │   └── index.tsx
│   │   └── shared/                       # compartido entre containers
│   │       ├── category-form/
│   │       │   └── index.tsx             # usado por create y edit
│   │       └── category-card/
│   │           └── index.tsx
│   ├── application/
│   │   ├── use-get-categories.ts
│   │   ├── use-create-category.ts
│   │   └── use-update-category.ts
│   ├── domain/
│   │   ├── category.types.ts
│   │   └── category.schemas.ts
│   └── infra/
│       └── category.service.ts
│
│
├── products/                             # Módulo — productos
│   ├── ui/
│   │   ├── product-list-container/
│   │   │   ├── index.tsx
│   │   │   ├── product-search-bar/
│   │   │   │   └── index.tsx
│   │   │   └── product-table/
│   │   │       └── index.tsx
│   │   ├── product-create-container/
│   │   │   └── index.tsx
│   │   ├── product-edit-container/
│   │   │   └── index.tsx
│   │   └── shared/
│   │       ├── product-form/
│   │       │   └── index.tsx
│   │       └── product-card/
│   │           └── index.tsx
│   ├── application/
│   │   ├── use-get-products.ts
│   │   ├── use-create-product.ts
│   │   └── use-update-product.ts
│   ├── domain/
│   │   ├── product.types.ts
│   │   └── product.schemas.ts
│   └── infra/
│       └── product.service.ts
│
│
├── orders/                               # Módulo — pedidos / tickets
│   ├── ui/
│   │   ├── order-list-container/
│   │   │   ├── index.tsx
│   │   │   └── order-status-badge/
│   │   │       └── index.tsx
│   │   ├── order-detail-container/
│   │   │   ├── index.tsx
│   │   │   ├── order-items-list/
│   │   │   │   └── index.tsx
│   │   │   └── order-summary/
│   │   │       └── index.tsx
│   │   └── shared/
│   │       └── order-card/
│   │           └── index.tsx
│   ├── application/
│   │   ├── use-get-orders.ts
│   │   └── use-get-order-by-id.ts
│   ├── domain/
│   │   └── order.types.ts
│   └── infra/
│       └── order.service.ts
│
│
├── users/                                # Módulo — usuarios
│   ├── ui/
│   │   ├── user-list-container/
│   │   │   └── index.tsx
│   │   └── user-detail-container/
│   │       └── index.tsx
│   ├── application/
│   │   ├── use-get-users.ts
│   │   └── use-get-user-by-id.ts
│   ├── domain/
│   │   └── user.types.ts
│   └── infra/
│       └── user.service.ts
│
│
├── shared/                               # Global — usado por 2+ módulos
│   ├── components/
│   │   ├── button/
│   │   │   └── index.tsx                 # wrapper HeroUI
│   │   ├── input/
│   │   │   └── index.tsx                 # wrapper HeroUI
│   │   ├── modal/
│   │   │   └── index.tsx
│   │   ├── data-table/
│   │   │   └── index.tsx
│   │   └── page-header/
│   │       └── index.tsx
│   ├── hooks/
│   │   ├── use-debounce.ts
│   │   └── use-pagination.ts
│   ├── providers/
│   │   ├── query-provider.tsx            # TanStack Query
│   │   └── auth-provider.tsx
│   └── utils/
│       ├── format-currency.ts
│       └── format-date.ts
│
│
└── lib/                                  # Infraestructura base
    ├── http-client.ts                    # axios config + interceptors (token)
    └── storage.ts                        # helpers localStorage (token)
```

---

## Reglas clave

### Regla de dependencias
```
app/  →  módulos  →  shared/lib
```
- `app/` solo importa containers de módulos.
- Un módulo **nunca** importa de otro módulo.
- Si algo se necesita en 2+ módulos → sube a `shared/`.

### Regla de co-location (dónde va un componente)
| ¿Quién lo usa? | Dónde va |
|---|---|
| Solo 1 container | Dentro del folder del container |
| 2+ containers del mismo módulo | `{modulo}/ui/shared/` |
| 2+ módulos distintos | `shared/components/` |

> Empieza siempre en el nivel más privado. Sube solo cuando sea necesario.

### Regla del page.tsx
```tsx
// app/categories/page.tsx — máximo 5 líneas
import { CategoryListContainer } from '@/categories/ui/category-list-container'
export default function CategoriesPage() {
  return <CategoryListContainer />
}
```

---

## Stack
- **Framework:** Next.js (App Router)
- **UI:** HeroUI v3 + Tailwind CSS
- **Server state:** TanStack Query
- **Forms:** Formik + Yup
- **HTTP:** Axios (lib/http-client.ts)
