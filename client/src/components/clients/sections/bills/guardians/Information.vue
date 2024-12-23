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
            <small class="info-title">Guardian :</small>
            <span class="info-content">{{ data[0].guardianName }}</span>
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
            <small class="info-title">Transfer fees :</small>
            <span class="info-content">{{
              data[0].transferFess ? data[0].transferFess : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Extra amount :</small>
            <span class="info-content">{{
              data[0].extraAmount ? data[0].extraAmount : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Paid hours :</small>
            <span class="info-content">{{
              data[0].savedPaidHours ? data[0].savedPaidHours / 60 : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Total Fees :</small>
            <span class="info-content">{{
              data[0].totalAmountPaid ? data[0].totalAmountPaid : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Payment method :</small>
            <span class="info-content">{{
              data[0].paymentMethod ? data[0].paymentMethod : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Payment date :</small>
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
        <div
          class="d-flex justify-content-between align-items-center flex-wrap"
        >
          <div class="col-12 col-md-3 mb-1"></div>
          <div class="col-12 col-md-2 f-color-1 px-md-3 text-md-end">
            <span>Total hours: {{ (totalHours / 60).toFixed(2) }}</span>
            <br />
            <span class="pt-4"
              >Total fees:
              {{
                data[0].hoursPrice
                  ? (
                      (totalHours / 60) * data[0].hoursPrice +
                      data[0].transferPrice
                    ).toFixed(2)
                  : "Null"
              }}</span
            >
          </div>
        </div>
        <!-- Table -->
        <div
          v-if="data[0].paymentType == 1"
          class="mt-4 b-color-0 box-shadow-style py-3"
          style="overflow: hidden; overflow-x: auto"
        >
          <div style="min-width: 62em">
            <div class="px-2 table-colums f-color-1 d-flex mb-4">
              <small class="col-2">Student</small>
              <small class="col-2">Teacher</small>
              <small class="col-2">Class title</small>
              <small class="col-2">Class subject</small>
              <small class="col-1">Status</small>
              <small class="col-1">Duration</small>
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
                <small class="col-1">{{
                  anClass.status == 1
                    ? "Attended"
                    : anClass.status == 4
                    ? "Missed by student"
                    : anClass.status == 0
                    ? "Active"
                    : anClass.status
                }}</small>

                <small class="col-1">{{ anClass.duration }}</small>
                <small class="col-2">{{
                  moment(anClass.startingDate).format("ddd, D MMM YYYY HH:mm")
                }}</small>
              </div>
            </div>
          </div>
        </div>
        <!-- Table -->
        <div
          v-else-if="data[0].paymentType == 2"
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
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path2/${this.invoiceID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/admin/bills");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          if (this.data[0].paymentType == 1) {
            this.getPrepaidClasses();
          } else if (this.data[0].paymentType == 2) {
            this.getPostPaidClasses();
          }
          this.displayData = true;
        })
        .catch(() => {
          console.log("Invoice Info/Error catched");
        });
    },
    getPrepaidClasses() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path3/${this.invoiceID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.classes = res.data.rows.filter(
            (item) => item.countOnInvoice == 1
          );
          let invoiceHours = this.data[0].savedPaidHours;
          this.classes = this.classes.filter((row) => {
            if (parseInt(row.countOnInvoice) === 1)
              invoiceHours -= row.duration;
            return invoiceHours >= 0;
          });

          this.totalHours = 0; // Re-Inisialization
          this.classes.forEach((row) => {
            if (parseInt(row.countOnInvoice) === 1)
              this.totalHours = this.totalHours + row.duration;
          });
        })
        .catch(() => {
          console.log("Invoice Info/Error catched");
        });
    },
    getPostPaidClasses() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path5/${this.invoiceID}`;
      let queryReq = {
        params: { InvoiceActivatedAt: this.data[0].activatedAt },
      };
      axios
        .get(url, queryReq)
        .then((res) => {
          if (!res.data.success) {
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.classes = res.data.rows.filter(
            (item) => item.countOnInvoice === 1
          );

          this.classes.forEach((row) => {
            if (parseInt(row.countOnInvoice) === 1)
              this.totalHours = this.totalHours + row.duration;
          });
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
            `https://dashboard.waraqaweb.com/api/v1/admin/bills/path5/${this.invoiceID}`
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
<style>
.circle-Add {
  color: var(--color-4);
  background-color: var(--color-4_1);
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  border-radius: 50%;
  opacity: 0.8;
}
.circle-Add:hover,
.circle-Add:focus {
  color: var(--color-4_1);
  background-color: var(--color-4);
  opacity: 1;
  transition: 0.2s ease-in-out;
}
.active-star {
  color: rgb(255, 186, 58);
}
</style>
