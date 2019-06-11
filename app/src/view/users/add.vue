<template>
  <div style="width: 500px;">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="Email"></el-step>
      <el-step title="Password"></el-step>
      <el-step title="Sending"></el-step>
    </el-steps>

    <hr>

    <div style="display:block">
      <form>
        <div v-if="active === 0">
          <input
            v-model="email"
            style="outline:none"
            :class="{'invalid-input': $v.email.$invalid}"
            @blur="$v.email.$touch()"
            type="text"
          >
          <br>
          <div v-if="!$v.email.required">This field is required</div>
          <div v-if="!$v.email.email">Incorrect email</div>
          <div v-if="emailChecking">Checking email</div>
          <div
            v-if="!$v.email.uniqEmail && !$v.email.$pending"
          >User with such email is already exist</div>

          <el-button
            style="margin-top: 12px;"
            :disabled="$v.email.$invalid"
            @click="next"
          >Next: password</el-button>
        </div>

        <div v-if="active === 1">
          <input
            v-model="password"
            style="outline:none"
            id="password"
            name="password"
            :class="{'invalid-input': $v.password.$invalid}"
            type="text"
          >
          <div v-if="!$v.password.required">This field is required</div>
          <div v-if="!$v.password.minLength">Not less than 6 symbols</div>

          <hr>

          <input
            v-model="confirmPassword"
            style="outline:none"
            id="confirmPassword"
            name="confirmPassword"
            :class="{'invalid-input': $v.confirmPassword.$invalid}"
            type="text"
          >
          <div v-if="!$v.confirmPassword.sameAs">Password is must match</div>

          <el-button style="margin-top: 12px;" @click="prev">Previous: email</el-button>
          <el-button
            style="margin-top: 12px;"
            :disabled="$v.confirmPassword.$invalid || $v.password.$invalid"
            @click="next"
          >Next: confirmation</el-button>
        </div>

        <div v-if="active === 2">
          Your email: {{ this.email }}
          Your password: {{ this.password }}
          <hr>
          <el-button style="margin-top: 12px;" @click="prev">Previous: password</el-button>
          <el-button style="margin-top: 12px;" :loading="formSending" @click="submitForm">Send</el-button>
        </div>
      </form>

      <div v-if="active === 3">User added, now you will be redirected to the list of users</div>
    </div>

    <!-- <pre>
      {{ $v }}
    </pre>-->
  </div>
</template>

<script>
import createdMixin from "../../components/mixins/createdMixin";

import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import { setTimeout } from 'timers';

export default {
  name: "index",
  components: {},
  data: () => {
    return {
      active: 0,

      email: "",
      password: "",
      confirmPassword: "",
      emailChecking: false,

      formSending: false
    };
  },
  methods: {
    next() {
      this.active++;
    },
    prev() {
      if (this.active > 0) this.active--;
    },
    submitForm() {
      this.formSending = true;

      let newUser = {
        email: this.email,
        password: this.password
      };

      this.$http
        .post("http://localhost:3000/users", newUser)
        .then(resp => resp.json())
        .then(createdUser => {
          this.formSending = false;
          this.next();
          this.$message({
            message: "Congrats, this is a success message.",
            type: "success"
          });
          setTimeout(() => {
            this.$router.push("/users");
          }, 2000);
        });
    }
  },
  validations: {
    email: {
      required,
      email,
      uniqEmail: function(enteredEmail) {
        if (this.email === "" || !this.$v.email.email) return true;

        return new Promise((resolve, reject) => {
          this.emailChecking = true;
          setTimeout(() => {
            this.emailChecking = false;
            let checkResult = enteredEmail != "kek@gmail.com";
            resolve(checkResult);
          }, 2000);
        });
      }
    },
    password: {
      required,
      minLength: minLength(6)
    },
    confirmPassword: {
      sameAs: sameAs("password")
    }
  },
  directives: {
    colored: {
      bind: (el, bindings, vnode) => {
        el.style.color = "red";
      }
    }
  },
  mixins: [createdMixin],
  watch: {
    counter: value => {
      console.log(dataObject);
      console.log("counter was changed: " + value);
    }
  }
};
</script>

<style>
.invalid-input {
  border: 1px solid red;
}
</style>

