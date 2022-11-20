import { getAuth } from "firebase/auth";
import { db } from '../../firebaseDatabaseInit';
import { query, where, doc, getDoc, getDocs, addDoc, updateDoc, collection } from "firebase/firestore";

// import {axios} from 'axios'


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
                const matchDocRef = doc(db, "fq_matches", payload.matchId);
                const matchDocSnap = await getDoc(matchDocRef);
                if(matchDocSnap.data().isPredictionTimeOver){
                    commit('setSnackBar', {"color": "error", "text": 'Prediction time for this match is over.'})
                    return
                }
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
        },
        async lockMatch({commit}, payload) {
            const currentMatchRef = doc(db, "fq_matches", payload.matchId);
            await updateDoc(currentMatchRef, {
                    isPredictionTimeOver: true
            });
            let emailPayload = 
            {
                matchnumber: payload.matchNumber,
                leftCountry: payload.leftCountry,
                rightCountry: payload.rightCountry,
                predictions: []
            }
            const userQuery = query(
                collection(db, "fq_users"),                                                       
                where("groupCode", "==", 'FLEXTECS')                    
            ); 
            const allUsersSnap = await getDocs(userQuery)
            allUsersSnap.forEach(async (user) => {
                const predictionQuery = query(
                    collection(db, "fq_userPredictions"),
                    where("matchId", "==", payload.matchId),
                    where("userId", "==", user.data().userIdentifier)
                  )
                  const userPrediction = await getDocs(predictionQuery)
                  userPrediction.forEach((prediction) => {                     
                    emailPayload.predictions.push({
                        UserName: user.data().userName,
                        UserEmail: user.data().email,
                        LeftCountryPredictedScore: prediction.data().leftPrediction,
                        RightCountryPredictedScore: prediction.data().rightPrediction,
                        IsBetting: prediction.data().isFavourite ? 'Yes' : 'No'
                    })
                }) 
            })
            setTimeout(() => {
                fetch('https://boiling-journey-17710.herokuapp.com/items/email/send',{
                //fetch('http://localhost:5000/items/email/send', {
                method: 'post',                
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailPayload)
                })
                .then(function(response){
                    return response
                })
                .then(function (data) {                
                commit('setSnackBar', {"color": "success", "text": "Successfully time locked for match " + payload.matchNumber + "."})
                })
                .catch(function (error) {
                console.log('Request failed', error);
                });
            }, 2000);           
        },
        async submitFinalScore({commit}, payload){
            const q = query(
                collection(db, "fq_userPredictions"),                    
                where("matchId", "==", payload.matchId)                                                       
              );                  
            const docSnap =  await getDocs(q);                                
            docSnap.forEach(async (predDoc) => {                    
                let leftPrediction = predDoc.data().leftPrediction
                let rightPrediction = predDoc.data().rightPrediction 
                let userUpdatingScore = 0
                
                const leaderboardQuery = query(
                    collection(db, "fq_leaderboard"),                                                       
                    where("userId", "==", predDoc.data().userId)                    
                );   
                const boardSnap =  await getDocs(leaderboardQuery);                                              
                boardSnap.forEach((userScore) => {  
                    userUpdatingScore = userScore.data().score                                 
                })  

                if((parseInt(leftPrediction, 10) - parseInt(rightPrediction, 10) == 0) && (parseInt(payload.leftCountryScore, 10) - parseInt(payload.rightCountryScore, 10) == 0)){
                    userUpdatingScore = userUpdatingScore + 2;
                }
                else if((parseInt(leftPrediction, 10) - parseInt(rightPrediction, 10) > 0) && (parseInt(payload.leftCountryScore, 10) - parseInt(payload.rightCountryScore, 10) > 0)){
                    userUpdatingScore = userUpdatingScore + 2;
                }
                else if((parseInt(leftPrediction, 10) - parseInt(rightPrediction, 10) < 0) && (parseInt(payload.leftCountryScore, 10) - parseInt(payload.rightCountryScore, 10) < 0)){
                    userUpdatingScore = userUpdatingScore + 2;
                }


                if(leftPrediction == payload.leftCountryScore && rightPrediction == payload.rightCountryScore){
                    userUpdatingScore = userUpdatingScore + 7;
                }
                else if (leftPrediction == payload.leftCountryScore || rightPrediction == payload.rightCountryScore){
                    userUpdatingScore = userUpdatingScore + 2;
                }

                const leaderBoardRef = doc(db, "fq_leaderboard", predDoc.id);
                await updateDoc(leaderBoardRef, {
                    score: userUpdatingScore
                });
            })  
        }
    },
    getters: {
        matches (state) {
            return state.allMatches
        }
    }
}