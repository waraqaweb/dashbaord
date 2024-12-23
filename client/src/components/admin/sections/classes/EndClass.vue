<template>
  <div
    class="modal fade"
    id="AddReportModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div
      v-bind:style="[status != 1 ? { maxWidth: '30%' } : { maxWidth: '50%' }]"
      class="modal-dialog custom-with-modal-dialog"
    >
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Submit Class Report</h5>
          <button
            ref="closeModal"
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
          <form class="mt-1" @submit.prevent="endClass">
            <!-- Attendance & Subject -->
            <div class="row flex-wrap">
              <!-- Attendance -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Attendance</label>
                <select class="form-select" v-model="status" required>
                  <option value="">Status</option>
                  <option value="1">Attended</option>
                  <option value="2">Cancelled by student</option>
                  <option value="3">Cancelled by teacher</option>
                  <option value="4">Missed by student</option>
                  <option value="5">Missed by teacher</option>
                  <option value="6">Cancelled by admin</option>
                </select>
              </div>
              <!-- Subject -->
              <div v-if="status == 1" class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Subject</label>
                <select class="form-select" v-model="reportSubject" required>
                  <option value="">Select subject</option>
                  <option>Quran recitation</option>
                  <option>Quran memorization</option>
                  <option>Arabic language</option>
                  <option>Islamic studies</option>
                  <option>Revision / Test</option>
                </select>
              </div>
            </div>
            <!-- subject types & Previous Assignment -->
            <div v-if="status == 1" class="row flex-wrap">
              <!-- Previous Assignment -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Previous Assignment</label>
                <select
                  class="form-select"
                  v-model="previousAssignment"
                  required
                >
                  <option value="">Select Previous Assignment</option>
                  <option value="1">Done</option>
                  <option value="2">Incomplete</option>
                  <option value="3">Missed</option>
                  <option value="4">Not assigned</option>
                </select>
              </div>

              <!-- Lesson topic -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="
                  reportSubject == 'Quran recitation' ||
                  reportSubject == 'Arabic language' ||
                  reportSubject == 'Islamic studies'
                "
              >
                <label class="f-color-3 mb-1">Lesson topic</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Fill Lesson topic"
                  v-model="lessonTopic"
                />
              </div>
              <!-- Lesson progress -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="
                  reportSubject == 'Islamic studies' ||
                  reportSubject == 'Arabic language'
                "
              >
                <label class="f-color-3 mb-1">Lesson progress</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Fill Lesson progress"
                  v-model="lessonProgress"
                />
              </div>
              <!-- Verse -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="reportSubject == 'Quran recitation'"
              >
                <label class="f-color-3 mb-1">Surah</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Surah Name"
                  v-model="surah"
                />
              </div>
              <!-- Surah -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="reportSubject == 'Quran recitation'"
              >
                <label class="f-color-3 mb-1">Verse</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Verse Number"
                  v-model="verse"
                />
              </div>
              <!-- New verses -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="reportSubject == 'Quran memorization'"
              >
                <label class="f-color-3 mb-1">New verses</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Fill New verses"
                  v-model="newVerses"
                />
              </div>
              <!-- Old revision -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="reportSubject == 'Quran memorization'"
              >
                <label class="f-color-3 mb-1">Old revision</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Old revision"
                  v-model="oldRevision"
                />
              </div>
              <!-- Recent revision -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="reportSubject == 'Quran memorization'"
              >
                <label class="f-color-3 mb-1">Recent revision</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Recent revision"
                  v-model="recentRevision"
                />
              </div>
              <!-- Grammar -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="reportSubject == 'Arabic language'"
              >
                <label class="f-color-3 mb-1">Grammar Topic</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Grammar Topic"
                  v-model="grammar"
                />
              </div>
              <!-- Revised topics -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="reportSubject == 'Revision / Test'"
              >
                <label class="f-color-3 mb-1">Revised topics</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Fill Revised topics"
                  v-model="revisedTopics"
                />
              </div>
            </div>
            <!-- Assignment & Supervisor Notes -->
            <div v-if="status == 1" class="row flex-wrap">
              <!--New Assignment -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">New Assignment</label>
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Enter New Assignment"
                  v-model="newAssignment"
                ></textarea>
              </div>
              <!--Supervisor Notes -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Supervisor Notes</label>
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Enter Notes"
                  v-model="supervisorNotes"
                ></textarea>
              </div>
            </div>
            <!-- Class Performance -->
            <div v-if="status == 1" class="row flex-wrap">
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Class Score</label>
                <!-- <input
                  type="number"
                  min="1"
                  max="5"
                  class="form-control"
                  v-model="classPerformance"
                  required
                /> -->

                <star-rating
                  :show-rating="false"
                  v-model:rating="classPerformance"
                />
              </div>
            </div>
            <!-- Success Alert only -->
            <div v-if="alerts.success" class="mt-4">
              <div class="text-center alert text-center alert-success">
                {{ alerts.success }}
              </div>
            </div>
            <!-- Submit -->
            <div v-else class="mt-4 text-end">
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
                  <span v-else>Submit</span>
                </div>
              </button>
            </div>
            <!-- Error Alert only -->
            <div class="mt-4">
              <div
                v-if="alerts.error"
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
import StarRating from "vue-star-rating";

export default {
  components: {
    StarRating,
  },
  props: ["classID", "invoiceID", "scheduleID", "studentID", "teacherID"],
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      status: "",
      previousAssignment: "",
      reportSubject: "",
      subjectType: "",
      classPerformance: null,
      newAssignment: null,
      supervisorNotes: null,

      lessonTopic: null,
      lessonProgress: null,
      verse: null,
      surah: null,
      newVerses: null,
      oldRevision: null,
      recentRevision: null,
      grammar: null,
      revisedTopics: null,
    };
  },
  methods: {
    endClass() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let dataClassTabel = {
        invoiceID: this.invoiceID, //Props
        scheduleID: this.scheduleID, //Props
        studentID: this.studentID, //Props //To check count of missed classes of this student && If is his last class
        teacherID: this.teacherID, //Props // If is the last class of student with this teacher
        status: this.status,
        previousAssignment: this.previousAssignment
          ? this.previousAssignment
          : null,
        classPerformance: this.classPerformance,
        newAssignment: this.newAssignment,
        supervisorNotes: this.supervisorNotes,
      };
      let dataReportTable = {
        reportSubject: this.reportSubject,
        subjectType: this.subjectType,

        lessonTopic: this.lessonTopic,
        lessonProgress: this.lessonProgress,
        verse: this.verse,
        surah: this.surah,
        newVerses: this.newVerses,
        oldRevision: this.oldRevision,
        recentRevision: this.recentRevision,
        grammar: this.grammar,
        revisedTopics: this.revisedTopics,
      };
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path3/${this.classID}`;
      axios
        .post(url, [dataClassTabel, dataReportTable])
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            console.log(res.data);
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.$parent.getData();
          // this.$refs.closeModal.click();
          this.loadingBtn = false;
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
  },
};
</script>
