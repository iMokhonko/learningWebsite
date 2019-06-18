<template>
  <div v-loading="loading">
    <h1 align="center">Registration</h1>

    <el-steps :active="active" finish-status="success" align-center style="margin: 50px 0px;">
      <el-step title="Step 1" description="Login"></el-step>
      <el-step title="Step 2" description="Email"></el-step>
      <el-step title="Step 3" description="Password"></el-step>
      <el-step title="Step 4" description="Image"></el-step>
      <el-step title="Step 2" description="Sex"></el-step>
      <el-step title="Step 3" description="Birthday"></el-step>
      <el-step title="Step 4" description="Confirmation"></el-step>
    </el-steps>

    <form @submit.prevent>
      <div v-if="active === 0">
        <div class="formContainer">
          <h2 align="center">Login</h2>
          <el-input
            type="text"
            prefix-icon="el-icon-user-solid"
            placeholder="Your login"
            v-model="user.login"
            maxlength="30"
            id="loginInput"
            :class="{'is-exceed': $v.user.login.$error}"
            @blur="$v.user.login.$touch()"
            show-word-limit
          />

          <div
            class="fieldInfo fieldIncorrect"
            v-if="$v.user.login.$error && !$v.user.login.required"
          >Login is required</div>
          <div
            class="fieldInfo fieldIncorrect"
            v-if="$v.user.login.$error && !$v.user.login.minLength"
          >Login must be at least 5 characters</div>
          <div
            class="fieldInfo fieldIncorrect"
            v-if="$v.user.login.$error && !$v.user.login.maxLength"
          >Login must not be bigger than 30 characters</div>

          <div class="fieldInfo" v-if="$v.user.login.$pending">Checking login...</div>
          <div
            class="fieldInfo fieldCorrect"
            v-if="!$v.user.login.$invalid && !$v.user.login.$pending"
          >Login free</div>

          <div class="stepButtonsBlock">
            <el-button-group>
              <el-button @click="nextStep" type="primary" :disabled="$v.user.login.$invalid">
                Next: email
                <i class="el-icon-arrow-right el-icon-right"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>

      <div v-if="active === 1">
        <div class="formContainer">
          <h2 align="center">Email</h2>
          <el-input
            type="text"
            placeholder="Your email"
            v-model="user.email"
            :class="{'is-exceed': $v.user.email.$error}"
            @input="$v.user.email.$touch()"
            maxlength="50"
            show-word-limit
          />

          <div
            class="fieldInfo fieldIncorrect"
            v-if="$v.user.email.$error && !$v.user.email.required"
          >Email is required</div>

          <div
            class="fieldInfo fieldIncorrect"
            v-if="$v.user.email.$error && !$v.user.email.email"
          >Invalid email</div>

          <div class="fieldInfo" v-if="$v.user.email.$pending">Checking email...</div>
          <div
            class="fieldInfo fieldCorrect"
            v-if="!$v.user.email.$invalid && !$v.user.email.$pending"
          >Email free</div>

          <div class="stepButtonsBlock">
            <el-button-group>
              <el-button @click="prevStep" type="primary" icon="el-icon-arrow-left">Previous: login</el-button>
              <el-button @click="nextStep" type="primary" :disabled="$v.user.email.$invalid">
                Next: password
                <i class="el-icon-arrow-right el-icon-right"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>

      <div v-if="active === 2">
        <div class="formContainer">
          <h2 align="center">Password</h2>
          <el-input
            type="password"
            placeholder="Your password"
            v-model="user.password"
            :class="{'is-exceed': $v.user.password.$error}"
            @input="$v.user.password.$touch()"
            maxlength="50"
            show-word-limit
          />

          <el-progress
            :stroke-width="20"
            style="margin-top:10px;"
            :text-inside="true"
            :percentage="percentage"
            :color="customColors"
          ></el-progress>

          <div
            class="fieldInfo fieldIncorrect"
            v-if="$v.user.password.$error && !$v.user.password.required"
          >Password is required</div>

          <div
            class="fieldInfo fieldIncorrect"
            v-if="$v.user.password.$error && !$v.user.password.minLength"
          >Password must be at least 6 symbols</div>

          <div
            class="fieldInfo weak"
            v-if="!$v.user.password.$invalid && percentage < 30"
          >Weak password</div>

          <div
            class="fieldInfo medium"
            v-if="!$v.user.password.$invalid && percentage >= 30 && percentage <= 70"
          >Medium password</div>

          <div
            class="fieldInfo strong"
            v-if="!$v.user.password.$invalid && percentage <= 100 && percentage > 70"
          >Strong password</div>

          <el-input
            style="margin-top: 45px;"
            type="password"
            v-model="user.confirmPassword"
            placeholder="Confirm password"
            @input="$v.user.confirmPassword.$touch()"
            maxlength="50"
            show-word-limit
          />

          <div
            class="fieldInfo fieldIncorrect"
            v-if="$v.user.confirmPassword.$error && !$v.user.confirmPassword.sameAs"
          >Passwords does not match</div>

          <div class="stepButtonsBlock">
            <el-button-group>
              <el-button @click="prevStep" type="primary" icon="el-icon-arrow-left">Previous: email</el-button>
              <el-button
                @click="nextStep"
                type="primary"
                :disabled="$v.user.confirmPassword.$invalid || $v.user.password.$invalid"
              >
                Next: your image
                <i class="el-icon-arrow-right el-icon-right"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>

      <div v-if="active === 3">
        <div class="formContainer">
          <h2 align="center">Your image</h2>

          <div style="text-align:center;margin: 30px 0px;" v-if="fileName.length > 0">
            <img style="max-width: 300px;" :src="user.image" alt>
            <el-progress
              :stroke-width="20"
              :text-inside="true"
              style="margin-top: 20px;"
              :percentage="imgUploading"
            ></el-progress>
          </div>

          <div style="text-align:center;">
            <el-button
              @click="uploadFile"
              style="margin-right: 20px;"
              type="primary"
              icon="el-icon-picture-outline"
              v-if="fileName.length == 0"
            >Upload</el-button>
            <el-button
              @click="deleteFile"
              v-if="fileName.length > 0"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
            {{ fileName.length > 0 ? fileName : " Upload your image"}}
          </div>

          <input
            id="uploadInput"
            accept="image/jpeg, image/png"
            @change="onFileChange"
            type="file"
            hidden
          >

          <div class="stepButtonsBlock">
            <el-button-group>
              <el-button
                @click="prevStep"
                type="primary"
                icon="el-icon-arrow-left"
              >Previous: password</el-button>
              <el-button @click="nextStep" type="primary" :disabled="imgUploading < 100">
                Next: sex
                <i class="el-icon-arrow-right el-icon-right"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>

      <div v-if="active === 4">
        <div class="formContainer">
          <h2 align="center">Sex</h2>

          <div style="text-align:center">
            <el-select
              v-model="user.sex"
              @blur="$v.user.sex.$touch()"
              :class="{'is-exceed': $v.user.sex.$error}"
              clearable
              placeholder="Select"
            >
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

            <div class="fieldInfo fieldIncorrect" v-if="$v.user.sex.$error">Sex is required</div>
          </div>

          <div class="stepButtonsBlock">
            <el-button-group>
              <el-button @click="prevStep" type="primary" icon="el-icon-arrow-left">Previous: image</el-button>
              <el-button @click="nextStep" type="primary" :disabled="$v.user.sex.$invalid">
                Next: birthday
                <i class="el-icon-arrow-right el-icon-right"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>

      <div v-if="active === 5">
        <div class="formContainer">
          <h2 align="center">Birthday</h2>

          <div style="text-align:center">
            <el-date-picker
              :class="{'is-exceed': $v.user.birthday.$error}"
              v-model="user.birthday"
              type="date"
              placeholder="Choose your birthday"
            ></el-date-picker>
          </div>

        
          <div class="stepButtonsBlock">
            <el-button-group>
              <el-button @click="prevStep" type="primary" icon="el-icon-arrow-left">Previous: sex</el-button>
              <el-button @click="nextStep" type="primary" :disabled="$v.user.birthday.$invalid">
                Next: confirmation
                <i class="el-icon-arrow-right el-icon-right"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>

      <div v-if="active === 6">
        <div class="formContainer">
          <h2 align="center">Confirmation</h2>
          Login: {{ user.login }}
          <br>
          Email: {{ user.email }}
          <br>
          Password: {{ user.password }}
          <br>
          Sex: {{ user.sex }}
          <br>
          Birthday: {{ user.birthday }}
          <br>
          <img :src="user.image" alt>
          <div class="stepButtonsBlock">
            <el-button-group>
              <el-button
                @click="prevStep"
                type="primary"
                icon="el-icon-arrow-left"
              >Previous: birthday</el-button>
              <el-button @click="registerUser" type="primary" icon="el-icon-check">Confirm</el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import * as fb from "firebase";

