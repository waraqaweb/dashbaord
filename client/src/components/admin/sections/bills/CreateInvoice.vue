<template>
  <div
    class="modal fade"
    id="CreateInvoiceModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Create Invoice</h5>
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
          <form class="mt-1" @submit.prevent="createInvoice">
            <div class="row flex-wrap">
              <!-- Status -->
              <div class="col-12 col-md">
                <label class="f-color-3 mb-1">Status</label>
                <select class="form-select" v-model="status" required>
                  <option value="">Select status</option>
                  <option value="1">Paid</option>
                  <option value="2">Unpaid</option>
                </select>
              </div>
              <div class="col-12 col-md">
                <label class="f-color-3 mb-1">Guardian</label>

                <v-select
                  :options="guardians"
                  label="name"
                  :reduce="(guardian) => guardian.id"
                  v-model="guardianID"
                  placeholder="Select Guardian"
                />
              </div>
            </div>
            <!-- Extra amount & paidHours -->
            <div class="row flex-wrap">
              <!-- Extra amount -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Extra amount</label>
                <input
                  v-model="extraAmount"
                  type="number"
                  step="any"
                  class="form-control"
                  placeholder="Enter Extra amount"
                />
              </div>
              <!-- paidHours -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Paid Hours</label>
                <input
                  v-model="paidHours"
                  type="number"
                  step="any"
                  class="form-control"
                  placeholder="Enter Paid Hours"
                  :required="status == 1"
                />
              </div>
            </div>
            <!-- Total amount paid & Payment method -->
            <div class="row flex-wrap">
              <!-- Total amount paid -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Total amount paid</label>
                <input
                  v-model="totalAmountPaid"
                  type="number"
                  step="any"
                  class="form-control"
                  placeholder="Edit total amount paid"
                  :required="status == 1"
                />
              </div>
              <!-- Payment method -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Payment method</label>

                <select class="form-select" v-model="paymentMethod" required>
                  <option value="0">Not selected</option>
                  <option value="1">PayPal</option>
                  <option value="2">Bank account</option>
                  <option value="3">Ria</option>
                  <option value="4">Western Union</option>
                  <option value="5">Other</option>
                </select>
              </div>
            </div>
            <!-- Invoice Number & Payment date -->
            <div class="row flex-wrap">
              <!-- Payment date -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Starting Date</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="startingDate"
                  required
                />
              </div>
              <!-- Transfer Fees -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Transfer Fees</label>
                <input
                  v-model="transferFees"
                  type="number"
                  step="any"
                  class="form-control"
                  placeholder="Transfer Fess"
                />
              </div>
            </div>
            <div class="row flex-wrap">
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Invoice Number</label>
                <input
                  v-model="invoiceNumber"
                  type="number"
                  class="form-control"
                  placeholder="Enter the Invoice number"
                  required
                />
              </div>
              <div v-if="status == 1" class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Payment Date</label>
                <input type="date" class="form-control" v-model="paymentDate" />
              </div>
            </div>
            <div class="col-12 col-md mt-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                  v-model="isSent"
                  :checked="isSent"
                />
                <label class="form-check-label" for="flexCheckDefault">
                  Sent
                </label>
              </div>
            </div>

            <!-- Submit -->
            <div class="mt-4 text-end">
              <button
                :disabled="loadingBtn"
                type="submit"
                class="main-button-style with-100px f-color-0 border-0 py-2 px-3"
              >
                <div>
                  <span
                    v-if="loadingBtn"
                    class="spinner-grow spinner-grow-sm mx-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span v-else>Create</span>
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
import moment from "moment-timezone";
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    vSelect,
  },
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      status: "",
      paidHours: null,
      totalAmountPaid: null,
      startingDate: null,
      extraAmount: null,
      paymentMethod: 0,
      invoiceNumber: null,
      transferFees: null,
      paymentDate: null,
      isSent: false,
      guardians: [],
      guardianID: null,
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    createInvoice() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let data = {};
      if (!this.guardianID) {
        this.loadingBtn = false;
        return (this.alerts.error = "Guardian is required");
      }
      data["guardianID"] = this.guardianID;
      data["invoiceNumber"] = this.invoiceNumber;
      data["transferFess"] = this.transferFees;
      data["extraAmount"] = this.extraAmount;
      data["totalAmountPaid"] = this.totalAmountPaid;
      data["savedPaidHours"] = this.paidHours * 60;

      data["active"] = 1;
      data["paid"] = parseInt(this.status);

      data["establishedAt"] = moment(
        this.startingDate,
        "YYYY/MM/DD HH:mm:ss"
      ).format("YYYY-MM-DD HH:mm:ss");

      this.isSent = this.isSent ? 1 : 0;
      data["isSent"] = this.isSent;
      data["paymentMethod"] = parseInt(this.paymentMethod);
      data["paymentDate"] = this.paymentDate
        ? moment(this.paymentDate, "YYYY/MM/DD HH:mm:ss").format(
            "YYYY-MM-DD HH:mm:ss"
          )
        : null;

      let url =
        "https://dashboard.waraqaweb.com/api/v1/admin/bills/guardian/path9";
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.loadingBtn = false;
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
    fetchGuardians() {
      //Uses in AddEvaluation modal
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/guardians/path0";
      axios
        .get(url, { params: { status: 1 } })
        .then((res) => {
          this.guardians = res.data.rows;
        })
        .catch(() => {
          console.log("Error catched");
        });
    },
  },
  created() {
    this.fetchGuardians();
  },
};
</script>
<style scoped>
@media (min-width: 576px) {
  .modal-dialog {
    max-width: 40%;
  }
}

.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #dfe5fb;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
}

.style-chooser .vs__clear,
.style-chooser .vs__open-indicator {
  fill: #394066;
}
</style>
