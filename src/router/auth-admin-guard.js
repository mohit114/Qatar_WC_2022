import { getAuth } from "firebase/auth";

export default (to, from, next) => {
  console.log(getAuth().currentUser)
    if (getAuth().currentUser !== null && getAuth().currentUser.uid == 'R3JBaiB1FKXUHvuXtjCDir826T62') {
      next()
    } else {
      next('/')
    }
  }