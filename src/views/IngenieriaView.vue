<script setup lang="ts">
import { ref } from 'vue';
import { 
  Plus, Search, Filter, Settings, FileText, 
  Plane, Users, Briefcase, Calendar 
} from 'lucide-vue-next';

// --- 1. INTERFACES DE DATOS ---
interface OrdenTrabajo {
  id: string;
  fechaApertura: string;
  fechaSalida?: string; 
  aeronave: string;
  cliente: string;
  tipo: string;
  responsable: string;
  horasVuelo: number;
  ciclos: number;
  prioridad: 'Normal' | 'Alta' | 'Urgente' | 'Media';
  estado: 'Completado' | 'En Progreso' | 'Pendiente' | 'Programado';
  duracion?: number; // Para tabla de salidas
}

interface Aeronave {
  matricula: string;
  modelo: string;
  fabricante: string;
  serie: string;
  cliente: string;
  horas: string;
  ciclos: string;
  estado: 'Operativo' | 'En Mantenimiento';
}

interface Cliente {
  id: string;
  nombre: string;
  rfc: string;
  contacto: string;
  telefono: string;
  email: string;
  flota: number;
  estado: 'Activo' | 'Inactivo';
}

interface Modelo {
  id: string;
  modelo: string;
  fabricante: string;
  tipo: string;
  capacidad: string;
  motores: string;
  flota: number;
}

interface Reporte {
  id: string;
  aeronave: string;
  tipo: string;
  descripcion: string;
  fechaProg: string;
  horasLimite: string;
  ciclosLimite: string;
  prioridad: 'Normal' | 'Alta' | 'Media';
  estado: 'Programado' | 'Próximo';
}

// --- 2. DATOS SIMULADOS ---
const ordenes = ref<OrdenTrabajo[]>([
  { id: 'OT-2026-001', fechaApertura: '05/01/2026', fechaSalida: '20/01/2026', aeronave: 'XA-ABC', cliente: 'AeroMéxico', tipo: 'Preventivo', responsable: 'Ing. Juan Pérez', horasVuelo: 25340, ciclos: 18920, prioridad: 'Normal', estado: 'Completado', duracion: 15 },
  { id: 'OT-2026-002', fechaApertura: '08/01/2026', fechaSalida: '11/01/2026', aeronave: 'XA-DEF', cliente: 'Volaris', tipo: 'Correctivo', responsable: 'Ing. María López', horasVuelo: 18750, ciclos: 14200, prioridad: 'Alta', estado: 'En Progreso', duracion: 3 },
  { id: 'OT-2026-003', fechaApertura: '10/01/2026', fechaSalida: '-', aeronave: 'XA-GHI', cliente: 'Interjet', tipo: 'Inspección', responsable: 'Ing. Carlos Ramírez', horasVuelo: 12450, ciclos: 9800, prioridad: 'Normal', estado: 'Pendiente', duracion: 1 },
  { id: 'OT-2026-004', fechaApertura: '12/01/2026', fechaSalida: '-', aeronave: 'XA-JKL', cliente: 'AeroMéxico', tipo: 'Predictivo', responsable: 'Ing. Ana García', horasVuelo: 30120, ciclos: 22340, prioridad: 'Urgente', estado: 'En Progreso' },
  { id: 'OT-2026-005', fechaApertura: '13/01/2026', fechaSalida: '-', aeronave: 'XA-MNO', cliente: 'Volaris', tipo: 'Preventivo', responsable: 'Ing. Roberto Díaz', horasVuelo: 15600, ciclos: 11250, prioridad: 'Normal', estado: 'Programado' },
]);

