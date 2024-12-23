<template>
  <div v-if="displayData" class="information">
    <div class="f-color-1">
      <small
        class="text-on-hover"
        @click="$router.push({ name: 'ClientClassMain', query: $route.query })"
        ><i class="fas fa-long-arrow-alt-left"></i> Back</small
      >
    </div>
    <div>
      <!-- Main Information :  -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Main Information :</span>
          <small class="f-color-3_3"
            >The class's main information can be found below.</small
          >
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
      <!-- Teacher report : -->
      <div v-if="data[0].report" class="mt-5 overflow-hidden">
        <div class="d-flex justify-content-between align-items-center">
          <div class="col-11 col-md-3 mb-1">
            <span class="d-block f-color-2">Teacher report :</span>
            <small class="f-color-3_3"
              >The class's main information can be found below.</small
            >
          </div>
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
          v-if="!closeSendCancelReq && !data[0].report && !data[0].status !== 6"
          @click="cancelClass"
          class="f-color-4 text-decoration-underline cursor-pointer"
          >Cancel this Class</small
        >
      </div>
      <div v-if="!data[0].report">
        <small
          v-if="
            userType == 'Teacher' && (!closeRescheduleReq || reportPermission)
          "
          class="f-color-3_3 me-3"
          >Would you like to
          {{
            !closeRescheduleReq && reportPermission
              ? "Reschedule or End"
              : reportPermission
              ? "End"
              : !closeRescheduleReq
              ? "Reschedule or End"
              : ""
          }}
          this Class?</small
        >
        <small
          v-if="!closeRescheduleReq && userType == 'Guardian'"
          class="f-color-3_3 me-3"
          >Would you like to Reschedule this Class?</small
        >
        <span
          v-if="!closeRescheduleReq"
          class="secondery-btn rounded px-3 py-2"
          data-bs-toggle="modal"
          data-bs-target="#RescheduleClassModal"
          ref="rescheduleRef"
          >Reschedule</span
        >
        <!-- :ref="$route.params.rescheduleRef ? 'rescheduleRef' : 'y'" -->

        <span
          v-if="userType == 'Teacher' && reportPermission"
          class="soft-button-style rounded ms-2 px-3 py-2"
          data-bs-toggle="modal"
          data-bs-target="#AddReportModal"
          ref="submitRef"
          >Submit</span
        >
        <!-- :ref="$route.params.submitClassReport ? 'submitRef' : 'x'" -->

        <RescheduleReq :classID="classID" />
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
import EndClass from "@/components/admin/sections/classes/EndClass";
import RescheduleReq from "@/components/clients/sections/classes/RescheduleReq";

export default {
  props: ["userType"],
  components: { EndClass, RescheduleReq },
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      closeSendCancelReq: false,
      closeRescheduleReq: false,
      reportPermission: false,

      classID: null,
      invoiceID: null,
      scheduleID: null,
      data: [],
    };
  },
  methods: {
    moment(date) {
      // return this.timeZone ? moment(date).tz(this.timeZone) : moment(date);
      return moment(date);
    },
    getData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path2/${this.classID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/classes");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.invoiceID = this.data[0].invoiceID;
          this.scheduleID = this.data[0].scheduleID;

          // let diffNowAndStartingDate = Math.abs(moment(this.data[0].startingDate).diff(moment(), 'hours'))
          let diffNowAndStartingDate = moment(this.data[0].startingDate).diff(
            moment(),
            "hours"
          );
          // console.log("DIFF " + diffNowAndStartingDate);
          //Display cancel req before 3hours
          if (diffNowAndStartingDate < 3) {
            this.closeSendCancelReq = true;
          }
          //Display Reschedule req before 1hours
          if (
            diffNowAndStartingDate < 0 &&
            Math.abs(moment().diff(this.data[0].startingDate, "hours")) > 72
          ) {
            this.closeRescheduleReq = true;
          }
          this.reportPermission =
            moment().isAfter(this.data[0].startingDate) &&
            Math.abs(moment().diff(this.data[0].startingDate, "hours")) < 72;
          this.displayData = true;
        })
        .then(() => {
          this.$route.query.isReschedule == "true" &&
            this.$refs.rescheduleRef.click();
          this.$route.query.isReschedule == "false" &&
            this.$refs.submitRef.click();
        })
        .catch(() => {
          console.log("Class Info/Error catched");
        });
    },
    cancelClass() {
      if (window.confirm("Are you sure you want to cancel this Class?")) {
        this.alerts.error = "";
        this.alerts.success = "";
        this.loadingBtn = true;

        let data = {
          classID: this.classID,
          studentID: this.data[0].studentID,
          teacherID: this.data[0].teacherID,
          startingDate: this.data[0].startingDate,
        };

        let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path7`;
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
      }
    },
  },
  created() {
    this.classID = this.$route.params.id;
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
