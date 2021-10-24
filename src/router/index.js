import Vue from "vue"
import VueRouter from "vue-router"

const Login = () => import("../views/Login/Login")
const Home = () => import("../views/Home/Home")
const Welcome = () => import("../views/Welcome/Welcome")
const Users = () => import("../views/Users/Users")
const Roles = () => import("../views/Rights/Roles")
const RightsList = () => import("../views/Rights/RightsList")
const GoodsCate = () => import("../views/Goods/GoodsCate")
const GoodsList = () => import("../views/Goods/GoodsList")
const GoodsParam = () => import("../views/Goods/GoodsParam")
const Add = () => import("../views/Goods/children/add")
const Orders = () => import("../views/Orders/Orders")
const Reports = () => import("../views/Reports/Reports")

Vue.use(VueRouter)

const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: Welcome
      },
      {
        path: "/users",
        component: Users
      },
      {
        path: "/roles",
        component: Roles
      },
      {
        path: "/rights",
        component: RightsList
      },
      {
        path: "/goods",
        component: GoodsList
      },
      {
        path: "/goods/add",
        component: Add
      },
      {
        path: "/params",
        component: GoodsParam
      },
      {
        path: "/categories",
        component: GoodsCate
      },
      {
        path: "/orders",
        component: Orders
      },
      {
        path: "/reports",
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem("token")
  if (to.path !== "/login" && !token) next("/login")
  else next()
})

export default router
