<template>
  <div>
    <div class="text-center">
      <h3 class="f-color-3">Sign up</h3>
    </div>
    <form class="mt-5" @submit.prevent="register">
      <!-- User Type -->
      <div class="mt-3">
        <label class="f-color-3 mb-1">Sign up as a</label>
        <div
          style="
            display: flex;
            justify-content: center;
            margin-left: 1rem;
            margin-right: 1rem;
          "
        >
          <button
            type="button"
            :class="[
              userType == 'Teacher' ? 'clicked' : 'btn-secondary',
              'form-control',
              'btn',
              'f-color-0',
              'border-0',
              'py-2',
              'px-3',
              'typeBut',
              'me-5',
            ]"
            v-on:click="changeUserType('Teacher')"
          >
            Teacher
          </button>
          <button
            type="button"
            v-on:click="changeUserType('Guardian')"
            :class="[
              userType == 'Guardian' ? 'clicked' : 'btn-secondary',
              'form-control',
              'btn',
              'with-100p',
              'f-color-0',
              'border-0',
              'py-2',
              'px-3',
              'typeBut',
            ]"
          >
            Guardian
          </button>
        </div>
      </div>
      <div v-if="userType" class="row flex-wrap">
        <!-- firstName -->
        <div class="col-12 col-md-6 mt-3">
          <input
            type="text"
            class="form-control"
            v-model="firstName"
            placeholder="First Name"
            required
            style="border-radius: 35px"
          />
        </div>
        <!-- lastName -->
        <div class="col-12 col-md-6 mt-3">
          <input
            style="border-radius: 35px"
            type="text"
            class="form-control"
            v-model="lastName"
            placeholder="Last Name"
            required
          />
        </div>
      </div>
      <!-- Email -->
      <div v-if="userType" class="mt-3 row flex-wrap">
        <div class="col-12 col-md-6">
          <input
            type="email"
            class="form-control"
            v-model="email"
            placeholder="Email"
            required
            style="border-radius: 35px"
          />
        </div>
        <!-- Password -->

        <div class="col-12 col-md-6">
          <input
            type="password"
            class="form-control"
            v-model="password"
            style="border-radius: 35px"
            placeholder="Passowrd"
            required
            pattern=".{8,}"
            title="Password can't be less then 8 characters"
          />
        </div>
      </div>
      <!-- Phone Number -->
      <div v-if="userType" class="mt-3 row flex-wrap">
        <div class="col-12 col-md-6">
          <input
            type="tel"
            style="border-radius: 35px"
            class="form-control"
            v-model="phone"
            placeholder="Phone Number"
            required
          />
        </div>

        <div class="col-12 col-md-6">
          <input
            type="text"
            style="border-radius: 35px"
            class="form-control"
            v-model="address"
            placeholder="City, State and Country"
            required
          />
        </div>
      </div>
      <!-- Address -->
      <div v-if="userType" class="mt-3"></div>
      <!-- TimeZone -->
      <!-- <div class="mt-3">
                <label class="f-color-3 mb-1">TimeZone</label>
                <select class="form-select" v-model="timeZone" required>
                    <option value="">Select TimeZone</option>
                    <option v-for="timeZone in TimeZoneList" :key="timeZone.id" >{{timeZone}}</option>
                </select>
            </div> -->
      <!-- Contract -->
      <div v-if="userType == 'Teacher'" class="mt-3 align-items-center">
        <input type="checkbox" v-model="contractAgree" required />
        <small class="mx-2"
          >I agree to this <button            type="button"
            data-bs-toggle="modal"
            data-bs-target="#contractModal"
            class="p-0"
            style="color: #0075ff; border: none; background-color: initial"
          >
            Contract.
          </button></small
        >
        <Contract :name="firstName + ' ' + lastName" />
      </div>
      <!-- Payments Policy -->
      <div v-if="userType == 'Guardian'" class="mt-3 align-items-center">
        <input type="checkbox" v-model="paymentsPolicy" required />
        <small class="mx-2"
          >I agree to this
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#PaymentsPolicyModal"
            class="p-0"
            style="color: #0075ff; border: none; background-color: initial"
          >
            Payment and cancellation policy.
          </button></small
        >
        <PaymentsPolicy />
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
            <span v-else>Sign up</span>
          </div>
        </button>
        <!-- <input type="submit" class="main-button-style f-color-0 border-0 py-2 px-3 rounded" value="Register"> -->
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
<script>
import moment from "moment-timezone";
import axios from "axios";
import Tz from "@/components/Tz.json";
import Contract from "@/components/auth/register/Contract";
import PaymentsPolicy from "@/components/auth/register/PaymentsPolicy";
export default {
  components: {
    Contract,
    PaymentsPolicy,
  },
  data() {
    return {
      TimeZoneList: Tz,

      alerts: {
        success:
          "Great, You've completed the registration process successfully.",
        error: "",
      },
      loadingBtn: false,

      userType: "",
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      phone: null,
      address: null,
      timeZone: moment.tz.guess(),

      contractAgree: false,
      paymentsPolicy: false,
    };
  },
  created() {
    this.alerts.success = "";
    this.alerts.error = "";
  },
  methods: {
    register() {
      this.alerts.success = "";
      this.alerts.error = "";
      this.loadingBtn = true;
      //Collect data
      let data = {
        userType: this.userType, // Will not stored.
        name: this.firstName + " " + this.lastName,
        email: this.email,
        password: this.password,
        phone: this.phone,
        address: this.address,
        timeZone: this.timeZone,
      };
      // Send Data
      let postUrl = "https://dashboard.waraqaweb.com/auth/v1/path0";
      axios
        .post(postUrl, data)
        .then((res) => {
          if (res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.success =
              "Great, you've completed the registration process successfully.");
          }
          this.alerts.error = res.data.msg;
          this.loadingBtn = false;
        })
        .catch(() => {
          this.loadingBtn = false;
          return (this.alerts.error = "Sorry, failed to register!");
        });
    },
    changeUserType(type) {
      this.userType = type;
    },
  },
};
</script>
<style scoped>
.typeBut {
  border-bottom-right-radius: 50px;
  border-top-left-radius: 50px;
  height: 75px;
  width: 150px;
  padding: 2px;
}
.clicked {
  background-color: #2c736c;
}
.mt-3 {
  border: none;
  background-color: transparent;
  padding: 0;
  margin-bottom: 1rem;
}
input[type="checkbox"] {
  margin-right: 0.5rem; /* Space between checkbox and label */
  max-width: 40%;
}
.btn-secondary {
  background-color: #ffffff; /* Clean white background */
  color: #333333 !important; /* Dark gray text for better readability */
  border: 1px solid #cccccc; /* Subtle border for definition */
  border-radius: 8px; /* Slightly rounded corners */
  padding: 0.5rem 1rem; /* Balanced padding for button size */
  font-size: 1rem; /* Readable font size */
  font-weight: 500; /* Slightly bold for emphasis */
  box-shadow: 2px 5px 7px rgba(127, 153, 150, 0.4); /* Softer, transparent shadow */
  transition: all 0.3s ease; /* Smooth hover effect */
}

.btn-secondary:hover {
  background-color: #f5f5f5; /* Light gray background on hover */
  color: black !important; /* Highlight text with primary color */
  box-shadow: 4px 4px 10px rgba(127, 153, 150, 0.6); /* Enhanced shadow for hover */
  border-color: black; /* Accent border on hover */
}


</style>
