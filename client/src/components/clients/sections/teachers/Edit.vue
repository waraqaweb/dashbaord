<template>
  <div
    v-if="displayData"
    class="modal fade"
    id="editTeacherModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog custom-with-modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Edit Teacher's information</h5>
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
                <small class="f-color-3_3"
                  >This how your picture it looks like</small
                >
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
                  alt="teacher picture"
                />
                <span v-else class="avatar">
                  <div style="font-size: 3rem">
                    {{ data[0].name.charAt(0).toUpperCase() }}
                  </div>
                </span>
              </div>
            </div>
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

                <!-- Birthday -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Birthday</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="data[0].birthday"
                    required
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
                    placeholder="Enter your Address"
                    v-model="data[0].address"
                    required
                  />
                </div>
                <!-- Language -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Language</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your Language"
                    v-model="data[0].language"
                    required
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
              <div class="row flex-wrap"></div>
              <!-- Description -->
              <div class="row flex-wrap">
                <!-- Phone -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Phone</label>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Enter your Phone"
                    v-model="data[0].phone"
                    required
                  />
                </div>

                <!-- TimeZone -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">TimeZone</label>

                  <v-select
                    placeholder="Select TimeZone"
                    :options="TimeZoneList"
                    v-model="data[0].timeZone"
                  />
                </div>
                <!-- Contact Note -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Description</label>
                  <textarea
                    type="text"
                    class="form-control"
                    placeholder="Enter Description"
                    v-model="data[0].description"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <!-- General Information  -->
            <div class="mt-5">
              <span class="d-block f-color-2">General Information :</span>
              <!-- Zoom Link & Payment method -->
              <div class="row flex-wrap">
                <!--  Zoom Link -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Zoom Link</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Zoom Link"
                    v-model="data[0].classLink"
                    required
                  />
                </div>
                <!-- Payment method -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Payment method</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your Payment method"
                    v-model="data[0].paymentMethod"
                    required
                  />
                </div>
              </div>
            </div>
            <!-- Banking data  -->
            <div class="mt-5">
              <span class="d-block f-color-2">Banking data :</span>
              <!-- Country Of Beneficiary Bank &  Beneficiary Account Currency -->
              <div class="row flex-wrap">
                <!-- Country Of Beneficiary Bank -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1"
                    >Country Of Beneficiary Bank</label
                  >
                  <select
                    class="form-select"
                    v-model="data[0].beneficiaryCountry"
                  >
                    <option value="">Select Country</option>
                    <option v-for="country in countriesList" :key="country">
                      {{ country }}
                    </option>
                  </select>
                </div>
                <!--  Beneficiary Account Currency -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1"
                    >Beneficiary Account Currency</label
                  >
                  <select class="form-select" v-model="data[0].accountCurrency">
                    <option value="">Select Account Currency</option>
                    <option>EGP</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>CAD</option>
                  </select>
                </div>

                <!-- Beneficiary Branch Name -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Beneficiary Branch Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Beneficiary Branch Name"
                    v-model="data[0].branchName"
                  />
                </div>
              </div>
              <div class="row flex-wrap">
                <!-- Beneficiary Bank Name -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Beneficiary Bank Name</label>
                  <select class="form-select" v-model="data[0].bankName">
                    <option value="">Select Bank</option>
                    <option v-for="bank in bankList" :key="bank">
                      {{ bank }}
                    </option>
                  </select>
                </div>
                <!-- Beneficiary IBAN -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Beneficiary IBAN</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Beneficiary IBAN"
                    v-model="data[0].iban"
                  />
                </div>

                <!-- Beneficiary's Account Number -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1"
                    >Beneficiary's Account Number</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Beneficiary's Account Number"
                    v-model="data[0].accountNumber"
                  />
                </div>
              </div>
            </div>

            <!-- SWIFT Code & Beneficiary Branch Name -->
            <div class="row flex-wrap">
              <!-- SWIFT Code -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1"
                  >SWIFT Code
                  <small>
                    (You can find your swift code in this link
                    <a
                      href="https://www.theswiftcodes.com/egypt"
                      class="f-color-1"
                      target="_blank"
                      >Here</a
                    >
                    )</small
                  >
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter SWIFT Code"
                  v-model="data[0].swiftCode"
                />
              </div>
              <div class="col-12 col-md mt-3"></div>

              <div class="col-12 col-md mt-3"></div>
            </div>
            <!-- Submit -->
            <div class="mt-4 d-flex justify-content-end align-items-center">
              <small class="f-color-3_3 me-3"
                >Would you like to Update the data?</small
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
                  <span v-else>Update</span>
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
          <!-- Form Password -->
          <form class="mt-4" @submit.prevent="changePassword">
            <!-- Change password  -->
            <div class="mt-5">
              <span class="d-block f-color-2">Change password :</span>
              <!-- Current Password &  Current Password -->
              <div class="row flex-wrap">
                <!-- Current Password -->
                <div class="col-12 col-md mt-3">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Enter Current Password"
                    v-model="password"
                    required
                  />
                </div>
                <!--  New Password -->
                <div class="col-12 col-md mt-3">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Enter New Password"
                    v-model="newPassword"
                    required
                  />
                </div>
              </div>
            </div>
            <!-- Submit -->
            <div class="mt-4 d-flex justify-content-end align-items-center">
              <small class="f-color-3_3 me-3"
                >Would you like to change the Password?</small
              >
              <button
                :disabled="passloadingBtn"
                type="submit"
                class="main-button-style f-color-0 border-0 py-2 px-3 rounded"
              >
                <div>
                  <span
                    v-if="passloadingBtn"
                    class="spinner-grow spinner-grow-sm mx-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span v-else>Change password</span>
                </div>
              </button>
            </div>
            <!-- Alerts -->
            <div class="mt-4">
              <div
                v-if="alerts.passSuccess"
                class="text-center alert text-center alert-success"
              >
                {{ alerts.passSuccess }}
              </div>
              <div
                v-else-if="alerts.passError"
                class="text-center alert text-center alert-warning"
              >
                {{ alerts.passError }}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <ChoosePic name="#editTeacherModal" v-on:changeImage="updateImage($event)" />
