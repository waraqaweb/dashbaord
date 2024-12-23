<template>
  <div class="container my-5 user-login">
      <div class="d-flex flex-wrap">
      <!-- SideBar Info -->
      <div
        class="col-12 col-md-4 d-flex justify-content-between flex-column b-color-1 z-index-1 f-color-2 px-4 py-5"
        style="min-height: 25em; border-radius: 35px 0px 0px 35px"
      >
        <header class="text-center">
          <img
            src="@/assets/logo.jpg"
            alt="waraqa logo"
            classs="img-fluid"
            style="width: 170px"
          />
        </header>
        <article class="text-center f-color-0">
          <h4>Log In</h4>
        </article>
        <footer class="text-center media">
          <!-- Social Media -->
          <a class="px-3" href="#"><i class="px-2 fab fa-facebook-f"></i></a>
          <a class="px-3" href="#"><i class="fab fa-twitter"></i></a>
          <a class="px-3" href="#"><i class="fab fa-linkedin-in"></i></a>
          <a class="px-3" href="#"><i class="pr-1 fab fa-instagram"></i></a>
        </footer>
      </div>
      <!-- Form -->
      <div
        style="border-radius: 0px 35px 35px 0px"
        class="col-12 col-md-8 mt-4 mt-md-0 b-color-0 d-flex justify-content-center py-5  box-shadow-style"
      >
        <div class="col-11 col-md-10">
          <!-- Login -->
          <div class="text-center">
            <h3 class="f-color-3">Log In</h3>
          </div>
          <form class="mt-5" @submit.prevent="login">
            <!-- Email -->
            <div class="mt-3">
              <label class="f-color-3 mb-1">Email</label>
              <!--/ Phone Number-->
              <input
                type="email"
                v-model="email"
                class="form-control"
                placeholder="Enter your Email"
                style="border-radius: 35px"
                required
              />
            </div>
            <!-- Password -->
            <div class="mt-3">
              <label class="f-color-3 mb-1">Passowrd</label>
              <input
                type="password"
                style="border-radius: 35px"
                v-model="password"
                class="form-control"
                placeholder="Enter your Passowrd"
                required
              />
            </div>
            <!-- Forgot Password -->
            <div class="mt-3">
              <span
                ><button
                  class="forgetPass p-0"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#forgetPass"
                >
                  Forget Password ?
                </button></span
              >
              <ForgetPass userType="admin" />
            </div>
            <!-- Submit -->
            <div class="mt-4 text-end">
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
                  <span v-else>Log In</span>
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
      </div>
    </div>
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

      let url = "https://dashboard.waraqaweb.com/auth/v1/path10";
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          localStorage.setItem("waraqaPanelToken", res.data.token);
          //Login  > Index
          this.$parent.setAuthorized();

          // Empty inputs
          // this.email = "";
          // this.password = ""
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

body {
  justify-content: center; /* Center body */
  font-size: 1rem; /* Font size */
}
button {
  cursor: pointer; /* Pointer cursor */
  width: 100%; /* Full width */
  border-radius: 35px !important; /* Rounded */
}
.user-login .d-flex.flex-wrap  {
  display: flex; /* Flex container */
  flex-wrap: wrap; /* Wrap items */
  justify-content: center; /* Center items */
}
.col-md-6{
    margin: 2px 0!important;
    padding: 2px;
}
.container {
  max-width: 100%; /* Full width */
  padding: .5rem; /* Padding */
}
img {
  max-width: 100%; /* Responsive image */
  height: auto; /* Maintain aspect */
}
.col-12.col-md-4 {
  border-radius: 35px 0 0 35px; /* Rounded corners */
  flex: 0 0 35%; /* Sidebar width */
}
.col-12.col-md-8 {
  border-radius: 0 35px 35px 0; /* Rounded corners */
  flex: 0 0 65%; /* Form width */
}
.p {
  text-wrap: nowrap;
}

@media (max-width: 1200px) {
  body {
    justify-content: center;
    margin-top: 0;
    font-size: 1rem;
  }
  .col-md-4, .col-md-8 {
    border-radius: 35px 35px 0 0 !important;
    width: 67%;
  }
  .col-md-8 {
    border-radius: 0 0 35px 35px !important;
  }
  .col-md-8 .row {
    width: 100%;
    margin: 0 5px !important;
    padding-top: 5px;
  }
  .user-login .d-flex.flex-wrap {
    flex-direction: column; /* Stack items */
  }
  h3, h4 {
    font-size: 1.5rem; /* Smaller headings */
  }
}

@media (max-width: 768px) {
  body .user-login .d-flex.flex-wrap {
    justify-content: center;
    margin: 0;
    font-size: 1rem;
    padding: 0;
    width: 100%;
  }
  .col-md-4, .col-md-8 {
    border-radius: 35px 35px 0 0 !important;
    width: 67%;
  }
  .col-md-8 {
    border-radius: 0 0 35px 35px !important;
  }
  .col-md-8 .row {
    width: 100%;
    margin: 0 5px !important;
    padding-top: 5px;
  }
  .user-login .d-flex.flex-wrap {
    flex-direction: column; /* Stack items */
  }
  h3, h4 {
    font-size: 1.5rem; /* Smaller headings */
  }
}

@media (max-width: 480px) {
  body .user-login .d-flex.flex-wrap {
    justify-content: center;
    margin: 0;
    font-size: 1rem;
    padding: 0;
    width: 100%;
  }
  .col-md-4 {
    border-radius: 35px 35px 0 0 !important;
    width: 100%;
  }
  .col-md-8 {
    border-radius: 0 0 35px 35px !important;
    width: 100%;
  }
  h3, h4 {
    font-size: 1.2rem; /* Extra small headings */
  }
}

/* For grouped items like first name and last name */
@media (min-width: 768px) {
  .grouped-items {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .grouped-items .form-group {
    flex: 1;
  }
}

input {
  width: 100%; /* Full width */
  padding: 0.75rem; /* Padding */
  border: none; /* Remove border */
  border-radius: 5px; /* Rounded corners */
  background-color: #f9f9f9; /* Subtle background color */
  transition: all 0.3s ease; /* Smooth transition */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow by default */
}

input:hover,
input:focus {
  background-color: #ffffff; /* Slightly brighter on hover/focus */
  box-shadow: 0 0 8px rgba(0, 128, 255, 0.5); /* Blue shadow on focus/hover */
  outline: none; /* Remove default focus outline */
}
</style>