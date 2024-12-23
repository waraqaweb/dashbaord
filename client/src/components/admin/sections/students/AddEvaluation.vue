<template>
  <div
    class="modal fade"
    id="AddEvaluationModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog custom-with-modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Meeting Summary</h5>
          <button
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
          <form class="mt-1" @submit.prevent="addEvaluation">
            <!-- Meeting date & Teacher -->
            <div class="row flex-wrap">
              <!-- Meeting date -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Meeting date</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="meetingDate"
                  required
                />
              </div>
              <!-- Teacher -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Select Teacher</label>

                <v-select
                  placeholder="Teacher"
                  :options="teachers"
                  label="name"
                  :reduce="(teacher) => teacher.id"
                  v-model="teacherID"
                />
              </div>
            </div>
            <!-- & Description -->
            <div class="row flex-wrap">
              <!-- Teacher performance -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Teacher performance</label>
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Teacher performance"
                  v-model="teacherPerformance"
                ></textarea>
              </div>
              <!-- Student performance -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Student performance</label>
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Student performance"
                  v-model="studentPerformance"
                ></textarea>
              </div>
            </div>
            <!-- Submit -->
            <div class="mt-4 text-end">
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
                  <span v-else>Record</span>
                </div>
              </button>
            </div>
            <!-- Alerts -->
            <div
              v-if="alerts.success"
              class="text-center alert text-center alert-success mt-4"
            >
              {{ alerts.success }}
            </div>
            <div
              v-else-if="alerts.error"
              class="text-center alert text-center alert-warning mt-4"
            >
              {{ alerts.error }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment-timezone";
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    vSelect,
  },
  data() {
    return {
      loadingBtn: false,
      passloadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      teachers: [],
      studentID: "", //Comes from params

      meetingDate: "",
      teacherID: null,

      teacherPerformance: "",
      studentPerformance: "",
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    fetchTeachers() {
      //Uses in AddEvaluation modal
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/teachers/path0";
      axios
        .get(url, { params: { status: 1 } })
        .then((res) => {
          this.teachers = res.data.rows;
        })
        .catch(() => {
          console.log("Error catched");
        });
    },
    addEvaluation() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let data = {
        meetingDate: this.meetingDate,
        teacherID: this.teacherID,
        studentID: this.studentID,
        teacherPerformance: this.teacherPerformance,
        studentPerformance: this.studentPerformance,
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/students/path5";
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.teacherID = "";
          this.loadingBtn = false;
          this.$parent.getPeriodicEvaluation();
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
  },
  created() {
    this.studentID = this.$route.params.id;
    this.fetchTeachers();
  },
};
</script>

<style scoped>
@media (min-width: 576px) {
  .modal-dialog {
    max-width: 40%;
  }
}
</style>
