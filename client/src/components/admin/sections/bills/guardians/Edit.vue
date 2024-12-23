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
          <h5 class="m-0">Edit guardian invoice</h5>
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
              <!-- Payment date -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Payment date</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="data.paymentDate"
                  required
                />
              </div>
              <!-- Transfer Fees -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Transfer Fees</label>
                <input
                  type="number"
                  required
                  class="form-control"
                  placeholder="Transfer Fess"
                  v-model="data.transferFess"
                />
              </div>
            </div>
            <div class="row flex-wrap">
              <!-- Extra amount -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Extra amount</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="Enter Extra amount"
                  v-model="data.extraAmount"
                />
              </div>
              <!-- paidHours -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Paid Hours</label>
                <input
                  type="number"
                  step="any"
                  class="form-control"
                  ref="totalHours"
                  placeholder="Enter Paid Hours"
                  :value="
                    data.savedPaidHours == null
                      ? totalHours / 60
                      : data.savedPaidHours
                  "
                  @input="data.savedPaidHours = $event.target.value"
                  required
                />
              </div>
              <!-- Total amount paid -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Total amount paid</label>
                <input
                  type="number"
                  step="any"
                  class="form-control"
                  placeholder="Edit total amount paid"
                  v-model="data.totalAmountPaid"
                  required
                />
              </div>
            </div>
            <div class="row flex-wrap">
              <!-- Payment method -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Payment method</label>
                <select
                  class="form-select"
                  v-model="data.paymentMethod"
                  required
                >
                  <option value="0">Not selected</option>
                  <option value="1">PayPal</option>
                  <option value="2">Bank account</option>
                  <option value="3">Ria</option>
                  <option value="4">Western Union</option>
                  <option value="5">Other</option>
                </select>
              </div>
              <!-- Invoice Number -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Invoice Number</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="Enter the Invoice number"
                  v-model="data.invoiceNumber"
                  required
                />
              </div>
              <!-- Count for -->
              <div class="col-12 col-md mt-5">
                <div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      v-model="data.isSent"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Sent
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="row flex-wrap"></div>
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
  props: ["invoiceID", "totalHours", "classesIDs"],
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

          this.data.isSent = this.data.isSent === 1 ? true : false;
          this.data.paymentDate = moment(this.data.paymentDate).format(
            "YYYY-MM-DD"
          );
          this.data.paymentMethod = this.data.paymentMethod
            ? this.data.paymentMethod
            : 0;
          this.data.savedPaidHours =
            this.data.savedPaidHours != null
              ? this.data.savedPaidHours / 60
              : null;
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
      this.data.savedPaidHours =
        this.data.savedPaidHours != null
          ? this.data.savedPaidHours * 60
          : this.$refs.totalHours.value * 60; //Save as minutes

      this.data.classesIDs = this.classesIDs; //Store invoiceID as paid classes
      this.data.isSent = this.data.isSent ? 1 : 0;
      delete this.data.hoursPrice;
      delete this.data.transferPrice;
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path4/${this.invoiceID}`;
      axios
        .post(url, this.data)
        .then((res) => {
          this.data.savedPaidHours /= 60;
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.$parent.getData(true);
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
