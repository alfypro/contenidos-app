import Vue from 'vue'
import Router from 'vue-router'
import Contenidos from '@/components/Contenidos'
import Categorias from '@/components/Categorias'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Contenidos',
      component: Contenidos
    },
    {
      path: '/categorias',
      name: 'Categorias',
      component: Categorias
    }
  ]
})
