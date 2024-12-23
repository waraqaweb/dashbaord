<template classs="login-template">
  <div>
    <div class="text-center">
      <h3 class="f-color-3">Login</h3>
    </div>
    <form class="mt-5" @submit.prevent="login">
      <!-- Email -->
      <div class="mt-3">
        <!--/ Phone Number-->
        <input
          type="email"
          v-model="email"
          class="form-control"
          placeholder="Email"
          style="border-radius: 35px"
          required
        />
      </div>
      <!-- Password -->
      <div class="mt-3">
        <input
          type="password"
          v-model="password"
          style="border-radius: 35px"
          class="form-control"
          placeholder="Password"
          required
        />
      </div>

      <!-- Frogot Password -->
      <div class="mt-3">
        <span
          ><button
            class="forgetPass p-0"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#forgetPass"
          >
            Frogot Password ?
          </button></span
        >
        <ForgetPass />
      </div>
      <!-- Submit -->
      <div class="mt-4 text-end">
        <button
          :disabled="loadingBtn"
          type="submit"
          class="main-button-style f-color-0 border-0 py-2 px-3"
        >
          <div>
            <span
              v-if="loadingBtn"
              class="spinner-grow spinner-grow-sm mx-2"
              role="status"
              aria-hidden="true"
            ></span>
            <span v-else>Login</span>
          </div>
        </button>
      </div>
      <!-- Alerts -->
      <div class="mt-4">
        <div
          v-if="alerts.success"
          class="text-center alert text-center alert-success"
        >
          {{ alerts.success }}
        </div>
        <div
          v-else-if="alerts.error"
          class="text-center alert text-center alert-warning"
        >
          {{ alerts.error }}
        </div>
      </div>
    </form>
  </div>
</template>
<style>

.forgetPass {
  color: var(--color-3_3);
  border: none;
  background-color: initial;
}
.forgetPass:hover {
  color: var(--color-3);
  transition: 0.2s ease-in-out;
}
</style>
<script>
import axios from "axios";
import ForgetPass from "@/components/auth/login/ForgetPass";
export default {
  components: {
    ForgetPass,
  },
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      email: null,
      password: null,
    };
  },
  methods: {
    login() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let data = {
        email: this.email,
        password: this.password,
      };

      let url = "https://dashboard.waraqaweb.com/auth/v1/path1";
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          localStorage.setItem("waraqaToken", res.data.token);
          //Login > Auth > Index
          this.$parent.authorized(res.data.userType);

          // Empty inputs
          this.email = "";
          this.password = "";
          this.loadingBtn = false;
        })
        .catch(() => {
          this.loadingBtn = false;
          return (this.alerts.error = "Soory, failed login!");
        });
    },
  },
};
</script>
