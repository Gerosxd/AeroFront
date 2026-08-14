import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import { isAuthenticated } from '../services/auth.service'

const DashboardView = () => import('../views/DashboardView.vue')
const AlmacenView = () => import('../views/AlmacenView.vue')
const ProveedoresView = () => import('../views/ProveedoresView.vue')
const ArticulosView = () => import('../views/ArticulosView.vue')
const IngenieriaView = () => import('../views/IngenieriaView.vue')
const ComprasView = () => import('../views/ComprasView.vue')
const RequisicionesView = () => import('../views/RequisicionesView.vue')
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      { path: 'almacen', name: 'Almacen', component: AlmacenView },
      { path: 'proveedores', name: 'Proveedores', component: ProveedoresView },
      { path: 'articulos', name: 'Articulos', component: ArticulosView },
      { path: 'ingenieria', name: 'Ingenieria', component: IngenieriaView },
      { path: 'compras', name: 'Compras', component: ComprasView },
      { path: 'requisiciones', name: 'Requisiciones', component: RequisicionesView },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const publicRoute = to.meta.public === true
  const loggedIn = isAuthenticated()

  if (!publicRoute && !loggedIn) {
    next('/')
    return
  }

  if (to.path === '/' && loggedIn) {
    next('/app/dashboard')
    return
  }

  next()
})

export default router