<template>
  <div v-if="displayData" class="information">
    <div class="f-color-1">
      <small class="text-on-hover" @click="$router.go(-1)"
        ><i class="fas fa-long-arrow-alt-left"></i> Back</small
      >
    </div>
    <div>
      <!-- Avatar -->
      <div class="mt-5 d-flex justify-content-between">
        <!-- Avatar -->
        <div class="d-flex align-items-center">
          <div class="me-3">
            <img
              v-if="data[0].picture"
              :src="data[0].picture"
              class="avatar-img rounded-circle"
              alt="teacher picture"
            />
            <span v-else class="avatar">{{
              data[0].name.charAt(0).toUpperCase()
            }}</span>
          </div>
          <div>
            <span class="d-block f-color-3">{{ data[0].name }}</span>
            <small class="f-color-3_3">Teacher</small>
          </div>
        </div>
      </div>
      <!-- Personal Information  -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Personal Information :</span>
          <small class="f-color-3_3"
            >The teacher's personal information can be found below.</small
          >
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Birthday :</small>
            <span class="info-content">{{
              data[0].birthday
                ? moment(data[0].birthday).format("YYYY-MM-DD")
                : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Language :</small>
            <span class="info-content">{{
              data[0].language ? data[0].language : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Phone :</small>
            <span class="info-content">{{
              data[0].phone ? data[0].phone : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Address :</small>
            <span class="info-content">{{
              data[0].email ? data[0].email : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">TimeZone :</small>
            <span class="info-content">{{
              data[0].timeZone ? data[0].timeZone : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Eamil :</small>
            <span class="info-content">{{
              data[0].email ? data[0].email : "Not Selected"
            }}</span>
          </div>
          <div class="mt-3 col-12 col-lg-8 d-flex justify-content-between">
            <small class="info-title">Description :</small>
            <span class="info-content ms-3">{{
              data[0].description ? data[0].description : "Not Selected"
            }}</span>
          </div>
        </div>
      </div>
      <!-- General Information : -->
      <div class="mt-5 overflow-hidden">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">General Information :</span>
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Status :</small>
            <span class="info-content">{{
              data[0].status == 1
                ? "Active"
                : data[0].status == 2
                ? "Inactive"
                : "Vacation"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Total Hours :</small>
            <span class="info-content">{{
              data[0].minutes ? data[0].minutes / 60 : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Students :</small>
            <span class="info-content">{{
              data[0].studentsCount ? data[0].studentsCount : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Cancelation requests :</small>
            <span class="info-content">{{
              data[0].CancelationReq ? data[0].CancelationReq : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">A bonus money :</small>
            <span class="info-content">{{
              data[0].bonus ? data[0].bonus : 0
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
          <div class="mt-3 col-12 col-lg-8 d-flex justify-content-between">
            <small class="info-title">Zoom Link :</small>
            <span class="info-content ms-3">{{
              data[0].classLink ? data[0].classLink : "Not Selected"
            }}</span>
          </div>
        </div>
      </div>
      <!-- Schudel classes : -->
      <div
        v-if="schudeledClasses.length"
        class="b-color-0 box-shadow-style mt-5 p-3"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="col-11 col-md-3 mb-1">
            <span class="d-block f-color-2">Scheduled classes:</span>
            <small class="f-color-3_3"
              >The following is a list of this teacher's scheduled
              classes.</small
            >
          </div>
        </div>
        <!-- Table -->
        <div
          class="mt-4 b-color-0 box-shadow-style py-3"
          style="overflow: hidden; overflow-x: auto"
        >
          <div style="min-width: 62em">
            <div class="px-2 px-md-3 table-colums f-color-1 d-flex mb-4">
              <small class="col-5">Subject</small>
              <small class="col-1">Sun</small>
              <small class="col-1">Mon</small>
              <small class="col-1">Tue</small>
              <small class="col-1">Wed</small>
              <small class="col-1">Thu</small>
              <small class="col-1">Fri</small>
              <small class="col-1">Sat</small>
            </div>
            <div
              v-for="schClass in schudeledClasses"
              :key="schClass.id"
              class="table-row py-3"
            >
              <div class="px-2 px-md-3 d-flex f-color-3">
                <small class="col-5">{{ schClass.subject }}</small>
                <small class="col-1">{{
                  schClass.Sun
                    ? moment(schClass.Sun).format("HH:mm")
                    : "--:--:--"
                }}</small>
                <small class="col-1">{{
                  schClass.Mon
                    ? moment(schClass.Mon).format("HH:mm")
                    : "--:--:--"
                }}</small>
                <small class="col-1">{{
                  schClass.Tue
                    ? moment(schClass.Tue).format("HH:mm")
                    : "--:--:--"
                }}</small>
                <small class="col-1">{{
                  schClass.Wed
                    ? moment(schClass.Wed).format("HH:mm")
                    : "--:--:--"
                }}</small>
                <small class="col-1">{{
                  schClass.Thu
                    ? moment(schClass.Thu).format("HH:mm")
                    : "--:--:--"
                }}</small>
                <small class="col-1">{{
                  schClass.Fri
                    ? moment(schClass.Fri).format("HH:mm")
                    : "--:--:--"
                }}</small>
                <small class="col-1">{{
                  schClass.Sat
                    ? moment(schClass.Sat).format("HH:mm")
                    : "--:--:--"
                }}</small>
              </div>
            </div>
            <!-- Alerts -->
            <div class="mt-4">
              <div
                v-if="alerts.success"
                class="text-start text-md-center alert text-center alert-success"
              >
                {{ alerts.success }}
              </div>
              <div
                v-else-if="alerts.error"
                class="text-start text-md-center alert text-center alert-warning"
              >
                {{ alerts.error }}
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
      userID: null,
      data: [],
      schudeledClasses: [],
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    getscheduleData() {
      this.alerts.error = "";
      this.alerts.success = "";

      let queryData = {
        params: {
          studentID: this.userID,
        },
      };
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path13`;
      axios
        .get(url, queryData)
        .then((res) => {
          if (!res.data.success) {
            return;
          }
          this.alerts.error = null;
          this.schudeledClasses = res.data.rows;
        })
        .catch(() => {
          console.log("Class Info/Error catched");
        });
    },
    getUserData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/teachers/path1/${this.userID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/admin/teachers");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.getscheduleData();
          this.displayData = true;
        })
        .catch(() => {
          console.log("Teacher Info/Error catched");
        });
    },
  },
  created() {
    this.userID = this.$route.params.id;
    this.getUserData();
  },
};
</script>
