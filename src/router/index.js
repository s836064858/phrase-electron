import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import EditPhrase from '../views/editPhrase.vue'
import EditPhraseType from '../views/editPhraseType.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/editPhrase',
    name: 'editPhrase',
    component: EditPhrase,
    meta: {
      noHeader: true
    }
  },
  {
    path: '/editPhraseType',
    name: 'editPhraseType',
    component: EditPhraseType,
    meta: {
      noHeader: true
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
