import { Link, Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/layout/app-shell"
import { CategoriesPage } from "@/pages/categories-page"
import { GuestChecksPage } from "@/pages/guest-checks-page"
import { OrdersPage } from "@/pages/orders-page"
import { ProductsPage } from "@/pages/products-page"
import { SpotsPage } from "@/pages/spots-page"

function NotFoundPage() {
  return (
    <div className="py-24 text-center">
      <p className="text-lg font-medium">Página não encontrada</p>
      <Link to="/pedidos" className="mt-2 inline-block text-sm text-primary underline">
        Voltar para os pedidos
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/pedidos" replace />} />
        <Route path="/pedidos" element={<OrdersPage />} />
        <Route path="/comandas" element={<GuestChecksPage />} />
        <Route path="/produtos" element={<ProductsPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/mesas" element={<SpotsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
