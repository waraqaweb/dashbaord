<template>
  <div class="mt-5">
    <!-- Add form -->
    <div class="b-color-0 box-shadow-style px-3 py-5 p-md-5">
      <form class="mt-1" @submit.prevent="addProcess">
        <!-- Process & Amount -->
        <div class="row flex-wrap">
          <!-- Process -->
          <div class="col-12 col-md-4 mt-3">
            <label class="f-color-3 mb-1">Process</label>
            <select class="form-select" v-model="process" required>
              <option value="">Select Process</option>
              <option v-for="process in processList" :key="process">
                {{ process }}
              </option>
            </select>
          </div>
          <!-- Amount -->
          <div class="col-12 col-md-4 mt-3">
            <label class="f-color-3 mb-1">Amount</label>
            <input
              type="number"
              class="form-control"
              placeholder="Enter number of Amount"
              v-model="amount"
              required
            />
          </div>
          <!-- Submit -->
          <div class="mt-4 mt-md-5 col-12 col-md-4">
            <button
              :disabled="loadingBtn"
              type="submit"
              class="main-button-style f-color-0 border-0 px-3 rounded"
              style="padding: 0.57rem 0.75rem; margin-top: -0.23rem"
            >
              <div>
                <span
                  v-if="loadingBtn"
                  class="spinner-grow spinner-grow-sm mx-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-else>Record</span>
              </div>
            </button>
          </div>
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
    <div class="mt-5 col-12 row flex-wrap my-0 mx-auto">
      <!--  -->
      <div class="col-12 col-md-4">
        <div class="row flex-wrap h-100">
          <div class="col-6 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.extraFees ? this.data.extraFees : 0
              }}</span>
              <small class="f-color-3_3">Extra fees</small>
            </div>
          </div>
          <div class="col-6 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.extraIncome ? this.data.extraIncome : 0
              }}</span>
              <small class="f-color-3_3">Extra income</small>
            </div>
          </div>
          <div class="col-6 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.transferFees ? this.data.transferFees : 0
              }}</span>
              <small class="f-color-3_3">Transfer fees</small>
            </div>
          </div>
          <div class="col-6 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.administratingFees ? this.data.administratingFees : 0
              }}</span>
              <small class="f-color-3_3">Administrating fees</small>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="col-12 col-md-4">
        <div class="row flex-wrap h-100">
          <div class="col-12 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.salary ? this.data.salary : 0
              }}</span>
              <small class="f-color-3_3">Salary</small>
            </div>
          </div>
          <div class="col-4 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.bonous ? this.data.bonous : 0
              }}</span>
              <small class="f-color-3_3">Bonous</small>
            </div>
          </div>
          <div class="col-4 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.internet ? this.data.internet : 0
              }}</span>
              <small class="f-color-3_3">Internet</small>
            </div>
          </div>
          <div class="col-4 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.marketing ? this.data.marketing : 0
              }}</span>
              <small class="f-color-3_3">Marketing</small>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="col-12 col-md-4">
        <div class="row flex-wrap h-100">
          <div class="col-6 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.currentMonthInvoices
                  ? this.data.currentMonthInvoices
                  : 0
              }}</span>
              <small class="f-color-3_3">Current month invoices</small>
            </div>
          </div>
          <div class="col-6 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.dueHours ? this.data.dueHours : 0
              }}</span>
              <small class="f-color-3_3">Due hours</small>
            </div>
          </div>
          <div class="col-6 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.doneHours ? this.data.doneHours : 0
              }}</span>
              <small class="f-color-3_3">Done hours</small>
            </div>
          </div>
          <div class="col-6 p-1">
            <div
              class="b-color-0 box-shadow-style text-center py-4 px-2 px-md-2 rounded h-100"
            >
              <span class="d-block f-color-2">{{
                this.data.compesationHours ? this.data.compesationHours : 0
              }}</span>
              <small class="f-color-3_3">Compesation hours</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
// import moment from 'moment';
export default {
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      process: "",
      amount: "",
      processList: [
        "Bonous",
        "Internet",
        "Marketing",
        "Salary",
        "Extra fees",
        "Extra income",
        "Transfer fees",
        "Administrating fees",
        "Current month invoices",
        "Due hours",
        "Done hours ",
        "Compesation hours",
      ],
      data: [],
    };
  },
  methods: {
    getData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/expenses/path2`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            // this.$router.push('/admin/exp');
            return;
          }
          this.data = res.data.rows[0];
          this.alerts.error = null;
          this.displayData = true;
        })
        .catch(() => {
          console.log("Invoice Info/Error catched");
        });
    },
    addProcess() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let data = {
        process: this.process,
        amount: this.amount,
      };

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/expenses/path1`;
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.process = "";
          this.getData();
          this.loadingBtn = false;
        })
        .catch(() => {
          console.log("Expenses, Error catched");
          this.loadingBtn = false;
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