import {
  required,
  email,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";
import { setTimeout } from "timers";
import { Promise } from "q";

export default {
  name: "index",
  components: {},
  data() {
    return {
      active: 0,

      loading: false,

      user: {
        login: "",
        email: "",
        password: "",
        image: null,
        sex: "",
        birthday: null
      },
      sexOptions: [
        {
          value: "male",
          label: "Male"
        },
        {
          value: "female",
          label: "Female"
        }
      ],
      percentage: 0,
      customColors: [
        { color: "red", percentage: 30 },
        { color: "orange", percentage: 70 },
        { color: "green", percentage: 100 }
      ],
      fileName: "",
      imgUploading: 0
    };
  },
  methods: {
    nextStep() {
      this.active++;
    },
    prevStep() {
      if (this.active > 0) this.active--;
    },
    uploadFile(event) {
      let uploadInput = document.getElementById("uploadInput");
      uploadInput.click();
    },
    deleteFile() {
      this.loading = true;
      var deleteRef = fb
        .storage()
        .ref()
        .child(`user_images/${this.fileName}`);

      deleteRef
        .delete()
        .then(() => {
          console.log("deleted");
          this.fileName = "";
          this.loading = false;
        })
        .catch(error => {
          console.log("error");
        });
    },
    async onFileChange(event) {
      let file = event.target.files[0];
      this.fileName = file.name;

      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async e => {
        this.user.image = reader.result;

        const imageExt = file.name.slice(file.name.lastIndexOf("."));
        console.log(imageExt);

        const fileData = fb
          .storage()
          .ref("user_images/" + file.name)
          .put(file);

        fileData.on(
          "state_changed",
          snapshot => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.imgUploading = parseInt(progress);
          },
          () => {},
          async () => {
            fileData.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.user.image = downloadURL;
            });
          }
        );
      };
    },
    registerUser() {
      this.$store.dispatch('userState/registerUser', this.user);
    }
  },
  validations: {
    user: {
      login: {
        required,
        maxLength: maxLength(30),
        minLength: minLength(5),
        uniqueCheck: function(value) {
          if (this.user.login.length < 5) return true;

          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true);
            }, 1000);
          });
        }
      },
      email: {
        required,
        email,
        uniqueCheck: function(value) {
          if (!this.$v.user.email.email || !this.$v.user.email.required)
            return true;

          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true);
            }, 1000);
          });
        }
      },
      password: {
        required,
        minLength: minLength(6),
        formatCheck: function(value) {
          var password = value; // Получаем пароль из формы
          var s_letters = "qwertyuiopasdfghjklzxcvbnm"; // Буквы в нижнем регистре
          var b_letters = "QWERTYUIOPLKJHGFDSAZXCVBNM"; // Буквы в верхнем регистре
          var digits = "0123456789"; // Цифры
          var specials = "!@#$%^&*()_-+=|/.,:;[]{}"; // Спецсимволы
          var is_s = false; // Есть ли в пароле буквы в нижнем регистре
          var is_b = false; // Есть ли в пароле буквы в верхнем регистре
          var is_d = false; // Есть ли в пароле цифры
          var is_sp = false; // Есть ли в пароле спецсимволы
          for (var i = 0; i < password.length; i++) {
            /* Проверяем каждый символ пароля на принадлежность к тому или иному типу */
            if (!is_s && s_letters.indexOf(password[i]) != -1) is_s = true;
            else if (!is_b && b_letters.indexOf(password[i]) != -1) is_b = true;
            else if (!is_d && digits.indexOf(password[i]) != -1) is_d = true;
            else if (!is_sp && specials.indexOf(password[i]) != -1)
              is_sp = true;
          }
          var rating = 0;
          var text = "";
          if (is_s) rating++; // Если в пароле есть символы в нижнем регистре, то увеличиваем рейтинг сложности
          if (is_b) rating++; // Если в пароле есть символы в верхнем регистре, то увеличиваем рейтинг сложности
          if (is_d) rating++; // Если в пароле есть цифры, то увеличиваем рейтинг сложности
          if (is_sp) rating++; // Если в пароле есть спецсимволы, то увеличиваем рейтинг сложности
          /* Далее идёт анализ длины пароля и полученного рейтинга, и на основании этого готовится текстовое описание сложности пароля */
          if (password.length < 6 && rating < 3) this.percentage = 15;
          else if (password.length < 6 && rating >= 3) this.percentage = 30;
          else if (password.length >= 8 && rating < 3)
            text = this.percentage = 45;
          else if (password.length >= 8 && rating >= 3) this.percentage = 75;
          else if (password.length >= 6 && rating == 1) this.percentage = 10;
          else if (password.length >= 6 && rating > 1 && rating < 4)
            this.percentage = 60;
          else if (password.length >= 6 && rating == 4) this.percentage = 100;

          if (password.length === 0) this.percentage = 0;

          return true;
        }
      },
      confirmPassword: {
        sameAs: sameAs("password")
      },
      image: {},
      sex: {
        required
      },
      birthday: {
        required
      }
    }
  }
};
</script>

<style>
.formContainer {
  width: 400px;
  position: relative;
  left: 50%;
  margin-left: -200px;
}

.stepButtonsBlock {
  margin-top: 35px;
  position: relative;
  text-align: center;
}

.fieldInfo {
  font-style: italic;
  font-size: 12px;
  margin-top: 10px;
  position: absolute;
}

.fieldIncorrect {
  color: red;
}

.fieldCorrect {
  color: green;
}

.weak {
  color: red;
}

.medium {
  color: orange;
}

.strong {
  color: green;
}
</style>

