import { getAuth } from "firebase/auth";

export default (to, from, next) => {
  if (getAuth().currentUser !== null) {
    next()
  } else {
    next('/login')
  }
}