<template>
  <div class="container">
  <v-app app>
  <v-app-bar app>
     <v-app-bar-nav-icon @click="drawer = true" 
                         class="d-flex d-sm-none"
                         ></v-app-bar-nav-icon>
     
      
      <v-toolbar dark class="secondary"
        fixed
        >
          <v-toolbar-side-icon
            @click.stop="sideNav = !sideNav"
            class="hidden-sm-and-up "></v-toolbar-side-icon>
          <v-toolbar-title>
            <router-link to="/" tag="span" style="cursor: pointer; color:white; font-weight: 400;">{{currentUser}}</router-link>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-xs-only">
            <v-btn
              text              
              v-for="item in menuItems"
            :key="item.title"
             :to="item.link">
            
              <v-icon left color="orange">{{ item.icon }}</v-icon>
              {{ item.title }}

            </v-btn>
            <v-btn
            text
            v-if="IsAuthenticated"
            @click="logout"            
            >
            <v-icon left color="orange">mdi-exit-to-app</v-icon>
            Logout
            </v-btn>
          </v-toolbar-items>
      </v-toolbar>
  </v-app-bar>
  <!-- Add a navigation bar -->
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
  >
    <v-list
      nav
      dense
    >
      <v-list-item-group
      >
        <v-list-item v-for="(item, index) in menuItems" :key="item.title" :to="item.link">
          <v-icon color="primary">{{ item.icon }}</v-icon><v-list-item-title style="margin-left: 10px" @click="tab = index">{{ item.title }}</v-list-item-title>
        </v-list-item>
        <v-list-item 
        v-if="IsAuthenticated"
        @click="logout"
        >
        <v-icon color="primary">mdi-exit-to-app</v-icon><v-list-item-title style="margin-left: 10px" @click="tab = index">Logout</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
  <main style="margin-top: 100px">
      <router-view></router-view>
    </main>
</v-app>
</div>
</template>

<script>

import { db } from './firebaseDatabaseInit';
import { doc, getDoc, getDocs, addDoc, collection } from "firebase/firestore";

// async function test(){
//     const querySnapshot = await getDocs(collection(db, "fq_users"));
//     querySnapshot.forEach((doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       console.log(doc.id, " => ", doc.data());
//     }); 
//     const docRef = doc(db, "fq_users", "doc_id_here");
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       console.log("Document data:", docSnap.data());
//     } else {
//       // doc.data() will be undefined in this case
//       console.log("No such document!");
//     }

//     // const docRefPost = await addDoc(collection(db, "fq_users"), {
//     //   name: "Tokyo",
//     //   country: "Japan"
//     // });
//     // console.log("Document written with ID: ", docRefPost.id);
// }

export default {
  name: 'App',
  data: () => ({
    sideNav: false,
    drawer: false,
    tab: null,      
  }),
  computed: {
    menuItems () {
      let menuItems = [
          {icon: 'mdi-account-check', title: 'Login', link: '/login'},
          {icon: 'mdi-account-plus', title: 'Register', link: '/register'},
      ]
      if(this.IsAuthenticated) {
        menuItems = [
          {icon: 'mdi-chart-bar', title: 'Leaderboard', link: '/leaderboard'},
          {icon: 'mdi-soccer', title: 'Matches', link: '/'},
          {icon: 'mdi-clipboard-text', title: 'Rules', link: '/rules'},
          {icon: 'mdi-phone', title: 'Support', link: '/support'}
        ]
      }
      if(this.IsUserAdmin) {
        menuItems = [
          {icon: 'mdi-ghost', title: 'Admin', link: '/admin'},
          {icon: 'mdi-chart-bar', title: 'Leaderboard', link: '/leaderboard'},
          {icon: 'mdi-soccer', title: 'Matches', link: '/'},
          {icon: 'mdi-clipboard-text', title: 'Rules', link: '/rules'},
          {icon: 'mdi-phone', title: 'Support', link: '/support'}
        ]
      }      
      return menuItems
    },
    IsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    IsUserAdmin () {
      if(this.$store.getters.user !== null && this.$store.getters.user !== undefined){        
        if(this.$store.getters.user.id === 'ashdfkdjf'){    //process.env.ADMIN_ID       
          return true
        }
        else
          return false
      }
      else
        return false
    },  
    currentUser: function(){
      if(this.$store.getters.user !== null && this.$store.getters.user !== undefined)
          return 'Welcome, ' + this.$store.getters.user.email
      else
          return 'FIFA WORLD CUP 2022 @QATAR'          
    },          
  },
  methods: {
    logout(){
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
};
//test()
</script>