const aeronaves = ref<Aeronave[]>([
  { matricula: 'XA-ABC', modelo: 'Boeing 737-800', fabricante: 'Boeing', serie: '12345', cliente: 'AeroMéxico', horas: '25,340', ciclos: '18,920', estado: 'Operativo' },
  { matricula: 'XA-DEF', modelo: 'Airbus A320-200', fabricante: 'Airbus', serie: '67890', cliente: 'Volaris', horas: '18,750', ciclos: '14,200', estado: 'En Mantenimiento' },
  { matricula: 'XA-GHI', modelo: 'Embraer E190', fabricante: 'Embraer', serie: '11223', cliente: 'Interjet', horas: '12,450', ciclos: '9,800', estado: 'Operativo' },
]);

const clientes = ref<Cliente[]>([
  { id: 'CLI-001', nombre: 'AeroMéxico S.A. de C.V.', rfc: 'AMX850123ABC', contacto: 'Roberto Sánchez', telefono: '+52 55 1234 5678', email: 'contacto@aeromexico.com', flota: 12, estado: 'Activo' },
  { id: 'CLI-002', nombre: 'Volaris S.A. de C.V.', rfc: 'VOL920615XYZ', contacto: 'Laura Martínez', telefono: '+52 81 9876 5432', email: 'ventas@volaris.com', flota: 8, estado: 'Activo' },
  { id: 'CLI-003', nombre: 'Interjet ABC Aerolíneas', rfc: 'INT780912DEF', contacto: 'Miguel Torres', telefono: '+52 33 5555 1234', email: 'info@interjet.com', flota: 5, estado: 'Activo' },
]);

const modelos = ref<Modelo[]>([
  { id: 'MOD-001', modelo: 'Boeing 737-800', fabricante: 'Boeing', tipo: 'Comercial', capacidad: '189 pax', motores: '2x CFM56-7B', flota: 15 },
  { id: 'MOD-002', modelo: 'Airbus A320-200', fabricante: 'Airbus', tipo: 'Comercial', capacidad: '180 pax', motores: '2x CFM56-5B', flota: 12 },
  { id: 'MOD-003', modelo: 'Embraer E190', fabricante: 'Embraer', tipo: 'Regional', capacidad: '114 pax', motores: '2x GE CF34-10E', flota: 8 },
]);

const reportes = ref<Reporte[]>([
  { id: 'REP-001', aeronave: 'XA-ABC', tipo: 'Inspección A', descripcion: 'Inspección de 500 horas', fechaProg: '15/02/2026', horasLimite: '26,000', ciclosLimite: '19,500', prioridad: 'Media', estado: 'Programado' },
  { id: 'REP-002', aeronave: 'XA-DEF', tipo: 'Inspección C', descripcion: 'Mantenimiento mayor 18 meses', fechaProg: '01/03/2026', horasLimite: '20,000', ciclosLimite: '15,000', prioridad: 'Alta', estado: 'Próximo' },
  { id: 'REP-003', aeronave: 'XA-GHI', tipo: 'Inspección B', descripcion: 'Revisión de 1000 horas', fechaProg: '20/04/2026', horasLimite: '13,500', ciclosLimite: '10,500', prioridad: 'Normal', estado: 'Programado' },
]);

// --- 3. HELPERS VISUALES (COLORES) ---
const getPriorityColor = (p: string) => {
  switch(p) {
    case 'Urgente': return 'bg-red-100 text-red-700 border-red-200';
    case 'Alta': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default: return 'bg-green-100 text-green-700 border-green-200';
  }
};

