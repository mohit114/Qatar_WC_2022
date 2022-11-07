<template>
	<v-container>
		<v-layout>
			<v-flex xs12 sm10 offset-sm1>
				<v-card>
					<v-card-title  style="padding-left: 30px">
						<h3 style="color: #DC4C46">Please consider the rules below:</h3>
					</v-card-title>
					<v-card-text  style="padding-left: 40px">
						<ul>
							<li class="margintop"><h3>Predictions can only be made till 2 hours before the match begins.</h3></li>
							<li class="margintop"><h3>Other players prediction will be revealed only after the prediction time is over.</h3></li>
							<li class="margintop"><h3>After the prediction time is over an email will also be sent having predictions of all the players for that match.</h3></li>			
							<li class="margintop"><h3>Game score till the end of regular or extra time will be taken into account. Penalty shootout score will not be considered.</h3></li>
							<li class="margintop"><h3>Points will be updated soon after the game is over.</h3></li>						
						</ul>
					</v-card-text>
				</v-card>	
				<v-card style="margin-top: 20px">
					<v-card-title  style="padding-left: 30px">
						<h3 style="color: #DC4C46">Points awarding process</h3>
					</v-card-title>
					<v-card-text  style="padding-left: 40px">
						<ul>
							<li class="margintop"><h3>We have 2 process to award points per match prediction.</h3></li>
							<li class="margintop"><h3>First process includes awarding 2 points if your prediction of win or draw is correct.
							</h3></li>
							<li class="margintop"><h3>Second process includes score matching. If both the predicted score matches the actual score, 7 points will be added and if any one score matches with actual score 2 points will be added further.</h3></li>
						</ul>
						<div style="margin-top: 10px">
							<h3 style="color: #DC4C46">To make it clear, below are 3 examples: Lets consider two teams A and B</h3>
							<p></p>
							<div style="color:black">
								<p>Your prediction is: A -> 2 and B -> 0 (here you predicted A is going to win)</p>
								<p>Actual score is: A -> 2 and B -> 0</p>
								<p>Points you will be awarded for this match is -> 2 (since you predicted A is going to win and you are correct) + 7 (both your predicted score matched with actual score) = <b>9(total points) - max point that can be achieved per prediction
								</b></p>
								<v-divider></v-divider>
								<p>Your prediction is: A -> 2 and B -> 1 (here you predicted A is going to win)</p>
								<p>Actual score is: A -> 0 and B -> 1</p>
								<p>Points you will be awarded for this match is -> 0 (since you predicted A is going to win and you are wrong) + 2 (one of your predicted score matched with actual score) = <b>2(total points)</b></p>
								<v-divider></v-divider>
								<p>Your prediction is: A -> 2 and B -> 2 (here you predicted it will be draw)</p>
								<p>Actual score is: A -> 0 and B -> 0</p>
								<p>Points you will be awarded for this match is -> 2 (since you predicted it will be draw and you are correct) + 0 (none of your predicted score matched with actual score) = <b>2(total points)</b></p>
							</div>
						</div>
					</v-card-text>
				</v-card>								
			</v-flex>
		</v-layout>
	</v-container>
</template>