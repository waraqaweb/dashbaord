<template>
  <div
    v-if="displayData"
    class="modal fade"
    id="editStudentModal"
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
            @submit.prevent="updateUserData"
            enctype="multipart/form-data"
          >
            <!-- Picture -->
            <div class="picture col-12">
              <div class="header">
                <span class="d-block f-color-2">Profile picture</span>
              </div>
              <div
                class="mt-3 position-relative"
                style="width: 90px; height: 100px"
              >
                <!-- <div class="avatar-btn" @click="openUpload"> -->
                <div
                  class="avatar-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#ChoosePicModal"
                >
                  <i class="fas fa-camera"></i>
                </div>
                <img
                  v-if="temporalPic"
                  :src="temporalPic"
                  class="avatar-img rounded-circle"
                  alt="Student picture"
                />
                <span v-else class="avatar">
                  <div style="font-size: 3rem">
                    {{ data[0].name.charAt(0).toUpperCase() }}
                  </div>
                </span>
                <!-- <input type="file" ref="avatar" @change="selectFile" hidden /> -->
              </div>
            </div>
            <!-- Personal Information -->
            <div class="mt-5">
              <span class="d-block f-color-2">Personal Information:</span>
              <div class="row flex-wrap">
                <!-- First Name -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="First Name"
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
                    placeholder="Last Name"
                    v-model="lastName"
                    required
                  />
                </div>

                <!-- Birthday -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Birthday</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="data[0].birthday"
                  />
                </div>
              </div>
              <div class="row flex-wrap">
                <!-- Address -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Address</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Address"
                    v-model="data[0].address"
                  />
                </div>
                <!-- Language -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Languages</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Languages"
                    v-model="data[0].language"
                  />
                </div>
                <!-- Email -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Email</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Email"
                    v-model="data[0].email"
                    required
                  />
                </div>
              </div>
              <!-- TimeZone & Phone -->
              <div class="row flex-wrap">
                <!-- Phone -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Phone</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Phone"
                    v-model="data[0].phone"
                  />
                </div>

                <!-- TimeZone -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Time Zone</label>

                  <v-select
                    placeholder="Time Zone"
                    :options="TimeZoneList"
                    v-model="data[0].timeZone"
                  />
                </div>
                <div class="col-12 col-md mt-3"></div>
              </div>
            </div>
            <!-- General Information  -->
            <div class="mt-5">
              <!-- Status &  Initial assessment -->
              <div class="row flex-wrap">
                <!-- Status -->
                <div class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Status</label>
                  <select class="form-select" v-model="data[0].status" required>
                    <option value="">Select status</option>
                    <option value="1">Active</option>
                    <option value="2">Inactive</option>
                    <option value="3">Vacation</option>
                  </select>
                </div>
                <!-- Initial assessment -->
                <div class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Initial assessment</label>
                  <textarea
                    type="text"
                    class="form-control"
                    placeholder="Initial assessment"
                    v-model="data[0].initialAssessment"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="col-md-2 mt-3">
              <label class="f-color-3 mb-1">Done Hours</label>
              <input
                type="text"
                class="form-control"
                placeholder="Initial assessment"
                v-model="data[0].attendedHours"
              />
            </div>

            <!-- Submit -->
            <div class="mt-4 d-flex justify-content-end align-items-center">
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
                  <span v-else>Update</span>
                </div>
              </button>
            </div>
            <!-- Alerts -->
            <div
              v-if="alerts.success"
              class="text-center alert text-center alert-success mt-4"
            >
              {{ alerts.success }}
            </div>
            <div
              v-else-if="alerts.error"
              class="text-center alert text-center alert-warning mt-4"
            >
              {{ alerts.error }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <ChoosePic name="#editStudentModal" v-on:changeImage="updateImage($event)" />
</template>
<script>
import axios from "axios";
import Tz from "@/components/Tz.json";
import moment from "moment";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ChoosePic from "@/components/clients/sections/guardians/ChoosePic";

export default {
  components: {
    ChoosePic,
    vSelect,
  },
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      passloadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      userID: null,
      TimeZoneList: Tz,

      data: [],
      avatar: null,
      temporalPic: null,
      firstName: "",
      lastName: "",
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    getUserData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/students/path2/${this.userID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.data = [];
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.data[0].attendedHours /= 60;
          this.temporalPic = this.data[0].picture;
          this.firstName = this.data[0].name.split(" ")[0];
          this.lastName = this.data[0].name.split(" ")[1];
          this.data[0].birthday = moment(this.data[0].birthday).format(
            "YYYY-MM-DD"
          );

          this.displayData = true;
        })
        .catch(() => {
          console.log("Student Info/Error catched");
        });
    },
    updateImage(data) {
      this.temporalPic = data.src;
      this.avatar = data.file;
    },
    // openUpload() {
    //   this.$refs.avatar.click();
    // },
    // selectFile(event) {
    //   this.avatar = event.target.files[0];

    //   // Update Preview Start
    //   let files = event.target.files;
    //   if (!files.length) {
    //     console.log("file input is empty");
    //     return;
    //   }
    //   let reader = new FileReader();
    //   reader.onload = (event) => {
    //     this.temporalPic = event.target.result;
    //   };
    //   reader.readAsDataURL(files[0]);
    //   // Update Preview End
    // },
    updateUserData() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let data = this.data;
      data[0].attendedHours *= 60;

      delete data[0].picture;
      delete data[0].guardianName;
      delete data[0].paymentType;

      let name = this.firstName + " " + this.lastName;
      data[0].name = name;

      // Upload Image
      const formData = new FormData();
      formData.append("image", this.avatar);
      Object.entries(data[0]).forEach(([key, value]) =>
        formData.append(key, value)
      );

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/students/path3/${this.userID}`;
      axios
        .post(url, formData)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.data[0].attendedHours /= 60;
          this.alerts.success = res.data.msg;
          this.loadingBtn = false;
          this.$parent.getUserData();
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
  },

  created() {
    this.userID = this.$route.params.id;
    this.getUserData();
  },
};
</script>
