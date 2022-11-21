<template>
    <v-container>
      <v-snackbar
	    :timeout="snackbarOps.timeout"
	    :color="snackbarOps.color"
	    :top="true"
	    :vertical="true"
	    v-model="snackbarOps.snackbar"
	    >
	    {{ snackbarOps.text }}
	    <v-btn dark text @click="dismissSnackBar()">Close</v-btn>
    </v-snackbar>
    <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="700"
    >

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{predictionModalHeading}}
        </v-card-title>

        <v-card-text>
          <v-data-table
		      :headers="headings"
		      :items="rowdata"
		      hide-default-footer
          disable-pagination
		      class="elevation-1"
		    >
		      <!-- <template  v-slot:item="{ item }">
		      <tr>
		        <td v-bind:style="{
		      		color: item.UserEmail == getuseremail ? '#DC4C46' : 'black'
		      	}" style="width: 50px">{{ item.Rank }}</td>
		        <td v-bind:style="{
		      		color: item.UserEmail == getuseremail ? '#DC4C46' : 'black'
		      	}">{{ item.UserName }}</td>
		        <td align="center" v-bind:style="{
		      		color: item.UserEmail == getuseremail ? '#DC4C46' : 'black'
		      	}">{{ item.Score }}</td>
		    </tr>
		      </template> -->
		    </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
      <v-flex xs12 style="text-align:center">
              <h1 style="color: #DC4C46">FIFA WORLD CUP 2022 Qatar ALL MATCHES</h1>			
              </v-flex>
              <v-flex xs12 style="text-align:center">
              <h3 style="color: red">Note*: Nepal Time</h3>			
  		      </v-flex>
    <v-card v-for="(match) in allMatches" :key="match.matchNumber"
    class="mx-auto mt-10"
    max-width="630"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title v-if="!match.leftCountryScoregit " class="text-h5">
          Match - {{match.matchNumber}}
        </v-list-item-title>
        <v-list-item-title v-else class="text-h5">
          Match - {{match.matchNumber}} ({{match.leftCountryScore}} - {{match.rightCountryScore}}) <span style="color: #DC4C46">*leaderboard updated!</span>
        </v-list-item-title>
        <v-list-item-subtitle>{{match.matchDate}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row align="center">
        <v-col          
          cols="6"          
        >
        <span class="text-h6">{{match.leftCountry}}</span> 
        <img  v-bind:src="match.leftFlagUrl" style="width: 84px; margin-left: 15px;">
        </v-col>
        <v-col           
          cols="6"
          align="right"          
        >
          <span class="text-h6" style="margin-right: 10px">{{match.rightCountry}}</span> 
        <img v-bind:src="match.rightFlagUrl" style="width: 84px; margin-left: 15px;">
        </v-col>
      </v-row>
    </v-card-text>
    <v-list class="transparent">
      <v-list-item>
        <v-list-item-title>
          <v-text-field
              id="scoreleft"
              name="input-1"
              label=""  
              v-model="match.leftPrediction"                         
              :disabled="match.isPredictionTimeOver"
          >
          </v-text-field>
        </v-list-item-title>

        <v-list-item>
          <v-checkbox                         
                        label="Mark As Favourite"
                        color="red darken-3"
                        value=""  
                        :disabled="match.isPredictionTimeOver"
                        v-model="match.isFavourite"                                            
                      ></v-checkbox>
        </v-list-item>

        <v-list-item-title class="text-right">
          <v-text-field
                            id="scoreright"
                            name="input-2"
                            label=""   
                            :disabled="match.isPredictionTimeOver"
                            v-model="match.rightPrediction"                         
                          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn 
        color="purple"
        text
        @click="openPredictionDialog(match.matchId, match.matchNumber, match.leftCountry, match.rightCountry, match.isPredictionTimeOver)"
      >
        Predictions
      </v-btn>
      <v-btn
        color="purple"
        text
        :disabled="match.isPredictionTimeOver"
        @click="addPrediction(match.matchId, match.leftPrediction, match.rightPrediction, match.isFavourite, match.matchNumber)"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
                                    
    </v-container>
  </template>

<script>
import { getAuth } from "firebase/auth";
import { db } from '../firebaseDatabaseInit';
import { query, where, getDocs, collection } from "firebase/firestore";
export default {
  data: () => ({ 
    predictionModalHeading: '',
    dialog: false,
    headings: [],   
    rowdata: []
  }),
  computed: {
    allMatches: function() {
      return this.$store.getters.matches
    },
    snackbarOps () {
				return this.$store.getters.snackBar
		}
  },
  methods: {
    addPrediction: function(matchId, leftPrediction, rightPrediction, isFavourite, matchNumber) {
				if(leftPrediction == null || rightPrediction == null){
					this.$store.dispatch('setSnackBar', {"color": "error", "text": "Please provide a valid number."})
					return
				}
				var leftCountryScore = leftPrediction.trim()
				var rightCountryScore = rightPrediction.trim()
				if(this.isValidInteger(leftCountryScore) && this.isValidInteger(rightCountryScore)){
					let payload = {						
						matchId: matchId,
						leftPrediction: leftCountryScore,
						rightPrediction: rightCountryScore,
						isFavourite: isFavourite,
            matchNumber: matchNumber						
					}
					this.$store.dispatch('addPrediction', payload)
				}
				else{
					this.$store.dispatch('setSnackBar', {"color": "error", "text": "Please provide a valid number."})
				}
			},  
      openPredictionDialog: async function(matchId, matchNumber, leftcountry, rightCountry, isPredictionTimeOver) {
        let userPredictionTableData = []
        this.predictionModalHeading = `Match - ${matchNumber} (${leftcountry} vs ${rightCountry})`
        this.headings = [
            {text: 'UserName', align: 'left', sortable:true, value: 'UserName'},
            {text: leftcountry, align: 'left', sortable:false, value: 'LeftPrediction'},
            {text: rightCountry, align: 'center', sortable:false, value: 'RightPrediction'},
            {text: 'Favourite', align: 'center', sortable:true, value: 'Favourite'} 
        ]
        const q = query(
                collection(db, "fq_leaderboard"),                                                       
                where("userId", "==", getAuth().currentUser.uid)                    
            );                
            const boardSnap =  await getDocs(q); 
            let userGroupId = ''                               
            boardSnap.forEach((userScore) => {  
                userGroupId = userScore.data().groupId                                 
            }) 
            const leaderboardQuery = query(
                collection(db, "fq_leaderboard"),                                                       
                where("groupId", "==", userGroupId)                    
            ); 
            const leaderSnap = await getDocs(leaderboardQuery)
            leaderSnap.forEach(async(boardData) => {                
              const predictionQuery = query(
                collection(db, "fq_userPredictions"),
                where("matchId", "==", matchId),
                where("userId", "==", boardData.data().userId)
              )
              
              const userPrediction = await getDocs(predictionQuery)
              userPrediction.forEach((prediction) => {                 
                userPredictionTableData.push({
                    UserName: boardData.data().userName,
                    LeftPrediction: isPredictionTimeOver ? prediction.data().leftPrediction : '??',
                    RightPrediction: isPredictionTimeOver ? prediction.data().rightPrediction : '??',
                    Favourite: prediction.data().isFavourite ? 'Yes' : 'No'
                })
              }) 
              this.rowdata = userPredictionTableData 
              setTimeout(() => {
                this.dialog = true
              }, 500);
            }) 
            //this.dialog = true
      },    
      isValidInteger: function(value){
				if(value == "0")
					return true
				else{
					if(parseInt(value)){
						if(parseInt(value) < 0){
							return false
						}
						else
							return true
					}
					else{
						return false
					}
				}
			},
      dismissSnackBar: function(){
				this.$store.dispatch('clearSnackBar')
			},
  }
}
</script>