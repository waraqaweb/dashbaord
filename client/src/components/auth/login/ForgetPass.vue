<template>
  <div
    class="modal fade"
    id="forgetPass"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-start px-3 px-md-5 pt-5 pb-3">
        <!-- Header -->
        <div class="text-center">
          <h3 class="f-color-3 mb-3">Reset Password</h3>
        </div>
        <!-- Enter Email -->
        <div v-if="view == 0">
          <div class="text-center">
            <p class="px-md-4 f-color-3_3">
              Enter your email to send a verification code.
            </p>
          </div>
          <form class="mt-3" @submit.prevent="sendCode">
            <!-- Email -->
            <div class="mt-3">
              <input
                type="email"
                v-model="email"
                class="form-control"
                placeholder="Email"
                required
              />
            </div>
            <!-- Submit -->
            <div class="mt-4 text-end">
              <div class="d-flex justify-content-end">
                <button
                  type="button"
                  class="soft-button-style mx-3 py-2 px-3 rounded"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  :disabled="loadingBtn"
                  type="submit"
                  class="main-button-style f-color-0 border-0 py-2 px-3 rounded"
                >
                  <div>
                    <span
                      v-if="loadingBtn"
                      class="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span v-else>Send</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
        <!-- Enter Code -->
        <div v-else-if="view == 1">
          <div class="text-center">
            <p class="px-md-4 f-color-3_3">
              Please pass the code that we sent to your Email <br /><span
                class="f-color-1"
                >{{ email }}</span
              >
            </p>
          </div>

          <form class="mt-3" @submit.prevent="checkCode">
            <!-- Code -->
            <div class="mt-3">
              <label class="f-color-3 mb-1">Code Number</label>
              <input
                type="number"
                v-model="code"
                class="form-control"
                placeholder="Enter Code"
                required
              />
            </div>
            <!-- Submit -->
            <div class="mt-4 text-end">
              <div class="d-flex justify-content-end">
                <button
                  type="button"
                  class="soft-button-style mx-3 py-2 px-3 rounded"
                  @click="view--"
                >
                  Back
                </button>
                <button
                  :disabled="loadingBtn"
                  type="submit"
                  class="main-button-style f-color-0 border-0 py-2 px-3 rounded"
                >
                  <div>
                    <span
                      v-if="loadingBtn"
                      class="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span v-else>Next</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
        <!-- Change Password -->
        <div v-else-if="view == 2">
          <div class="text-center">
            <p class="px-md-4 f-color-3_3">
              Great, now you can change the password of your account.
            </p>
          </div>
          <form class="mt-3" @submit.prevent="changePass">
            <!-- New Password -->
            <div class="mt-3">
              <label class="f-color-3 mb-1">New Password</label>
              <input
                type="password"
                v-model="newPass"
                class="form-control"
                placeholder="Enter your new password"
                required
              />
            </div>
            <!-- Re-type new Password -->
            <div class="mt-3">
              <label class="f-color-3 mb-1">Re-type new Password</label>
              <input
                type="password"
                v-model="confirmPass"
                class="form-control"
                placeholder="Re-type new Password"
                required
              />
            </div>
            <!-- Submit -->
            <div class="mt-4 text-end">
              <div class="d-flex justify-content-end">
                <button
                  type="button"
                  class="soft-button-style mx-3 py-2 px-3 rounded"
                  @click="view--"
                >
                  Back
                </button>
                <button
                  :disabled="loadingBtn"
                  type="submit"
                  class="main-button-style f-color-0 border-0 py-2 px-3 rounded"
                >
                  <div>
                    <span
                      v-if="loadingBtn"
                      class="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span v-else>Save</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
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
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: ["userType"],

  data() {
    return {
      alerts: {
        success: null,
        error: null,
      },
      loadingBtn: false,
      view: 0,
      email: null,
      code: null,
      newPass: null,
      confirmPass: null,
    };
  },
  methods: {
    sendCode() {
      this.loadingBtn = true;
      this.alerts.error = "";
      this.alerts.success = "";
      let url = "https://dashboard.waraqaweb.com/auth/v1/path3";
      axios
        .post(url, {
          email: this.email,
          isAdmin: this.userType == "admin",
        })
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.loadingBtn = false;
          this.view++;
        })
        .catch(() => {
          this.loadingBtn = false;
          return (this.alerts.error = "Sorry, failed to send!");
        });
    },
    checkCode() {
      this.loadingBtn = true;
      this.alerts.error = "";
      this.alerts.success = "";
      let url = "https://dashboard.waraqaweb.com/auth/v1/path4";
      axios
        .post(url, {
          email: this.email,
          code: this.code,
          isAdmin: this.userType == "admin",
        })
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.loadingBtn = false;
          this.view++;
        })
        .catch(() => {
          this.loadingBtn = false;
          return (this.alerts.error = "Sorry, failed to check!");
        });
    },
    changePass() {
      this.loadingBtn = true;
      this.alerts.error = "";
      this.alerts.success = "";
      if (this.newPass != this.confirmPass) {
        this.loadingBtn = false;
        return (this.alerts.error =
          "The Password and Re-type Password dosen't match.");
      }
      let url = "https://dashboard.waraqaweb.com/auth/v1/path5";
      axios
        .post(url, {
          email: this.email,
          password: this.newPass,
          isAdmin: this.userType == "admin",
        })
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.loadingBtn = false;
          this.alerts.success = res.data.msg;
        })
        .catch(() => {
          this.loadingBtn = false;
          return (this.alerts.error = "Sorry, failed to save!");
        });
    },
  },
};
</script>
