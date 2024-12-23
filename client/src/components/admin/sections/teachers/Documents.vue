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
          <form
            class="mt-1"
            @submit.prevent="uploadFiles"
            enctype="multipart/form-data"
          >
            <div class="row flex-wrap">
              <!-- ID Card -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">ID Card</label>
                <input
                  type="file"
                  @change="selectFile"
                  class="col-12 col-md-4 form-control form-control-sm"
                />
              </div>
              <!-- Passport -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Passport</label>
                <input
                  type="file"
                  @change="selectFile"
                  class="col-12 col-md-4 form-control form-control-sm"
                />
              </div>
            </div>
            <div class="row flex-wrap">
              <!-- Cv -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Cv</label>
                <input
                  type="file"
                  @change="selectFile"
                  class="col-12 col-md-4 form-control form-control-sm"
                />
              </div>
              <!-- Educational qualification -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Educational qualifications</label>
                <input
                  type="file"
                  @change="selectFile"
                  class="col-12 col-md-4 form-control form-control-sm"
                />
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
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      teacherID: null,
      file: null,
      data: [],
    };
  },
  methods: {
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
    uploadFiles() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      const formData = new FormData();
      // formData.append('image', this.file); //('a name', 'the file or image uploaded')

      formData.append("id", this.idCard);
      formData.append("passport", this.passport);
      formData.append("cv", this.cv);
      formData.append("edu", this.edu);

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/teachers/path5/${this.teacherID}`;
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
