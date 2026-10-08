<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const name = ref('')
const lname = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function signup() {
  error.value = ''
  loading.value = true
  try {
    await auth.register({
      name: name.value,
      lname: lname.value,
      username: username.value,
      email: email.value,
      password: password.value,
    })
    router.push('/Login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Cannot reach the server'
  } finally {
    loading.value = false
  }
}
</script>

<template>
    <div class="global">
        <div class="div1">
            <img src="../../public/logo.png" alt="logo">
            <p id="welcome">Welcome</p>
            <p id="to">To</p>
            <p id="france"><span class="blue">Fr</span>an<span class="red">ce</span></p>
            <p id="intro">The no-panic guide to living in France. Log in to read the guides, explore the map and play the quiz.</p>
            <nav class="legal">
                <RouterLink to="/aboutUs">About us and legal</RouterLink>
            </nav>
        </div>
        <div class="div2">
            <div class="bothbutton">
                <RouterLink class="tab" to="/Login">LOG IN</RouterLink>
                <span class="tab active">SIGN UP</span>
            </div>
            <form @submit.prevent="signup">
                <label for="name">FIRST NAME</label>
                <input v-model="name" type="text" id="name" name="name" placeholder="Name" required>
                <label for="lname">LAST NAME</label>
                <input v-model="lname" type="text" id="lname" name="lname" placeholder="Last name" required>
                <label for="username">USERNAME</label>
                <input v-model="username" type="text" id="username" name="username" placeholder="Username" maxlength="50" required>
                <label for="mail">EMAIL</label>
                <input v-model="email" type="email" id="mail" name="mail" placeholder="Email" required>
                <label for="password">PASSWORD</label>
                <input v-model="password" type="password" id="password" name="password" placeholder="••••••••" minlength="8" required>
                <p v-if="error" class="error">{{ error }}</p>
                <button type="submit" :disabled="loading">SIGN UP</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.bothbutton{
    display: flex;
    border: 3px solid black;
}
.tab {
    flex: 1;
    padding: 16px 0;
    background-color: #FFFFFF;
    color: black;
    font-size: 20px;
    line-height: 1.4;
    font-family: Dummies;
    text-align: center;
    text-decoration: none;
}
.tab.active {
    background-color: black;
    color: #FFEE00;
}
a.tab:hover {
    background-color: #FFEE00;
}

form {
    display: flex;
    flex-direction: column;
    margin-top: 26px;
}
form label {
    margin-bottom: 6px;
    color: black;
    font-size: 13px;
    font-weight: bold;
    font-family: 'Courier Prime', monospace;
    text-transform: uppercase;
}
form input {
    height: 53px;
    margin-bottom: 20px;
    padding: 0 16px;
    border: 2px solid black;
    border-radius: 8px;
    background-color: #FFFFFF;
    color: black;
    font-size: 16px;
    font-family: 'Courier Prime', monospace;
}
form input::placeholder {
    color: #777777;
}
form input:focus {
    outline: 3px solid #FFEE00;
    outline-offset: 0;
}
form button {
    height: 55px;
    margin-top: 24px;
    border: none;
    background-color: black;
    color: #FFEE00;
    font-size: 20px;
    font-family: Dummies;
    cursor: pointer;
}
form .error {
    color: #FF0000;
    font-size: 14px;
    font-family: 'Courier Prime', monospace;
}
form button:disabled {
    opacity: 0.6;
    cursor: default;
}
form button:hover {
    background-color: #222222;
}

.global{
    display: flex;
    justify-content: space-evenly;
    min-height: 100vh;
}
.div1,
.div2 {
    flex: 1;
    padding: clamp(24px, 5vw, 75px);
}
.div1 {
    background-color: #FFEE00;
}
.div1 p {
    color: black;
    font-family: Dummies;
}
.div1 img{
    width: 178px;
    height: 59px;
}

#welcome {
    margin-top: clamp(40px, 18vh, 200px);
    font-size: clamp(36px, 4.2vw, 60px);
    line-height: 1;
    font-family: 'Special Elite', monospace;
}

#to {
    font-size: clamp(24px, 2.6vw, 38px);
    line-height: 1;
}

#france {
    font-size: clamp(52px, 6.6vw, 96px);
    line-height: 1.2;
    font-family: 'Special Elite', monospace;
    text-transform: uppercase;
    letter-spacing: 6px;
}
#france .blue {
    color: #0055FF;
}
#france .red {
    color: #FF0000;
}

#intro {
    max-width: 433px;
    margin-top: 24px;
    font-size: clamp(15px, 1.25vw, 18px);
    line-height: 1.55;
    font-family: 'Courier Prime', monospace;
}

.legal {
    display: flex;
    gap: 12px;
    margin-top: clamp(32px, 17vh, 190px);
}
.legal a {
    color: black;
    font-size: 13px;
    font-family: 'Courier Prime', monospace;
    text-decoration: underline;
}

.div2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(24px, 5vw, 75px) clamp(24px, 8vw, 112px);
    background-color: #FFFFFF;
}

@media (max-width: 768px) {
    .global {
        flex-direction: column;
    }
    .div1 {
        flex: none;
    }
    .div2 {
        justify-content: flex-start;
    }
    #welcome {
        margin-top: 32px;
    }
    .legal {
        margin-top: 24px;
    }
}
</style>

