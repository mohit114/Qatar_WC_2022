<template>
	<v-container>
        <v-flex xs12 sm8 offset-sm2 mt-2>
            <v-card flat color="transparent">
              <h1 style="color:#DC4C46; text-align: center;">Leaderboard</h1>
            </v-card>                                            
          </v-flex>
		<v-layout>
            
		<v-flex xs12 sm10 offset-sm1 mt-3>
		    <v-data-table
		      :headers="standingTable.headings"
		      :items="allScores"
		      hide-default-footer
              disable-pagination
		      class="elevation-1"
		    >
		      <template  v-slot:item="{ item }">
		      <tr>
		        <td v-bind:style="{
		      		color: item.UserEmail == getuseremail ? '#DC4C46' : 'black'
		      	}" style="width: 50px">{{ item.Rank }}</td>                
		        <td v-if="!item.IsVeteran" v-bind:style="{
		      		color: item.UserEmail == getuseremail ? '#DC4C46' : 'black'
		      	}">{{item.UserName}}</td>
                <td v-else ><v-chip
                    class=""                    
                    color="primary"                    
                    >
                    <v-icon left>
                        mdi-fire
                    </v-icon>
                    <span>{{item.UserName}}</span>
                    </v-chip>
                </td>
		        <td align="center" v-bind:style="{
		      		color: item.UserEmail == getuseremail ? '#DC4C46' : 'black'
		      	}">{{ item.Score }}</td>
		    </tr>
		      </template>
		    </v-data-table>
		</v-flex>
		</v-layout>
	</v-container>
</template>
<script>
import { getAuth } from "firebase/auth";
import { db } from '../firebaseDatabaseInit';
import { query, where, orderBy, getDocs, collection } from "firebase/firestore";
export default {
    components: {
        
    },
    data: () => ({   
        search: '',
        standingTable: {
            headings: [
                {text: 'Rank', align: 'left', sortable:false, value: 'Rank'},
                {text: 'Player Name', align: 'left', sortable:false, value: 'UserName'},
                {text: 'Score', align: 'center', sortable:false, value: 'Score'}
            ]
        },
    }),

    computed: {
        allScores: function(){
            var leaderBoard = this.$store.getters.leaderBoard.map((currentEle, index) => {
                currentEle.Rank = index + 1;                
                return currentEle;
            })            
            return leaderBoard
        },
        getuseremail: function(){
            return getAuth().currentUser.email
        }
    },
    async created() {
        if(this.$store.getters.leaderBoard.length === 0){
            let board = []
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
                where("groupId", "==", userGroupId),
                //orderBy("score", "desc")                    
            ); 
            const leaderSnap = await getDocs(leaderboardQuery)
            leaderSnap.forEach((boardData) => {                  
                board.push
                (
                    {
                        UserEmail: boardData.data().userEmail,
                        UserName: boardData.data().userName,
                        Score: boardData.data().score,
                        IsVeteran: boardData.data().IsVeteran
                    }
                )                                                
            })             
            board.sort((a, b) => b.Score - a.Score);    
            this.$store.dispatch('getLeaderboard', board)                          
        }
	}
}
</script>
<style scoped>
	.hidden{
		visibility: hidden
	}
</style>