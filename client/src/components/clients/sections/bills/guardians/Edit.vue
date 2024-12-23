<template>
  <div
    v-if="displayData"
    class="modal fade"
    id="EditInvoiceModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog custom-with-modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Bills</h5>
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
          <!-- Form -->
          <form class="mt-1" @submit.prevent="updateInvoice">
            <!-- Status & transferFess -->
            <div class="row flex-wrap">
              <!-- Status -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Status</label>
                <select class="form-select" v-model="data.paid" required>
                  <option value="">Select status</option>
                  <option value="1">Paid</option>
                  <option value="2">Unpaid</option>
                </select>
              </div>
              <!-- Transfer Fess -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Transfer Fess</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="Enter Transfer Fess"
                  v-model="data.transferFess"
                />
              </div>
            </div>
            <!-- Extra amount & paidHours -->
            <div class="row flex-wrap">
              <!-- Extra amount -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Gift</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="Gift"
                  v-model="data.extraAmount"
                />
              </div>
              <!-- paidHours -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Due Hours</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Due Hours"
                  v-model="hoursCalculted"
                  required
                />
              </div>
            </div>
            <!-- Total amount paid & Payment method -->
            <div class="row flex-wrap">
              <!-- Total amount paid -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Total Fees</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="Total Fees"
                  v-model="data.totalAmountPaid"
                  required
                />
              </div>
              <!-- Payment method -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Payment method</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="data.paymentMethod"
                  required
                />
              </div>
            </div>
            <!-- Payment date : & Payment method -->
            <div class="row flex-wrap">
              <!-- Total amount paid -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Payment date</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="data.paymentDate"
                  required
                />
              </div>
            </div>
            <!-- Submit -->
            <div class="mt-4 text-end">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  props: ["invoiceID", "totalHours"],
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      data: [],
    };
  },
  methods: {
    getData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path2/${this.invoiceID}`;
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
          this.hoursCalculted = this.data.savedPaidHours
            ? this.data.savedPaidHours / 60
            : this.totalHours / 60;

          this.displayData = true;
        })
        .catch(() => {
          console.log("Invoice Info/Error catched");
        });
    },
    updateInvoice() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      this.data.savedPaidHours = this.hoursCalculted * 60; //Save as minutes

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path4/${this.invoiceID}`;
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
    this.getData();
  },
};
</script>
<style scoped>
.days-list li {
  background-color: var(--color-3_3);
  color: var(--color-0);
  border-radius: 50%;
  width: 35px;
  text-align: center;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80%;
  cursor: pointer;
}

.days-list li:hover {
  background-color: var(--color-4);
  color: var(--color-0);
  transition: 0.2s ease-in-out;
}
.selected-day {
  background-color: var(--color-4) !important;
  color: var(--color-0) !important;
}
</style>
