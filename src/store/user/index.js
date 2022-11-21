import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { db } from '../../firebaseDatabaseInit';
import { addDoc, where, collection, query, getDocs } from "firebase/firestore";

export default {
    state: {
      user: null,
      leaderboard: []
    },
    mutations: {
      setUser (state, payload) {
        state.user = payload
      },
      setBoard (state, payload) {
        state.leaderboard = payload
      }
    },
     actions: {
      async signUserUp ({commit}, payload) {
        commit('setLoading', true)
        commit('clearError')
        const q = query(
          collection(db, "fq_groups"),                    
          where("groupName", "==", payload.groupname)                                                 
        );                  
        const groupsSnap =  await getDocs(q);   
        let groupId = '';
        groupsSnap.forEach((group) => {                    
          groupId = group.id          
        })
        if(groupId === ''){
          commit('setLoading', false)
          commit('setError', `Group code '${payload.groupname}' is invalid. Please provide a valid group name.`)
          return
        }
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, payload.email, payload.password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;            
            commit('setLoading', false)
            const docRefPost = addDoc(collection(db, "fq_users"), {
                userIdentifier: user.uid,
                userName: payload.username,
                email: payload.email,
                groupCode: payload.groupname
            });
            addDoc(collection(db, "fq_leaderboard"), {
              userId: user.uid,
              userName: payload.username,
              userEmail: payload.email,
              score: 0,              
              groupCode: payload.groupname,
              groupId: groupId
            });
            const newUser = {
                id: user.uid,
                email: user.email
            }
            commit('setUser', newUser)
            //console.log("Document written with ID: ", docRefPost.id);
            commit('setLoading', false)
        })
        .catch((error) => {
            let errorMessage = ''
            if(error.code === 'auth/weak-password'){
                errorMessage = 'Password should be at least 6 characters'
            }
            else if (error.code === 'auth/email-already-in-use'){
                errorMessage = 'The provided email account already exists'
            }
            console.log(error.code + ' -- ' + error.message);   
            commit('setLoading', false)
            commit('setError', errorMessage)         
        });
        
      },
      signUserIn ({commit}, payload) {
        commit('setLoading', true)
        commit('clearError')
        const auth = getAuth();
        signInWithEmailAndPassword(auth, payload.email, payload.password)
        .then((userCredential) => {
            // Signed in           
            commit('setUser', user)
            commit('setLoading', false)
            // ...
        })
        .catch((error) => {
            let errorMessage = ''
            if(error.code === 'auth/wrong-password'){
                errorMessage = 'User name or password is incorrect'
            }
            else if (error.code === 'auth/user-not-found'){
                errorMessage = 'The provided user email does not exists. Please register for new account'
            }
            console.log(error.code + ' -- ' + error.message);   
            commit('setLoading', false)
            commit('setError', errorMessage)       
        });       
      },
      resetPassword ({commit}, email) {
        commit('setLoading', true)        
        const auth = getAuth();
          sendPasswordResetEmail(auth, email)
            .then(() => {
              commit('setLoading', false)
              commit('setSnackBar', {"color": "success", "text": "Successfully sent a password reset link. Please check the spam folder if email has not arrived in the inbox."})          
            })
            .catch((error) => {     
                commit('setLoading', false)                  
                commit('setSnackBar', {"color": "error", "text": error.message})                       
            });
      },
      autoSignIn ({commit}, payload) {
        commit('setUser', {
          id: payload.uid,
          email: payload.email
        })
      },
      logout ({commit}) {
        getAuth().signOut();    
        commit('setUser', null)
      },
      getLeaderboard ({commit}, payload) {
       commit('setBoard', payload)
      },
      clearLeaderBoard ({commit}) {
        commit('setBoard', [])
      }
    },
      getters: {
      user (state) {
        return state.user
      },
      leaderBoard (state) {
        return state.leaderboard
      }
    }
  }