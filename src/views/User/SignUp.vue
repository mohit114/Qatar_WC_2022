<template>
    <v-container>
      <v-layout row v-if="error">
        <v-flex xs12 sm6 offset-sm3>
          <v-alert text prominent type="error" @dismissed="onDismissed">{{error}}</v-alert>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-container>
                <form @submit.prevent="onSignup">
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
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="username"
                        label="Name"
                        id="username"
                        v-model="username"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>
                   <v-layout row>
                    <v-flex xs12>
                      <v-text-field                      
                        name="groupcode"
                        label="Group Code"
                        id="Groupcode"
                        v-model="groupCode"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="password"
                        label="Password"
                        id="password"
                        v-model="password"
                        type="password"
                        required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="confirmPassword"
                        label="Confirm Password"
                        id="confirmPassword"
                        v-model="confirmPassword"
                        type="password"
                        required
                        :rules="[comparePasswords]"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row style="text-align:right">
                    <v-flex xs12 text-xs-center>
                      <v-btn class="primary" type="submit" :disabled="loading" :loading="loading">
                        Sign up
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
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        groupCode: ''
      }
    },
    computed: {
      comparePasswords () {
        if(this.password !== this.confirmPassword)  
            return 'Passwords do not match'
        else
          return true
      },
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      onSignup () {
        if (this.password === this.confirmPassword) {
          this.$store.dispatch('signUserUp', {
            email: this.email, 
            username: this.username, 
            groupname: this.groupCode, 
            password: this.password
          })
        }
        else{
           let error = new Object()
           error.message = 'Passwords do not match'
           this.$store.dispatch('hasError', error)
           return
        }
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    },
    created() {
      this.selectedGroup = null
    }
  }
</script>