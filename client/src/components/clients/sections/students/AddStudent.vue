<template>
  <div
    class="modal fade"
    id="addStudentModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog custom-with-modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Edit Student's information</h5>
          <button
            type="button"
            class="f-color-0 border-0 background-none"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="fas fa-times"></i>
          </button>
        </header>
        <div class="px-3 px-md-5 py-5">
          <!-- Form Info-->
          <form
            class="mt-4"
            @submit.prevent="addData"
            enctype="multipart/form-data"
          >
            <!-- Personal Information -->
            <div class="mt-5">
              <span class="d-block f-color-2">Personal Information :</span>
              <!-- First Name & Last Name -->
              <div class="row flex-wrap">
                <!-- First Name -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your First Name"
                    v-model="firstName"
                    required
                  />
                </div>
                <!-- Last Name -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Last Name"
                    v-model="lastName"
                    required
                  />
                </div>
              </div>
              <!-- Birthday & Address -->
              <div class="row flex-wrap">
                <!-- Birthday -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Birthday</label>
                  <input type="date" class="form-control" v-model="birthday" />
                </div>
                <!-- Address -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Address</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your Address"
                    v-model="address"
                  />
                </div>
              </div>
              <!-- Language & Email -->
              <div class="row flex-wrap">
                <!-- Language -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Language</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your Language"
                    v-model="language"
                  />
                </div>
                <!-- Email -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Email</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Email"
                    v-model="email"
                    required
                  />
                </div>
              </div>
              <!-- TimeZone & Phone -->
              <div class="row flex-wrap">
                <!-- TimeZone -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">TimeZone</label>

                  <v-select
                    placeholder="Select TimeZone"
                    :options="TimeZoneList"
                    v-model="timeZone"
                  />
                  <!-- <select class="form-select" v-model="timeZone">
                    <option value="">Select TimeZone</option>
                    <option v-for="timeZone in TimeZoneList" :key="timeZone.id">
                      {{ timeZone }}
                    </option>
                  </select> -->
                </div>
                <!-- Phone -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Phone</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your Phone"
                    v-model="phone"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Submit -->
            <div class="mt-4 d-flex justify-content-end align-items-center">
              <small class="f-color-3_3 me-3"
                >Would you like to Add to your students?</small
              >
              <button
                :disabled="loadingBtn"
                type="submit"
                class="main-button-style with-100px f-color-0 border-0 py-2 px-3 rounded"
              >
                <div>
                  <span
                    v-if="loadingBtn"
                    class="spinner-grow spinner-grow-sm mx-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span v-else>Add</span>
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
<script>
import axios from "axios";
import Tz from "@/components/Tz.json";
import moment from "moment";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    vSelect,
  },
  data() {
    return {
      loadingBtn: false,
      passloadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      userID: null,
      TimeZoneList: Tz,

      firstName: "",
      lastName: "",

      birthday: "",
      address: "",
      email: "",
      language: "",
      timeZone: null,
      phone: "",
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    addData() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let data = {
        birthday: moment(this.birthday).format("YYYY-MM-DD"),
        address: this.address,
        email: this.email,
        language: this.language,
        timeZone: this.timeZone,
        phone: this.phone,
      };
      let name = this.firstName + " " + this.lastName;
      data.name = name;

      let url = `https://dashboard.waraqaweb.com/api/v1/guardian/students/path0`;
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.loadingBtn = false;
          this.$parent.getData();
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
  },
};
</script>
