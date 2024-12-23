<template>
  <div
    class="modal fade"
    id="EditReportModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog custom-with-modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Edit</h5>
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
          <form class="mt-1" @submit.prevent="editReport">
            <!-- Attendance & Subject -->
            <div class="row flex-wrap">
              <!-- Attendance -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Attendance</label>
                <select class="form-select" v-model="data.status" required>
                  <option value="">Select status</option>
                  <option value="1">Attended</option>
                  <option value="2">Cancelled by student</option>
                  <option value="3">Cancelled by teacher</option>
                  <option value="4">Missed by student</option>
                  <option value="5">Missed by teacher</option>
                  <option value="6">Cancelled by admin</option>
                </select>
              </div>
              <!-- Subject -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Subject</label>
                <select
                  class="form-select"
                  v-model="data.reportSubject"
                  required
                >
                  <option value="">Select subject</option>
                  <option>Quran recitation</option>
                  <option>Quran memorization</option>
                  <option>Arabic language</option>
                  <option>Islamic studies</option>
                  <option>Revision / Test</option>
                </select>
              </div>
            </div>
            <!-- Subject types & Previous Assignment -->
            <div class="row flex-wrap">
              <!-- Previous Assignment -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Previous Assignment</label>
                <select
                  class="form-select"
                  v-model="data.previousAssignment"
                  required
                >
                  <option value="">Select</option>
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
                  data.reportSubject == 'Quran recitation' ||
                  data.reportSubject == 'Arabic language' ||
                  data.reportSubject == 'Islamic studies'
                "
              >
                <label class="f-color-3 mb-1">Lesson topic</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill Lesson topic"
                  v-model="data.lessonTopic"
                />
              </div>
              <!-- Lesson progress -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="
                  data.reportSubject == 'Islamic studies' ||
                  data.reportSubject == 'Arabic language'
                "
              >
                <label class="f-color-3 mb-1">Lesson progress</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill Lesson progress"
                  v-model="data.lessonProgress"
                />
              </div>
              <!-- Verse -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="data.reportSubject == 'Quran recitation'"
              >
                <label class="f-color-3 mb-1">Verse</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill Verse"
                  v-model="data.verse"
                />
              </div>
              <!-- Surah -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="data.reportSubject == 'Quran recitation'"
              >
                <label class="f-color-3 mb-1">Surah</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill Surah"
                  v-model="data.surah"
                />
              </div>
              <!-- New verses -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="data.reportSubject == 'Quran memorization'"
              >
                <label class="f-color-3 mb-1">New verses</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill New verses"
                  v-model="data.newVerses"
                />
              </div>
              <!-- Old revision -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="data.reportSubject == 'Quran memorization'"
              >
                <label class="f-color-3 mb-1">Old revision</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill Old revision"
                  v-model="data.oldRevision"
                />
              </div>
              <!-- Recent revision -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="data.reportSubject == 'Quran memorization'"
              >
                <label class="f-color-3 mb-1">Recent revision</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill Recent revision"
                  v-model="data.recentRevision"
                />
              </div>
              <!-- Grammar -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="data.reportSubject == 'Arabic language'"
              >
                <label class="f-color-3 mb-1">Grammar</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill Grammar"
                  v-model="data.grammar"
                />
              </div>
              <!-- Revised topics -->
              <div
                class="col-12 col-md-6 mt-3"
                v-if="data.reportSubject == 'Revision / Test'"
              >
                <label class="f-color-3 mb-1">Revised topics</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="fill Revised topics"
                  v-model="data.revisedTopics"
                />
              </div>
            </div>
            <!-- Assignment & Supervisor Notes -->
            <div class="row flex-wrap">
              <!--New Assignment -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">New Assignment</label>
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Enter New Assignment"
                  v-model="data.newAssignment"
                ></textarea>
              </div>
              <!--Supervisor Notes -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Supervisor Notes</label>
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Enter Notes"
                  v-model="data.supervisorNotes"
                ></textarea>
              </div>
            </div>
            <!-- Class Performance -->
            <div class="row flex-wrap">
              <!-- Class Performance -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Class Performance </label>
                <!-- <input
                  type="number"
                  min="1"
                  max="5"
                  class="form-control"
                  v-model="data.classPerformance"
                /> -->
                <star-rating
                  :show-rating="false"
                  v-model:rating="data.classPerformance"
                />
              </div>
            </div>
            <!-- Submit -->
            <div class="mt-4 text-end">
              <button
                :disabled="loadingBtn"
                type="submit"
                class="main-button-style f-color-0 border-0 py-2 px-3 rounded"
              >
                <div>
                  <span
                    v-if="loadingBtn"
                    class="spinner-grow spinner-grow-sm mx-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span v-else>Update</span>
                </div>
              </button>
            </div>
            <!-- Error Alert only -->
            <div class="mt-4">
              <div
                v-if="alerts.success"
                class="text-center alert text-center alert-success"
              >
                {{ alerts.success }}
              </div>
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
  props: ["classID"],
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      displayData: false,
      data: [],
      currentStatus: 0,
    };
  },
  methods: {
    getData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path2/${this.classID}`;
      axios
        .get(url)
        .then((res) => {
          console.log();

          if (!res.data.success) {
            this.$router.push("/admin/classes");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows[0];
          this.displayData = true;
          this.currentStatus = res.data.rows[0].status;
        })
        .catch(() => {
          console.log("Class Info/Error catched");
        });
    },
    editReport() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let dataClassTable = {
        status: this.data.status,
        previousAssignment: this.data.previousAssignment,
        classPerformance: this.data.classPerformance,
        newAssignment: this.data.newAssignment,
        supervisorNotes: this.data.supervisorNotes,
        countForStudent: this.data.countForStudent,
        countForTeacher: this.data.countForTeacher,
      };
      let dataReportTable = {
        reportSubject: this.data.reportSubject,
        subjectType: this.data.subjectType,
        lessonTopic: this.data.lessonTopic,
        lessonProgress: this.data.lessonProgress,
        verse: this.data.verse,
        surah: this.data.surah,
        newVerses: this.data.newVerses,
        oldRevision: this.data.oldRevision,
        recentRevision: this.data.recentRevision,
        grammar: this.data.grammar,
        revisedTopics: this.data.revisedTopics,
      };
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path5/${this.classID}`;
      axios
        .post(url, [
          dataClassTable,
          dataReportTable,
          { currentStatus: this.currentStatus },
        ])
        .then((res) => {
          console.log(this.data);

          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.$parent.getData();
          this.loadingBtn = false;
          this.currentStatus = dataClassTable.status;
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
