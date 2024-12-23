<template>
  <div v-if="displayData" class="information">
    <div class="f-color-1">
      <small class="text-on-hover" @click="$router.go(-1)"
        ><i class="fas fa-long-arrow-alt-left"></i> Back</small
      >
    </div>
    <div>
      <!-- Avatar and Edit  -->
      <div class="mt-5 d-flex justify-content-between">
        <!-- Avatar -->
        <div class="d-flex align-items-center">
          <div class="me-3">
            <img
              v-if="data[0].picture"
              :src="data[0].picture"
              class="avatar-img rounded-circle"
              alt="Student picture"
            />
            <span v-else class="avatar">{{
              data[0].name.charAt(0).toUpperCase()
            }}</span>
          </div>
          <div>
            <span class="d-block f-color-3">{{ data[0].name }}</span>
            <small class="f-color-3_3">Student</small>
          </div>
        </div>
        <!-- Edit -->
        <div
          v-if="userType == 'Guardian'"
          class="edit"
          data-bs-toggle="modal"
          data-bs-target="#editStudentModal"
        >
          <i class="fas fa-edit"></i>
        </div>
        <Edit v-if="userType == 'Guardian'" />
      </div>
      <!-- Personal Information  -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Personal Information :</span>
          <small class="f-color-3_3"
            >The student's personal information can be found below.</small
          >
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
            <small class="info-title">Email :</small>
            <span class="info-content">{{
              data[0].email ? data[0].email : "Not Selected"
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
              data[0].address ? data[0].address : "Not Selected"
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
            <span class="info-content">{{ data[0].attendedHours / 60 }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Paying :</small>
            <span class="info-content">{{
              data[0].paymentType == 1
                ? "Advance"
                : data[0].paymentType == 2
                ? "Arrears"
                : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-8 d-flex justify-content-between"
          >
            <small class="info-title">Initial assessment :</small>
            <span class="info-content">{{
              data[0].initialAssessment
                ? data[0].initialAssessment
                : "Not Selected"
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
              <small class="col-2">Subject</small>
              <small class="col-2">Teacher</small>
              <small class="col-1">Duration</small>
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
                <small class="col-2">{{ schClass.subject }}</small>
                <small class="col-2">{{ schClass.teacherName }}</small>
                <small class="col-1">{{ schClass.duration }}</small>
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
    <!-- Delete -->
    <hr class="my-5 opacity-0" />
    <div
      v-if="userType == 'Guardian'"
      class="mt-5 d-flex justify-content-end align-items-center"
    >
      <small class="f-color-3_3 me-3"
        >Would you like to Delete this Student?</small
      >
      <span class="delete-btn px-3 py-2" @click="deleteUser">Delete</span>
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
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Edit from "@/components/clients/sections/students/Edit";
export default {
  props: ["userType"],
  components: { Edit },
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
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/students/path2/${this.userID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/students");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.getscheduleData();
          this.displayData = true;
        })
        .catch(() => {
          console.log("Student Info/Error catched");
        });
    },
    deleteUser() {
      this.alerts.error = null;
      this.alerts.success = null;
      if (window.confirm("Are you sure you want to delete this Student?")) {
        axios
          .delete(
            `https://dashboard.waraqaweb.com/api/v1/admin/students/path4/${this.userID}`
          )
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;
            this.$router.push("/students");
          });
      }
    },
  },
  created() {
    //Teacher can't see this side
    if (this.userType == "Teacher") {
      this.$router.push("/");
    }
    this.userID = this.$route.params.id;
    this.getUserData();
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
</style>
