import Vue from 'vue'
import VueRouter from 'vue-router'
import { getAuth } from "firebase/auth";
import HomeView from '../views/HomeView.vue'
import MatchesView from '../views/Matches.vue'
import LeaderBoardView from '../views/Leaderboard.vue'
import LoginView from '../views/User/Login.vue'
import SignUpView from '../views/User/SignUp.vue'
import SupportView from '../views/User/Support.vue'
import RuleView from '../views/User/Rule.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'match',
    component: MatchesView,
    //beforeEnter: AuthGuard
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'signUp',
    component: SignUpView
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderBoardView,
  },
  {
    path: '/support',
    name: 'support',
    component: SupportView,
    //beforeEnter: AuthGuard
  },
  {
    path: '/rules',
    name: 'rule',
    component: RuleView,
    //beforeEnter: AuthGuard
  }
]

const router = new VueRouter({  
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && to.name !== 'signUp' && getAuth().currentUser == null) next({ name: 'login' })
  else next()
})

export default router
