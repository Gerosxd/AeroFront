import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'

// Vistas del sistema
const DashboardView = () => import('../views/DashboardView.vue')
// Archivos de las tablas
const AlmacenView = () => import('../views/AlmacenView.vue') 
const ProveedoresView = () => import('../views/ProveedoresView.vue')
const ArticulosView = () => import('../views/ArticulosView.vue')
const IngenieriaView = () => import('../views/IngenieriaView.vue')

// NUEVAS VISTAS DE USUARIO
const ProfileView = () => import('../views/ProfileView.vue')

// Estas vistas se pueden implementar más adelante
//const SettingsView = () => import('../views/SettingsView.vue')
//const HelpView = () => import('../views/HelpView.vue')

const routes = [
  { 
    path: '/', 
    name: 'Login', 
    component: LoginView 
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
      
      // NUEVAS RUTAS DE USUARIO
      { path: 'profile', name: 'Profile', component: ProfileView },
      //{ path: 'settings', name: 'Settings', component: SettingsView },
      //{ path: 'help', name: 'Help', component: HelpView },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router