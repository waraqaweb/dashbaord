<template>
  <div v-if="displayData" class="information">
    <div class="f-color-1">
      <small class="text-on-hover" @click="$router.go(-1)"
        ><i class="fas fa-long-arrow-alt-left"></i> Back</small
      >
    </div>
    <div>
      <!-- Main Information :  -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Invoice Details</span>
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Teacher :</small>
            <span class="info-content">{{ data[0].teacherName }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Invoice number :</small>
            <span class="info-content">{{ data[0].id }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Invoice date :</small>
            <span class="info-content">{{
              moment(data[0].activatedAt).format("ddd, D MMM YYYY")
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Cancelation Requests:</small>
            <span class="info-content">{{
              data[0].cancelationReq
                ? data[0].cancelationReq
                : data[0].autoCancelationReq
                ? data[0].autoCancelationReq
                : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Bonus :</small>
            <span class="info-content">{{
              data[0].bonus
                ? data[0].bonus
                : data[0].autoBonus
                ? data[0].autoBonus
                : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Teaching Hours:</small>
            <span class="info-content">{{
              data[0].paidHours ? (data[0].paidHours / 60).toFixed(2) : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Salary:</small>
            <span class="info-content">{{
              data[0].totalAmountPaid ? data[0].totalAmountPaid : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Payment Method:</small>
            <span class="info-content">{{
              data[0].paymentMethod ? data[0].paymentMethod : "Bank Account"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Invoice Date:</small>
            <span class="info-content">{{
              data[0].paymentDate
                ? moment(data[0].paymentDate).format("ddd, D MMM YYYY")
                : "Not Selected"
            }}</span>
          </div>
        </div>
      </div>
      <!-- Paid status -->
      <div
        v-if="data[0].paid != 1"
        class="mt-4 col-12 col-md-4 f-color-4 b-color-4_1 py-1 px-2"
      >
        This invoice has not yet been paid.
      </div>
      <!-- Periodic evaluations list -->
      <div class="b-color-0 box-shadow-style mt-5 p-3">
        <div class="d-flex justify-content-end align-items-center flex-wrap">
          <div class="col-12 col-md-4 f-color-1 px-md-3 text-md-end">
            <span>Total hours: {{ (totalHours / 60).toFixed(2) }}</span
            ><br />
            <span
              >Total teaching hours:
              {{ (data[0].teachingHours / 60).toFixed(2) }}</span
            >
          </div>
        </div>
      </div>
      <!-- Table -->
      <div
        class="mt-4 b-color-0 box-shadow-style py-3"
        style="overflow: hidden; overflow-x: auto"
      >
        <div style="min-width: 62em">
          <div class="px-2 table-colums f-color-1 d-flex mb-4">
            <small class="col-2">Student</small>
            <small class="col-2">Teacher</small>
            <small class="col-2">Class title</small>
            <small class="col-2">Class subject</small>
            <small class="col-2">Status</small>
            <small class="col-2">Date</small>
          </div>
          <div
            v-for="anClass in classes"
            :key="anClass.id"
            class="table-row py-3"
          >
            <div class="px-2 d-flex f-color-3">
              <small class="col-2">{{ anClass.studentName }}</small>
              <small class="col-2">{{ anClass.teacherName }}</small>
              <small class="col-2">{{ anClass.classTitle }}</small>
              <small class="col-2">{{ anClass.subject }}</small>
              <small
                :class="[
                  anClass.status == 1 ? 'f-color-1' : 'f-color-4',
                  'col-2',
                ]"
              >
                {{
                  anClass.status == 1
                    ? "Attended"
                    : anClass.status == 4
                    ? "Missed by student"
                    : anClass.status
                }}
              </small>
              <small class="col-2">{{
                moment(anClass.startingDate).format("ddd, D MMM YYYY HH:mm")
              }}</small>
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
      displayData: false,
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      invoiceID: null,
      data: [],
      classes: [],
      totalHours: 0,
    };
  },
  methods: {
    moment(date) {
      // return this.timeZone ? moment(date).tz(this.timeZone) : moment(date);
      return moment(date);
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
          this.data = res.data.rows;
          this.getInvoiceClasses();
          this.displayData = true;
        })
        .catch(() => {
          console.log("Invoice Info/Error catched");
        });
    },
    getInvoiceClasses() {
      let queryReq = {
        params: {
          teacherID: this.data[0].teacherID,
          InvoiceActivatedAt: this.data[0].activatedAt,
        },
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/bills/path8";
      axios
        .get(url, queryReq)
        .then((res) => {
          if (!res.data.success) {
            // this.$router.push('/admin/bills');
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.classes = res.data.rows;
          this.totalHours = 0; // Re-Inisialization
          this.classes.forEach(
            (row) => (this.totalHours = this.totalHours + row.duration)
          );
        })
        .catch(() => {
          console.log("Invoice Info/Error catched");
        });
    },
    deleteData() {
      this.alerts.error = null;
      this.alerts.success = null;
      if (window.confirm("Are you sure you want to delete this Invoice?")) {
        axios
          .delete(
            `https://dashboard.waraqaweb.com/api/v1/admin/bills/path9/${this.invoiceID}`
          )
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;
            this.$router.push("/admin/bills");
          });
      }
    },
  },
  created() {
    this.invoiceID = this.$route.params.id;
    this.getData();
  },
};
</script>
