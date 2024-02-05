<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// visit / page
const visitHello = () => {
  router.push('/');
};
</script>

<template>
  <main>
    <div class="wrapper">
      <button @click="visitHello">Go back</button>
      <div style="display: flex;">
        <div style="width: 50%">
          <h2>Log in/Sign up</h2>
          <p>If you haven't signed up yet we will sign you up, else you will get logged in.</p>
        </div>
        <div style="width: 50%">
          <form onsubmit="return false">
            <label for="login">Login: </label>
            <input type="radio" id="login" name="account" value="login" required>

            <label for="signup">Sign Up: </label>
            <input type="radio" id="signup" name="account" value="signup">

            <br><br>
            <label for="username">Username*: </label>
            <div><input type="text" id="username" v-model="username" placeholder="John" required></div>

            <label for="password">Password*: </label>
            <div><input type="password" id="password" v-model="password" placeholder="Smith" required></div>

            <label for="email">Email*: </label>
            <div><input type="email" id="email" v-model="email" placeholder="someone@wustl.edu" required></div>

            <button @click="handleAccount" type="submit">Go</button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
// function to handle account form click
const handleAccount = () => {
  var type = document.querySelector('input[name="account"]:checked');

  if(type){
    // login or sign up
    if(type.value === "login"){
      handleLogin()
    }
    else{
      //TODO: Handle sign up
    }
  }
  else{
    //TODO: Print error message
  }
}

// function to handle login
const handleLogin = () => {
  // get username and password from form
  let username = document.getElementById("username").value
  let password = document.getElementById("password").value
  let email = document.getElementById("email").value

  console.log(username)
  console.log(password)
  console.log(email)

  // validate username, password and email
  if(username == null || password == null || email == null){
    //TODO: Handle
  }

  // validate email
  var regex = /^[a-zA-Z0-9._-]+@wustl\.edu$/
  var validate = regex.test(email)
  if(!validate){
    //TODO: Handle
  }

  // fetch request login user
  fetch('http://localhost:3000/api/users/login', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password}),
  })
      .then(response => {
        if(!response.ok){
          throw new Error('Invalid username or password.')
        }
        return response.json()
      })
      .then(data => {
        //TODO: Handle successful login
      })
      .catch(error => {
        console.error(error)
        res.status(500).json({error: 'Internal server error.'})
      })
}
</script>