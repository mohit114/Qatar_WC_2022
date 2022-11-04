import { getAuth } from "firebase/auth";
import { db } from '../../firebaseDatabaseInit';
import { query, where, doc, getDocs, addDoc, updateDoc, collection } from "firebase/firestore";

export default {
    state: {
        allMatches: []
    },
    mutations: {
        setMatches (state, payload) {
            state.allMatches = payload
        }
    },
    actions: {
        async getMatches ({commit}) {
            let matches = []
            const querySnapshot = await getDocs(collection(db, "fq_matches"));
            querySnapshot.forEach((doc) => {
                let match = doc.data()
                match.matchId = doc.id               
                matches.push(match)                                                    
            });             
            matches.sort((a, b) => {
                return a.matchNumber - b.matchNumber;
            });  
            matches.forEach(async (match, index) => {
                match.leftPrediction = ''
                match.rightPrediction = ''
                match.isFavourite = false
                const q = query(
                    collection(db, "fq_userPredictions"),                    
                    where("matchId", "==", match.matchId),                    
                    where("userId", "==", getAuth().currentUser.uid)                    
                  );                  
                const docSnap =  await getDocs(q);                                
                docSnap.forEach((predDoc) => {                    
                    match.leftPrediction = predDoc.data().leftPrediction
                    match.rightPrediction = predDoc.data().rightPrediction
                    match.isFavourite = predDoc.data().isFavourite   
                })  
            })                    
            commit('setMatches', matches)
        },
        async addPrediction ({commit}, payload) {   
            try {  
                const q = query(
                    collection(db, "fq_userPredictions"),                    
                    where("matchId", "==", payload.matchId),                    
                    where("userId", "==", getAuth().currentUser.uid)                    
                  );                  
                const docSnap =  await getDocs(q); 
                let predictionId = ''
                docSnap.forEach(prediction => {                    
                    predictionId = prediction.id
                });                 
                if(predictionId !== ''){
                    const currentPredictionRef = doc(db, "fq_userPredictions", predictionId);
                    await updateDoc(currentPredictionRef, {
                        leftPrediction: payload.leftPrediction,
                        rightPrediction: payload.rightPrediction,
                        isFavourite: payload.isFavourite
                      });
                }
                else{
                    await addDoc(collection(db, "fq_userPredictions"), {
                        userId: getAuth().currentUser.uid,
                        matchId: payload.matchId,
                        leftPrediction: payload.leftPrediction,
                        rightPrediction: payload.rightPrediction,
                        isFavourite: payload.isFavourite
                    });
                }            
                commit('setSnackBar', {"color": "success", "text": "Successfully saved your prediction for match " + payload.matchNumber + "."})
            }
            catch(err){
                commit('setSnackBar', {"color": "error", "text": err.message})
            }
        }
    },
    getters: {
        matches (state) {
            return state.allMatches
        }
    }
}