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
        <!-- Edit & Login -->
        <div>
          <!-- Edit -->
          <div
            class="edit"
            data-bs-toggle="modal"
            data-bs-target="#editTeacherModal"
          >
            <i class="fas fa-edit"></i>
          </div>
          <Edit :userID="this.userID" />
          <!-- Login -->
          <div class="mt-2 edit" @click="accessAccount">
            <i class="fas fa-user-lock"></i>
          </div>
        </div>
      </div>
      <!-- Personal Information  -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Personal Information:</span>
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
              (data[0].hours / 60).toFixed(2)
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
      <!-- Banking data : -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Bank Information :</span>
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Country Of Beneficiary Bank :</small>
            <span class="info-content">{{
              data[0].beneficiaryCountry
                ? data[0].beneficiaryCountry
                : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Beneficiary Account Currency :</small>
            <span class="info-content">{{
              data[0].accountCurrency ? data[0].accountCurrency : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">SWIFT Code :</small>
            <span class="info-content">{{
              data[0].swiftCode ? data[0].swiftCode : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Beneficiary Branch Name :</small>
            <span class="info-content">{{
              data[0].branchName ? data[0].branchName : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Beneficiary IBAN :</small>
            <span class="info-content">{{
              data[0].iban ? data[0].iban : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Beneficiary's Account Number :</small>
            <span class="info-content">{{
              data[0].accountNumber ? data[0].accountNumber : "Not Selected"
            }}</span>
          </div>
          <div class="mt-3 col-8 d-flex justify-content-between">
            <small class="info-title">Beneficiary Bank Name :</small>
            <span class="info-content">{{
              data[0].bankName ? data[0].bankName : "Not Selected"
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
              <small class="col-2">Student</small>
              <small class="col-1">Duration</small>
              <small class="col-1">Mon</small>
              <small class="col-1">Tue</small>
              <small class="col-1">Wed</small>
              <small class="col-1">Thu</small>
              <small class="col-1">Fri</small>
              <small class="col-1">Sat</small>
              <small class="col-1">Sun</small>
            </div>
            <div
              v-for="schClass in schudeledClasses"
              :key="schClass.id"
              class="table-row py-3"
            >
              <div class="px-2 px-md-3 d-flex f-color-3">
                <small class="col-2">{{ schClass.subject }}</small>
                <small class="col-2">{{ schClass.studentName }}</small>
                <small class="col-1">{{ schClass.duration }}</small>

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
                <small class="col-1">{{
                  schClass.Sun
                    ? moment(schClass.Sun).format("HH:mm")
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
      <!-- Documents : -->
      <!-- <div class="mt-5 overflow-hidden">
                <div class="mb-1 d-flex justify-content-between">
                    <span class="d-block f-color-2">Documents :</span>
                    <small class="f-color-1 opacity-75 text-on-hover text-decoration-underline" data-bs-toggle="modal" data-bs-target="#AddDocsModal">Documents setting</small>
                </div>
                <Documents />
                <div class="row flex-wrap">
                    <div class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between">
                        <small class="info-title">ID Card :</small>
                        <a href="#" class="info-content f-color-1"><i class="fas fa-file-alt"></i></a>
                    </div>
                    <div class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between">
                        <small class="info-title">Passport :</small>
                        <a href="#" class="info-content f-color-1"><i class="fas fa-file-alt"></i></a>
                    </div>
                    <div class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between">
                        <small class="info-title">Cv :</small>
                        <a href="#" class="info-content f-color-1"><i class="fas fa-file-alt"></i></a>
                    </div>
                    <div class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between">
                        <small class="info-title">Educational qualification :</small>
                        <a href="#" class="info-content f-color-1"><i class="fas fa-file-alt"></i></a>
                    </div>
                </div>
            </div> -->
    </div>
    <!-- Delete -->
    <hr class="my-5 opacity-0" />
    <div class="mt-5 d-flex justify-content-end align-items-center">
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
<style>
.information .avatar,
.information .avatar-img {
  width: 4em;
  height: 4em;
  /* font-size: 17px; */
}
.info-title {
  color: var(--color-3_3);
}
.info-content {
  color: var(--color-1);
  /* background-color:var(--color-1_1); */
  padding: 0 5px;
}
</style>
<script>
import axios from "axios";
import Tz from "@/components/Tz.json";
import Edit from "@/components/admin/sections/teachers/Edit";
// import Documents from '@/components/admin/sections/teachers/Documents';
import moment from "moment";
export default {
  // components:{Edit, Documents},
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
      TimeZoneList: Tz,
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
          teacherID: this.userID,
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
    accessAccount() {
      let data = {
        email: this.data[0].email,
      };
      let url = "https://dashboard.waraqaweb.com/auth/v1/path6";
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          localStorage.setItem("waraqaToken", res.data.token);
          this.$router.push("/");
        })
        .catch(() => {
          return (this.alerts.error = "Soory, failed access acount!");
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
    deleteUser() {
      this.alerts.error = null;
      this.alerts.success = null;
      if (window.confirm("Are you sure you want to delete this teacher?")) {
        axios
          .delete(
            `https://dashboard.waraqaweb.com/api/v1/admin/teachers/path3/${this.userID}`
          )
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;
            this.$router.push("/admin/teachers");
          });
      }
    },
  },
  created() {
    this.userID = this.$route.params.id;
    this.getUserData();
  },
};
</script>
