<template>
  <div v-if="displayData" class="information">
    <div class="f-color-1">
      <small
        class="text-on-hover"
        @click="$router.go(-1)"
      >
        <i class="fas fa-long-arrow-alt-left"></i> Back
      </small>
    </div>
    <div>
      <!-- Request and Edit  -->
      <div
        class="mt-5 d-flex justify-content-between align-items-center flex-wrap"
      >
        <!-- Request -->
        <div class="col-12 col-md-8 text-center order-1 order-md-0">
          <div
            v-if="
              !data[0].report && data[0].status != 6 && data[0].studentCancelReq
            "
            class="mt-1 f-color-4 b-color-4_1 py-1 px-2"
          >
            <span>
              The student "{{ data[0].studentName }}" sent a request to cancel
              this class.</span
            >
          </div>
          <div
            v-if="
              !data[0].report && data[0].status != 6 && data[0].teacherCancelReq
            "
            class="mt-1 f-color-4 b-color-4_1 py-1 px-2"
          >
            <span>
              The teacher "{{ data[0].teacherName }}" sent a request to cancel
              this class.</span
            >
          </div>
          <div
            v-if="!data[0].report && data[0].teacherReschedule"
            class="mt-1 f-color-4 b-color-4_1 py-1 px-2"
          >
            <span class="d-block">
              The teacher "{{ data[0].teacherName }}" sent a request to
              reschedule this class to that date:
            </span>
            <span
              >{{
                moment(data[0].teacherReschedule).format(
                  "ddd, D MMM YYYY, HH:mm"
                )
              }}.
            </span>
            <span
              class="opacity-75 text-decoration-underline opacity-100-on-hover"
              @click="rescheduleReq('acceptOfTeacher')"
              >Accept?</span
            >
            <span> or </span>
            <span
              class="opacity-75 text-decoration-underline opacity-100-on-hover"
              @click="rescheduleReq('rejectOfTeacher')"
              >Reject?</span
            >
          </div>
          <div
            v-if="!data[0].report && data[0].studentReschedule"
            class="mt-1 f-color-4 b-color-4_1 py-1 px-2"
          >
            <span class="d-block">
              The student "{{ data[0].studentName }}" sent a request to
              reschedule this class to that date:
            </span>
            <span
              >{{
                moment(data[0].studentReschedule).format(
                  "ddd, D MMM YYYY, HH:mm"
                )
              }}.
            </span>
            <span
              class="opacity-75 text-decoration-underline opacity-100-on-hover"
              @click="rescheduleReq('acceptOfStudent')"
              >Accept?</span
            >
            <span> or </span>
            <span
              class="opacity-75 text-decoration-underline opacity-100-on-hover"
              @click="rescheduleReq('rejectOfStudent')"
              >Reject?</span
            >
          </div>
        </div>
        <!-- Edit -->
        <div
          class="col-12 col-md-2 edit text-end"
          data-bs-toggle="modal"
          data-bs-target="#EditClassModal"
        >
          <i class="fas fa-edit"></i>
        </div>
        <Edit :classID="classID" />
      </div>
      <!-- Main Information :  -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Class Information :</span>
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Status :</small>
            <span class="info-content">{{
              data[0].status == 0
                ? "Active"
                : data[0].status == 1
                ? "Attended"
                : data[0].status == 2
                ? "Cancelled by student"
                : data[0].status == 3
                ? "Cancelled by teacher"
                : data[0].status == 4
                ? "Missed by student"
                : data[0].status == 5
                ? "Missed by teacher"
                : data[0].status == 6
                ? "Cancelled by admin"
                : "Unreported"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Subject :</small>
            <span class="info-content">{{
              data[0].subject ? data[0].subject : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Title :</small>
            <span class="info-content">{{
              data[0].classTitle ? data[0].classTitle : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Teacher :</small>
            <span class="info-content">{{
              data[0].teacherName ? data[0].teacherName : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Student :</small>
            <span class="info-content">{{
              data[0].studentName ? data[0].studentName : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Starting Date :</small>
            <span class="info-content">{{
              data[0].startingDate
                ? moment(data[0].startingDate).format("ddd, D MMM YYYY, HH:mm")
                : "Not Selected"
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
            <small class="info-title">Class Duration :</small>
            <span class="info-content">{{
              data[0].duration ? data[0].duration + " Minutes" : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-8 d-flex justify-content-between"
          >
            <small class="info-title">Guests :</small>
            <span class="info-content">{{
              data[0].guests ? data[0].guests : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-8 d-flex justify-content-between"
          >
            <small class="info-title">Description :</small>
            <span class="info-content">{{
              data[0].description ? data[0].description : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-8 d-flex justify-content-between"
          >
            <small class="info-title">Class Link :</small>
            <span class="info-content">{{
              data[0].classLink ? data[0].classLink : "Not Selected"
            }}</span>
          </div>
        </div>
      </div>
      <!-- Reminde by Emai -->
      <div class="mt-4" v-if="!data[0].report">
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between align-items-center"
          >
            <small class="info-title">Reminder :</small>
            <span
              class="info-content opacity-75 opacity-100-on-hover"
              @click="remindUser('Teacher')"
              ><i class="fas fa-envelope"></i> Teacher</span
            >
            <span
              class="info-content ms-1 opacity-75 opacity-100-on-hover"
              @click="remindUser('Student')"
              ><i class="fas fa-envelope"></i> Student</span
            >
          </div>
        </div>
      </div>
      <!-- Teacher report : -->
      <div v-if="data[0].report" class="mt-5 overflow-hidden">
        <div class="d-flex justify-content-between align-items-center">
          <div class="col-11 col-md-3 mb-1">
            <span class="d-block f-color-2">Teacher report :</span>
            <small class="f-color-3_3"
              >The class's main information can be found below.</small
            >
          </div>
          <div
            class="col-1 edit text-end"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#EditReportModal"
          >
            <i class="fas fa-edit"></i>
          </div>
          <EditReport :classID="classID" />
        </div>
        <div class="row flex-wrap" v-if="data[0].report">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Attendance :</small>
            <span class="info-content">{{
              data[0].status == 0
                ? "Active"
                : data[0].status == 1
                ? "Attended"
                : data[0].status == 2
                ? "Cancelled by student"
                : data[0].status == 3
                ? "Cancelled by teacher"
                : data[0].status == 4
                ? "Missed by student"
                : data[0].status == 5
                ? "Missed by teacher"
                : "Cancelled by admin"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Previous Assignment :</small>
            <span class="info-content">{{
              data[0].previousAssignment == 1
                ? "Done"
                : data[0].previousAssignment == 2
                ? "Incomplete"
                : data[0].previousAssignment == 3
                ? "Missed"
                : "Not assigned"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Subject :</small>
            <span class="info-content">{{
              data[0].reportSubject ? data[0].reportSubject : "Not Selected"
            }}</span>
          </div>
          <!-- <div class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between">
                        <small class="info-title">Subject type :</small>
                        <span class="info-content">{{data[0].subjectType? data[0].subjectType : 'Not Selected' }}</span>
                    </div> -->

          <div
            v-if="data[0].lessonTopic"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Lesson topic :</small>
            <span class="info-content">{{
              data[0].lessonTopic ? data[0].lessonTopic : "Not Selected"
            }}</span>
          </div>
          <div
            v-if="data[0].lessonProgress"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Lesson progress :</small>
            <span class="info-content">{{
              data[0].lessonProgress ? data[0].lessonProgress : "Not Selected"
            }}</span>
          </div>
          <div
            v-if="data[0].verse"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Verse :</small>
            <span class="info-content">{{
              data[0].verse ? data[0].verse : "Not Selected"
            }}</span>
          </div>
          <div
            v-if="data[0].surah"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Surah :</small>
            <span class="info-content">{{
              data[0].surah ? data[0].surah : "Not Selected"
            }}</span>
          </div>
          <div
            v-if="data[0].newVerses"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">New verses :</small>
            <span class="info-content">{{
              data[0].newVerses ? data[0].newVerses : "Not Selected"
            }}</span>
          </div>
          <div
            v-if="data[0].oldRevision"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Old revision :</small>
            <span class="info-content">{{
              data[0].oldRevision ? data[0].oldRevision : "Not Selected"
            }}</span>
          </div>
          <div
            v-if="data[0].recentRevision"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Recent revision :</small>
            <span class="info-content">{{
              data[0].recentRevision ? data[0].recentRevision : "Not Selected"
            }}</span>
          </div>
          <div
            v-if="data[0].grammar"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Grammar :</small>
            <span class="info-content">{{
              data[0].grammar ? data[0].grammar : "Not Selected"
            }}</span>
          </div>
          <div
            v-if="data[0].revisedTopics"
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Revised topics :</small>
            <span class="info-content">{{
              data[0].revisedTopics ? data[0].revisedTopics : "Not Selected"
            }}</span>
          </div>

          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Class Performance :</small>
            <span class="f-color-3_3"
              ><i
                :class="[
                  data[0].classPerformance >= 1 ? 'active-star' : '',
                  'fas fa-star',
                ]"
              ></i
              ><i
                :class="[
                  data[0].classPerformance >= 2 ? 'active-star' : '',
                  'fas fa-star',
                ]"
              ></i
              ><i
                :class="[
                  data[0].classPerformance >= 3 ? 'active-star' : '',
                  'fas fa-star',
                ]"
              ></i
              ><i
                :class="[
                  data[0].classPerformance >= 4 ? 'active-star' : '',
                  'fas fa-star',
                ]"
              ></i
              ><i
                :class="[
                  data[0].classPerformance >= 5 ? 'active-star' : '',
                  'fas fa-star',
                ]"
              ></i
            ></span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-8 d-flex justify-content-between"
          >
            <small class="info-title">New Assignment :</small>
            <span class="info-content">{{
              data[0].newAssignment ? data[0].newAssignment : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-8 d-flex justify-content-between"
          >
            <small class="info-title">Supervisor Notes :</small>
            <span class="info-content">{{
              data[0].supervisorNotes ? data[0].supervisorNotes : "Not Selected"
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Actions -->
    <hr class="my-5 opacity-0" />
    <div class="mt-5 d-flex justify-content-between align-items-center">
      <div class="d-flex">
        <small
          v-if="!data[0].report"
          class="me-3 f-color-5 text-decoration-underline cursor-pointer"
          @click="deleteData"
          >Delete this class</small
        >
        <!-- <small v-if="!data[0].report && data[0].status !==6" @click="cancelClass" class="f-color-4 text-decoration-underline cursor-pointer" >Cancel this Class</small> -->
      </div>
      <div v-if="data[0].report">
        <small class="f-color-3_3 me-3"
          >Would you like to Delete this Class?</small
        >
        <span class="delete-btn px-3 py-2" @click="deleteData">Delete</span>
      </div>
      <div v-else-if="!data[0].report && reportPermission">
        <span
          class="soft-button-style rounded px-3 py-2"
          data-bs-toggle="modal"
          data-bs-target="#AddReportModal"
          ref="submitRef"
          >Submit</span
        >
      </div>
    </div>
    <EndClass
      :classID="classID"
      :scheduleID="scheduleID"
      :invoiceID="invoiceID"
      :studentID="data[0].studentID"
      :teacherID="data[0].teacherID"
    />
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
import Tz from "@/components/Tz.json";
import Edit from "@/components/admin/sections/classes/Edit";
import EditReport from "@/components/admin/sections/classes/EditReport";
import EndClass from "@/components/admin/sections/classes/EndClass";

export default {
  components: { Edit, EditReport, EndClass },
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      classID: null,
      invoiceID: null,
      scheduleID: null,
      TimeZoneList: Tz,
      data: [],
      reportPermission: false,
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },

    getData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path2/${this.classID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/admin/classes");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.invoiceID = this.data[0].invoiceID;
          this.scheduleID = this.data[0].scheduleID;

          this.addReportPermission();

          this.displayData = true;
        })
        .then(() => {
          this.$route.query.isSubmit == "true" && this.$refs.submitRef.click();
        })
        .catch(() => {
          console.log("Class Info/Error catched");
        });
    },

    rescheduleReq(select) {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;
      let data = {
        rescheduleApproved: true,
        oldStartingDate: this.data[0].startingDate,
        teacherID: this.data[0].teacherID,
        studentID: this.data[0].studentID,
        studentName: this.data[0].studentName,
        teacherName: this.data[0].teacherName,
      };
      if (select == "acceptOfTeacher") {
        data.startingDate = moment(this.data[0].teacherReschedule).format("YYYY-MM-DD HH:mm");
        data.teacherReschedule = null;
        (data.startingDate = this.data[0].teacherReschedule),
          (data.requesterName = this.data[0].teacherName);
      } else if (select == "rejectOfTeacher") {
        data.teacherReschedule = null;
      } else if (select == "acceptOfStudent") {
        data.startingDate = moment(this.data[0].studentReschedule, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm");
        data.studentReschedule = null;
        (data.startingDate = this.data[0].studentReschedule),
          (data.requesterName = this.data[0].studentName);
      } else if (select == "rejectOfStudent") {
        data.studentReschedule = null;
      }

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path4/${this.classID}`;
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.getData();
          this.loadingBtn = false;
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },

    remindUser(user) {
      this.alerts.error = null;
      this.alerts.success = null;
      let data = {
        classID: this.classID,
      };
      let userID;
      let userType;
      if (user == "Teacher") {
        userID = this.data[0].teacherID;
        userType = "Teacher";
      } else {
        userID = this.data[0].studentID;
        userType = "Student";
      }
      data.userID = userID;
      data.userType = userType;

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path9`;
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

    addReportPermission() {
      let isAfter = moment().isAfter(this.data[0].startingDate);
      if (isAfter) {
        this.reportPermission = true;
      }
    },

    deleteData() {
      this.alerts.error = null;
      this.alerts.success = null;
      if (window.confirm("Are you sure you want to delete this Class?")) {
        axios
          .delete(`https://dashboard.waraqaweb.com/api/v1/admin/classes/path6/${this.classID}`)
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;

            // Retrieve the previous page from sessionStorage
            const previousPage = sessionStorage.getItem('previousPage') || '/admin'; // Default to '/admin' if not found
            this.$router.push(previousPage); // Redirect to the previous page
          });
      }
    }
  },

  created() {
    this.classID = this.$route.params.id;
    this.getData();

    // Store the relative path of the previous page before navigating to the class information page
    const previousPage = window.location.pathname || '/admin'; // Fallback to '/admin' if no previous page is found
    sessionStorage.setItem('previousPage', previousPage);
  }
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
