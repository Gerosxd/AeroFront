<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { X, Save } from 'lucide-vue-next'

export interface PayloadNuevaAeronave {
  matricula: string
  nsAeronave: string
  modeloAeronave: number
  operador: string
  maMotorLH: string
  moMotorLH: string
  nsMotorLH: string
  maMotorRH: string
  moMotorRH: string
  nsMotorRH: string
  maMotorC: string
  moMotorC: string
  nsMotorC: string
  maAPU: string
  moAPU: string
  nsAPU: string
}

interface CatalogoItem {
  id: number
  nombre: string
}

interface CatalogoModeloItem extends CatalogoItem {
  marca?: string
  tipo?: string
}

interface CatalogosAeronave {
  modelos: CatalogoModeloItem[]
}

const props = defineProps<{
  open: boolean
  catalogos: CatalogosAeronave
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: PayloadNuevaAeronave): void
}>()

const crearAeronaveVacia = (): PayloadNuevaAeronave => ({
  matricula: '',
  nsAeronave: '',
  modeloAeronave: 0,
  operador: '',
  maMotorLH: '',
  moMotorLH: '',
  nsMotorLH: '',
  maMotorRH: '',
  moMotorRH: '',
  nsMotorRH: '',
  maMotorC: '',
  moMotorC: '',
  nsMotorC: '',
  maAPU: '',
  moAPU: '',
  nsAPU: ''
})

const form = reactive<PayloadNuevaAeronave>(crearAeronaveVacia())

const selectedModelo = computed(() => {
  return props.catalogos.modelos.find(item => item.id === form.modeloAeronave)
})

const resetForm = () => {
  Object.assign(form, crearAeronaveVacia())
}

watch(
  () => props.open,
  (value) => {
    if (value) resetForm()
  }
)

const close = () => emit('close')

const validarFormulario = () => {

  if (!form.matricula.trim()) {
    alert('La matrícula es obligatoria')
    return false
  }

  if (!form.nsAeronave.trim()) {
    alert('El número de serie es obligatorio')
    return false
  }

  if (!form.modeloAeronave) {
    alert('Selecciona un modelo')
    return false
  }

  if (!form.operador.trim()) {
    alert('El operador es obligatorio')
    return false
  }

  return true
}

const guardar = () => {

  if (!validarFormulario()) return

  emit('submit', {
    matricula: form.matricula.trim(),
    nsAeronave: form.nsAeronave.trim(),
    modeloAeronave: Number(form.modeloAeronave),
    operador: form.operador.trim(),
    maMotorLH: form.maMotorLH.trim(),
    moMotorLH: form.moMotorLH.trim(),
    nsMotorLH: form.nsMotorLH.trim(),
    maMotorRH: form.maMotorRH.trim(),
    moMotorRH: form.moMotorRH.trim(),
    nsMotorRH: form.nsMotorRH.trim(),
    maMotorC: form.maMotorC.trim(),
    moMotorC: form.moMotorC.trim(),
    nsMotorC: form.nsMotorC.trim(),
    maAPU: form.maAPU.trim(),
    moAPU: form.moAPU.trim(),
    nsAPU: form.nsAPU.trim()
  })

}
</script>

<template>
  <teleport to="body">

    <div v-if="open" class="fixed inset-0 z-[9999]">

      <div
        class="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
        @click="close"
      ></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">

        <div class="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

          <!-- Cabecera -->

          <div class="flex items-start justify-between px-6 py-5 border-b border-slate-200">

            <div>
              <h2 class="text-xl font-semibold text-slate-900">
                Nueva Aeronave
              </h2>

              <p class="text-slate-500 mt-1 text-sm">
                Registrar una nueva aeronave en el sistema
              </p>
            </div>

            <button
              class="p-2 rounded-lg hover:bg-slate-100 text-slate-700"
              @click="close"
            >
              <X class="w-5 h-5" />
            </button>

          </div>

          <!-- Cuerpo -->

          <div class="flex-1 overflow-y-auto px-6 py-6 bg-slate-50">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Matrícula *
                </label>

                <input
                  v-model="form.matricula"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  No. Serie Aeronave *
                </label>

                <input
                  v-model="form.nsAeronave"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Modelo *
                </label>

                <select
                  v-model.number="form.modeloAeronave"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="0" disabled>
                    Seleccionar modelo
                  </option>

                  <option
                    v-for="item in catalogos.modelos"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.nombre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Marca Aeronave
                </label>

                <input
                  :value="selectedModelo?.marca ?? ''"
                  type="text"
                  readonly
                  class="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-700"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Tipo Aeronave
                </label>

                <input
                  :value="selectedModelo?.tipo ?? ''"
                  type="text"
                  readonly
                  class="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-700"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Operador *
                </label>

                <input
                  v-model="form.operador"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Marca Motor LH
                </label>

                <input
                  v-model="form.maMotorLH"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Modelo Motor LH
                </label>

                <input
                  v-model="form.moMotorLH"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  No. Serie Motor LH
                </label>

                <input
                  v-model="form.nsMotorLH"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Marca Motor RH
                </label>

                <input
                  v-model="form.maMotorRH"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Modelo Motor RH
                </label>

                <input
                  v-model="form.moMotorRH"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  No. Serie Motor RH
                </label>

                <input
                  v-model="form.nsMotorRH"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Marca Motor C
                </label>

                <input
                  v-model="form.maMotorC"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Modelo Motor C
                </label>

                <input
                  v-model="form.moMotorC"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  No. Serie Motor C
                </label>

                <input
                  v-model="form.nsMotorC"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Marca APU
                </label>

                <input
                  v-model="form.maAPU"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  Modelo APU
                </label>

                <input
                  v-model="form.moAPU"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-800 mb-2">
                  No. Serie APU
                </label>

                <input
                  v-model="form.nsAPU"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          <!-- FOOTER -->

          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">

            <button
              @click="close"
              class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              @click="guardar"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] text-white text-sm font-medium hover:bg-slate-800"
            >
              <Save class="w-4 h-4" />
              Guardar Aeronave
            </button>

          </div>
        </div>
      </div>
    </div>

  </teleport>
</template>