</template>
<script>
import axios from "axios";
import Tz from "@/components/Tz.json";
import Countries from "@/components/Countries.json";
import moment from "moment";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ChoosePic from "@/components/clients/sections/guardians/ChoosePic";

export default {
  components: {
    ChoosePic,
    vSelect,
  },
  props: ["userID"],
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      passloadingBtn: false,
      alerts: {
        success: null,
        error: null,
        passSuccess: null,
        passError: null,
      },
      TimeZoneList: Tz,
      countriesList: Countries,
      bankList: [
        "Ahli United Bank",
        "Al Watany Bank of Egypt",
        "Al Baraka Bank of Egypt",
        "Arab African International Bank",
        "Arab Bank Plc.",
        "Arab Banking Corporation",
        "Bank Audi",
        "Bank of Alexandria",
        "Bank of Nova Scotia",
        "Banque du Caire",
        "Banque Misr",
        "Barclays Bank Egypt",
        "Blom Bank",
        "BNP Paribas",
        "Citibank",
        "Commercial International Bank",
        "Credit Agricole Egypt",
        "Egyptian Arab Land Bank",
        "Egyptian Gulf Bank",
        "Export Development Bank of Egypt",
        "Faisal Islamic Bank of Egypt",
        "Federal Arab Bank For Investment and Development",
        "Housing and Development Bank",
        "HSBC Bank Egypt",
        "Industrial Development & Workers Bank of Egypt",
        "Mashreq Bank",
        "Misr Iran Development Bank",
        "National Bank For Development",
        "National Bank of Abu Dhabi",
        "National Bank of Egypt",
        "National Bank of Greece",
        "National Bank of Oman",
        "Nationale Societe Generale Bank",
        "Piraeus Bank",
        "Principal Bank for Development and Agricultural Credit",
        "Societe Arabe Internationale de Banque",
        "Suez Canal Bank",
        "Union National Bank Egypt (UNB-E)",
        "United Bank -Egypt",
        "QNB Bank",
      ],

      data: [],
      avatar: null,
      temporalPic: null,
      firstName: "",
      lastName: "",

      password: "",
      newPassword: "",
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    getUserData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/teachers/path1/${this.userID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.data = [];
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.temporalPic = this.data[0].picture;
          this.firstName = this.data[0].name.split(" ")[0];
          this.lastName = this.data[0].name.split(" ")[1];
          this.data[0].birthday = moment(this.data[0].birthday).format(
            "YYYY-MM-DD"
          );

          this.displayData = true;
        })
        .catch(() => {
          console.log("Teacher Info/Error catched");
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
      this.alerts.passError = "";
      this.alerts.passSuccess = "";
      this.loadingBtn = true;
      this.passloadingBtn = false;

      let data = this.data;
      delete data[0].picture;
      delete data[0].studentsCount;
      delete data[0].minutes;

      let name = this.firstName + " " + this.lastName;
      data[0].name = name;

      // Upload Image
      const formData = new FormData();
      formData.append("image", this.avatar);
      Object.entries(data[0]).forEach(([key, value]) =>
        formData.append(key, value)
      );

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/teachers/path2/${this.userID}`;
      axios
        .post(url, formData)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.loadingBtn = false;
          this.$parent.getUserData();
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
    changePassword() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.alerts.passError = "";
      this.alerts.passSuccess = "";
      this.loadingBtn = false;
      this.passloadingBtn = true;

      let data = {
        password: this.password,
        newPassword: this.newPassword,
      };

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/teachers/path4/${this.userID}`;
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.passloadingBtn = false;
            return (this.alerts.passError = res.data.msg);
          }
          this.alerts.passSuccess = res.data.msg;
          this.passloadingBtn = false;
          this.getUserData();
          this.$parent.getUserData();
        })
        .catch(() => {
          console.log("Error catched");
          this.passloadingBtn = false;
        });
    },
  },

  created() {
    // this.userID = this.$route.params.id;
    this.getUserData();
  },
};
</script>
<style>
@media (min-width: 576px) {
  .custom-with-modal-dialog {
    max-width: 70%;
  }
}
.avatar-btn {
  position: absolute;
  right: 0em;
  top: 3.4em;
  cursor: pointer;
  color: var(--color-4);
  background-color: var(--color-4_1);
  border-radius: 50%;
  width: 29px;
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  opacity: 0.9;
}
.avatar-btn:hover {
  transition: 0.15s ease-in-out;
  opacity: 1;
}
.modal-content .avatar-img,
.modal-content .avatar {
  width: 5em !important;
  height: 5em !important;
}
</style>
