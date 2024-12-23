<template>
  <div
    v-if="displayData"
    class="modal fade"
    id="AddDocsModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog custom-with-modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Upload Documents</h5>
          <button
            type="button"
            class="f-color-0 border-0 background-none"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="fas fa-times"></i>
          </button>
        </header>
        <div class="mt-3 px-3 px-md-5 py-5">
          <!-- ID Card Form -->
          <form class="mt-1" @submit.prevent="uploadIDCard">
            <!-- ID Card & Submit -->
            <div
              class="row flex-wrap col-12 justify-content-between align-items-center"
            >
              <!-- ID Card -->
              <div
                class="col-md-7 mt-3 d-flex align-items-center flex-wrap flex-md-nowrap"
              >
                <label class="col-12 col-md-3 f-color-3 mb-1">ID Card</label>
                <input
                  type="file"
                  @change="selectFile"
                  class="col-12 col-md-4 form-control form-control-sm"
                />
              </div>
              <!-- Submit -->
              <div
                class="col-md-4 mt-3 d-flex justify-content-between justify-content-md-end align-items-center"
              >
                <small class="f-color-3_3 d-md-none">Upload the Doc</small>
                <button
                  :disabled="loadingBtn == 1"
                  type="submit"
                  class="main-button-style with-100px f-color-0 border-0 py-2 px-3 rounded"
                >
                  <div>
                    <span
                      v-if="loadingBtn == 1"
                      class="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span v-else>Upload</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
          <!-- Passport Form -->
          <form class="mt-1" @submit.prevent="uploadPassport">
            <!-- Passport & Submit -->
            <div
              class="row flex-wrap col-12 justify-content-between align-items-center"
            >
              <!-- Passport -->
              <div
                class="col-md-7 mt-3 d-flex align-items-center flex-wrap flex-md-nowrap"
              >
                <label class="col-12 col-md-3 f-color-3 mb-1">Passport</label>
                <input
                  type="file"
                  @change="selectFile"
                  class="col-12 col-md-4 form-control form-control-sm"
                />
              </div>
              <!-- Submit -->
              <div
                class="col-md-4 mt-3 d-flex justify-content-between justify-content-md-end align-items-center"
              >
                <small class="f-color-3_3 d-md-none">Upload the Doc</small>
                <button
                  :disabled="loadingBtn == 2"
                  type="submit"
                  class="main-button-style with-100px f-color-0 border-0 py-2 px-3 rounded"
                >
                  <div>
                    <span
                      v-if="loadingBtn == 2"
                      class="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span v-else>Upload</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
          <!-- CV Form -->
          <form class="mt-1" @submit.prevent="uploadCv">
            <!-- CV & Submit -->
            <div
              class="row flex-wrap col-12 justify-content-between align-items-center"
            >
              <!-- CV -->
              <div
                class="col-md-7 mt-3 d-flex align-items-center flex-wrap flex-md-nowrap"
              >
                <label class="col-12 col-md-3 f-color-3 mb-1">CV</label>
                <input
                  type="file"
                  @change="selectFile"
                  class="col-12 col-md-4 form-control form-control-sm"
                />
              </div>
              <!-- Submit -->
              <div
                class="col-md-4 mt-3 d-flex justify-content-between justify-content-md-end align-items-center"
              >
                <small class="f-color-3_3 d-md-none">Upload the Doc</small>
                <button
                  :disabled="loadingBtn == 3"
                  type="submit"
                  class="main-button-style with-100px f-color-0 border-0 py-2 px-3 rounded"
                >
                  <div>
                    <span
                      v-if="loadingBtn == 3"
                      class="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span v-else>Upload</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
          <!-- Educational qualification Form -->
          <form class="mt-1" @submit.prevent="uploadEduca">
            <!-- Educational qualification & Submit -->
            <div
              class="row flex-wrap col-12 justify-content-between align-items-center"
            >
              <!-- Educational qualification -->
              <div
                class="col-md-7 mt-3 d-flex align-items-center flex-wrap flex-md-nowrap"
              >
                <label class="col-12 col-md-3 f-color-3 mb-1"
                  >Educational qualification</label
                >
                <input
                  type="file"
                  @change="selectFile"
                  class="col-12 col-md-4 form-control form-control-sm"
                />
              </div>
              <!-- Submit -->
              <div
                class="col-md-4 mt-3 d-flex justify-content-between justify-content-md-end align-items-center"
              >
                <small class="f-color-3_3 d-md-none">Upload the Doc</small>
                <button
                  :disabled="loadingBtn == 4"
                  type="submit"
                  class="main-button-style with-100px f-color-0 border-0 py-2 px-3 rounded"
                >
                  <div>
                    <span
                      v-if="loadingBtn == 4"
                      class="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span v-else>Upload</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
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
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      displayData: true,
      loadingBtn: 0,
      alerts: {
        success: null,
        error: null,
      },
      file: null,
      data: [],
    };
  },
  methods: {
    uploadIDCard() {
      this.loadingBtn = 1;
    },
    uploadPassport() {
      this.loadingBtn = 2;
    },
    uploadCv() {
      this.loadingBtn = 3;
    },
    uploadEduca() {
      this.loadingBtn = 4;
    },
    getData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path7/${this.invoiceID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/admin/bills");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows[0];
          this.data.paymentDate = moment(this.data.paymentDate).format(
            "YYYY-MM-DD"
          );
          this.hoursCalculted = this.data.paidHours
            ? this.data.paidHours / 60
            : this.totalHours / 60;
          this.cancelationReqValue = this.data.cancelationReq
            ? this.data.cancelationReq
            : this.autoCancelationReq
            ? this.autoCancelationReq
            : 0;
          this.bonusValue = this.data.bonus
            ? this.data.bonus
            : this.autoBonus
            ? this.autoBonus
            : 0;

          this.displayData = true;
        })
        .catch(() => {
          console.log("Invoice Info/Error catched");
        });
    },
    selectFile(event) {
      this.file = event.target.files[0];

      // Update Preview Start
      let files = event.target.files;
      if (!files.length) {
        console.log("file input is empty");
        return;
      }
      /*
            let reader = new FileReader();
            reader.onload = (event)=>{
                this.temporalPic = event.target.result;

            }
            reader.readAsDataURL(files[0])
            */
      // Update Preview End
    },
    uploadFile() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = 1;

      const formData = new FormData();
      formData.append("image", this.file); //('a name', 'the file or image uploaded')

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path9/${this.invoiceID}`;
      axios
        .post(url, this.data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.$parent.getData();
          this.loadingBtn = false;
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
  },
  created() {
    // this.getData()
  },
};
</script>