const getStatusColor = (s: string) => {
  switch(s) {
    case 'Completado': case 'Operativo': case 'Activo': return 'bg-green-100 text-green-700';
    case 'En Progreso': return 'bg-blue-100 text-blue-700';
    case 'Pendiente': case 'En Mantenimiento': case 'Próximo': return 'bg-yellow-100 text-yellow-800';
    case 'Urgente': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// --- 4. CONTROL DE PESTAÑAS ---
const activeTab = ref('todas');
const tabs = [
  { id: 'todas', label: 'Todas las OT' },
  { id: 'crear', label: 'Crear OT' },
  { id: 'aeronaves', label: 'Aeronaves' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'modelos', label: 'Modelos' },
  { id: 'reportes', label: 'Reportes Programados' },
];
</script>

<template>
  <div class="space-y-6 pb-12">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ingeniería</h1>
        <p class="text-gray-500 text-sm">Gestiona órdenes de trabajo, aeronaves y reportes de mantenimiento.</p>
      </div>
    </div>

    <div class="border-b border-gray-200 overflow-x-auto">
      <nav class="flex gap-6 min-w-max">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id 
              ? 'border-blue-600 text-blue-600 font-semibold' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-3 px-1 border-b-2 text-sm transition-colors'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'todas'" class="space-y-4 animate-fade-in">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Buscar por OT, aeronave, cliente..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">No. OT</th>
              <th class="px-6 py-4">Fecha Apertura</th>
              <th class="px-6 py-4">Aeronave</th>
              <th class="px-6 py-4">Cliente</th>
              <th class="px-6 py-4">Tipo Mant.</th>
              <th class="px-6 py-4">Responsable</th>
              <th class="px-6 py-4">Horas Vuelo</th>
              <th class="px-6 py-4">Ciclos</th>
              <th class="px-6 py-4">Prioridad</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="ot in ordenes" :key="ot.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-semibold text-gray-900 text-sm">{{ ot.id }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ ot.fechaApertura }}</td>
              <td class="px-6 py-4 font-mono text-xs text-gray-900">{{ ot.aeronave }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ ot.cliente }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ ot.tipo }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ ot.responsable }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm text-right">{{ ot.horasVuelo.toLocaleString() }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm text-right">{{ ot.ciclos.toLocaleString() }}</td>
              <td class="px-6 py-4">
                <span :class="`px-2 py-0.5 rounded border text-xs font-medium ${getPriorityColor(ot.prioridad)}`">{{ ot.prioridad }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ot.estado)}`">{{ ot.estado }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="activeTab === 'crear'" class="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FileText class="w-5 h-5 text-gray-500" /> Nueva Orden de Trabajo
      </h3>
      <form class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">No. OT</label>
            <input type="text" value="OT-2026-006" disabled class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Fecha de Apertura</label>
            <input type="date" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Prioridad</label>
            <select class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none">
              <option>Normal</option>
              <option>Alta</option>
              <option>Urgente</option>
            </select>
          </div>
          
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Cliente</label>
            <select class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none">
              <option>Seleccionar cliente...</option>
              <option>AeroMéxico</option>
              <option>Volaris</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Aeronave</label>
            <select class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none">
              <option>Seleccionar aeronave...</option>
              <option>XA-ABC</option>
              <option>XA-DEF</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Tipo de Mantenimiento</label>
            <select class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none">
              <option>Preventivo</option>
              <option>Correctivo</option>
              <option>Predictivo</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Horas de Vuelo</label>
            <input type="number" placeholder="0" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Ciclos</label>
            <input type="number" placeholder="0" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Responsable</label>
            <select class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none">
              <option>Seleccionar responsable...</option>
              <option>Ing. Juan Pérez</option>
              <option>Ing. María López</option>
            </select>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Descripción del Trabajo</label>
          <textarea rows="3" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none resize-none" placeholder="Describe el trabajo a realizar..."></textarea>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Observaciones</label>
          <textarea rows="2" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none resize-none" placeholder="Observaciones adicionales..."></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="button" class="px-4 py-2 text-sm font-bold text-white bg-[#0f172a] rounded-lg hover:bg-slate-800 flex items-center gap-2">
            <Plus class="w-4 h-4" /> Crear Orden de Trabajo
          </button>
        </div>
      </form>
    </div>

    <div v-else-if="activeTab === 'aeronaves'" class="space-y-4 animate-fade-in">
      <div class="flex justify-end">
        <button class="bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
          <Plus class="w-4 h-4" /> Nueva Aeronave
        </button>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">Matrícula</th>
              <th class="px-6 py-4">Modelo</th>
              <th class="px-6 py-4">Fabricante</th>
              <th class="px-6 py-4">No. Serie</th>
              <th class="px-6 py-4">Cliente</th>
              <th class="px-6 py-4">Horas de Vuelo</th>
              <th class="px-6 py-4">Ciclos</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="nave in aeronaves" :key="nave.matricula" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-bold text-gray-900 text-sm">{{ nave.matricula }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.modelo }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.fabricante }}</td>
              <td class="px-6 py-4 text-gray-500 font-mono text-xs">{{ nave.serie }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.cliente }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.horas }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ nave.ciclos }}</td>
              <td class="px-6 py-4">
                 <span :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(nave.estado)}`">{{ nave.estado }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="activeTab === 'clientes'" class="space-y-4 animate-fade-in">
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre</th>
              <th class="px-6 py-4">RFC</th>
              <th class="px-6 py-4">Contacto</th>
              <th class="px-6 py-4">Teléfono</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Aeronaves</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="cli in clientes" :key="cli.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-gray-500 text-xs">{{ cli.id }}</td>
              <td class="px-6 py-4 font-bold text-gray-900 text-sm">{{ cli.nombre }}</td>
              <td class="px-6 py-4 text-gray-600 text-xs font-mono">{{ cli.rfc }}</td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ cli.contacto }}</td>
              <td class="px-6 py-4 text-gray-600 text-xs">{{ cli.telefono }}</td>
              <td class="px-6 py-4 text-blue-600 text-xs hover:underline cursor-pointer">{{ cli.email }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold text-center">{{ cli.flota }}</td>
              <td class="px-6 py-4"><span :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cli.estado)}`">{{ cli.estado }}</span></td>
              <td class="px-6 py-4 text-right"><button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Editar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="activeTab === 'modelos'" class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto animate-fade-in">
      <table class="w-full text-left border-collapse min-w-max">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Modelo</th>
            <th class="px-6 py-4">Fabricante</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Capacidad</th>
            <th class="px-6 py-4">Motores</th>
            <th class="px-6 py-4">Unidades en Flota</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="mod in modelos" :key="mod.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-500 text-xs">{{ mod.id }}</td>
            <td class="px-6 py-4 font-bold text-gray-900 text-sm">{{ mod.modelo }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.fabricante }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.tipo }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.capacidad }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ mod.motores }}</td>
            <td class="px-6 py-4 text-gray-900 font-bold">{{ mod.flota }}</td>
            <td class="px-6 py-4 text-right"><button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Editar</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto animate-fade-in">
       <table class="w-full text-left border-collapse min-w-max">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
          <tr>
            <th class="px-6 py-4">ID Reporte</th>
            <th class="px-6 py-4">Aeronave</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Descripción</th>
            <th class="px-6 py-4">Fecha Programada</th>
            <th class="px-6 py-4">Horas Límite</th>
            <th class="px-6 py-4">Ciclos Límite</th>
            <th class="px-6 py-4">Prioridad</th>
            <th class="px-6 py-4">Estado</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="rep in reportes" :key="rep.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-500 text-sm">{{ rep.id }}</td>
            <td class="px-6 py-4 font-bold text-gray-900 text-sm">{{ rep.aeronave }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.tipo }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.descripcion }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.fechaProg }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.horasLimite }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">{{ rep.ciclosLimite }}</td>
            <td class="px-6 py-4"><span :class="`px-2 py-0.5 rounded border text-xs font-medium ${getPriorityColor(rep.prioridad)}`">{{ rep.prioridad }}</span></td>
            <td class="px-6 py-4"><span :class="`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rep.estado)}`">{{ rep.estado }}</span></td>
            <td class="px-6 py-4 text-right"><button class="text-gray-900 hover:text-blue-600 font-bold text-sm">Ver</button></td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
/* Animación suave al cambiar de pestaña */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>