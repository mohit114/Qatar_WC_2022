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
      <v-flex xs12 style="text-align:center">
              <h1 style="color: #DC4C46">FIFA WORLD CUP 2022 Qatar ALL MATCHES</h1>			
              </v-flex>
              <v-flex xs12 style="text-align:center">
              <h3 style="color: red">Admin Panel</h3>			
  		      </v-flex>
    <v-card v-for="(match) in allMatches" :key="match.matchNumber"
    class="mx-auto mt-10"
    max-width="630"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          Match - {{match.matchNumber}}
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
              v-model="match.leftCountryScore"    
              :disabled="match.isMatchCompleted"                     
          >
          </v-text-field>
        </v-list-item-title>
        <v-list-item>
          <v-text                         
                        label="Admin"
                        color="red darken-3"
                        value=""                                                                   
                      ></v-text>
        </v-list-item>

        <v-list-item-title class="text-right">
          <v-text-field
                            id="scoreright"
                            name="input-2"
                            label=""   
                            v-model="match.rightCountryScore" 
                            :disabled="match.isMatchCompleted"                             
                          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn 
        color="purple"
        text
        :disabled="match.isPredictionTimeOver"
        @click="lockMatch(match.matchId, match.matchNumber, match.leftCountry, match.rightCountry)"
      >
        Lock
      </v-btn>
      <v-btn
        color="purple"
        text
        :disabled="match.isMatchCompleted" 
        @click="submitFinalScore(match.matchId, match.matchNumber, match.leftPrediction, match.rightPrediction)"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
                                    
    </v-container>
  </template>

<script>
export default {
  data: () => ({ 

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
    submitFinalScore: function(matchId, matchNumber, leftCountryScore, rightCountryScore) {
				if(leftCountryScore == null || rightCountryScore == null){
					this.$store.dispatch('setSnackBar', {"color": "error", "text": "Please provide a valid number."})
					return
				}
				var leftCountryScore = leftCountryScore.trim()
				var rightCountryScore = rightCountryScore.trim()
				if(this.isValidInteger(leftCountryScore) && this.isValidInteger(rightCountryScore)){
					let payload = {						
						matchId: matchId,
                        matchNumber: matchNumber,
						leftCountryScore: leftCountryScore,
						rightCountryScore: rightCountryScore						
					}
					this.$store.dispatch('submitFinalScore', payload)
				}
				else{
					this.$store.dispatch('setSnackBar', {"color": "error", "text": "Please provide a valid number."})
				}
			},  
      lockMatch: async function(matchId, matchNumber, leftCountry, rightCountry) {
        let payload = {
            matchId: matchId,
            matchNumber: matchNumber,
            leftCountry: leftCountry,
            rightCountry: rightCountry
        }
        this.$store.dispatch('lockMatch', payload)        
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