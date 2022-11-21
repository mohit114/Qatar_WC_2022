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
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-container>
                <form @submit.prevent="onPasswordResetSubmit">
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="email"
                        label="Email"
                        id="email"
                        v-model="email"
                        type="email"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>                  
                  <v-layout row style="text-align:right">
                    <v-flex xs12 text-xs-center>
                      <v-btn class="primary" type="submit" :disabled="loading" :loading="loading">
                        Send Reset Link
                        <template v-slot:loader>
                          <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                          </span>
                        </template>
                        
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>  
      <div class="footer">
        <p style="margin-top: 10px">Developed by - <strong>Mohit Maharjan</strong></p>
    </div>      
    </v-container>
  </template>
  <style scoped>
  .footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #424242;
  color: white;
  text-align: center;
}
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  <script>
  export default {
    data () {
      return {
        email: ''       
      }
    },
    computed: {      
      loading () {
        return this.$store.getters.loading
      },
      snackbarOps () {
        return this.$store.getters.snackBar
      }
    },
    methods: {
      onPasswordResetSubmit () {        
        this.$store.dispatch('resetPassword', this.email)         
      },      
      dismissSnackBar: function(){
        this.$store.dispatch('clearSnackBar')
      },
    }
  }
</script>