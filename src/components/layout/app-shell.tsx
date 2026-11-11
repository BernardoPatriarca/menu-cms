import { NavLink, Outlet } from "react-router-dom"
import {
  ClipboardList,
  LayoutGrid,
  Receipt,
  Tags,
  UtensilsCrossed,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/comandas", label: "Comandas", icon: Receipt },
  { to: "/produtos", label: "Produtos", icon: UtensilsCrossed },
  { to: "/categorias", label: "Categorias", icon: Tags },
  { to: "/mesas", label: "Mesas", icon: LayoutGrid },
]

export function AppShell() {
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
        <div className="flex items-center gap-2.5 px-4 py-4 md:px-5 md:py-6">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <UtensilsCrossed className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Cardápio Digital</p>
            <p className="text-xs text-sidebar-foreground/60">Painel do restaurante</p>
          </div>
        </div>

        <nav
          aria-label="Principal"
          className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0"
        >
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
