<template>
  <div
    class="modal fade"
    id="EditClassModal"
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
          <form class="mt-1" @submit.prevent="updateClass">
            <!-- Subject & Status -->
            <div class="row flex-wrap">
              <!-- status -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Status</label>
                <select class="form-select" v-model="data.status" required>
                  <option value="">Status</option>
                  <option value="0">Active</option>
                  <option value="6">Cancel</option>

                  <option value="1">Attended</option>
                  <option value="2">Cancelled by student</option>
                  <option value="3">Cancelled by teacher</option>
                  <option value="4">Missed by student</option>
                  <option value="5">Missed by teacher</option>
                </select>
              </div>
              <!-- Subject -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Subject</label>
                <select class="form-select" v-model="data.subject" required>
                  <option value="">Subject</option>
                  <option v-for="subject in subjectsList" :key="subject.id">
                    {{ subject }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Student & Teacher -->
            <div class="row flex-wrap">
              <!-- Teacher -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Teacher</label>

                <v-select
                  placeholder="Teacher"
                  :options="teachers"
                  label="name"
                  :reduce="(teacher) => teacher.id"
                  v-model="data.teacherID"
                />

                <!-- <select class="form-select" v-model="data.teacherID" required>
                  <option value="">Select Teacher</option>
                  <option
                    v-for="teacher in teachers"
                    :key="teacher.id"
                    :value="teacher.id"
                  >
                    {{ teacher.name }}
                  </option>
                </select> -->
              </div>

              <!-- Student -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Student</label>
                <!-- 
                <v-select
                  placeholder="Student"
                  :options="data.students"
                  label="name"
                  :reduce="(student) => student.id"
                  v-model="data.studentID"
                /> -->

                <select class="form-select" v-model="data.studentID" required>
                  <option value="">Student</option>
                  <option :value="data.studentID">
                    {{ data.studentName }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Starting date & Duration -->
            <div class="row flex-wrap">
              <!-- Starting date -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  class="form-control"
                  v-model="data.startingDate"
                  required
                />
              </div>
              <!-- Class Duration -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Select Duration</label>
                <select class="form-select" v-model="data.duration" required>
                  <option value="">Duration</option>
                  <option value="15">15 Mins</option>
                  <option value="30">30 Mins</option>
                  <option value="40">40 Mins</option>
                  <option value="45">45 Mins</option>
                  <option value="60">60 Mins (an hour)</option>
                  <option value="75">75 Mins (an hour and quarter)</option>
                  <option value="90">90 Mins (an hour and half)</option>
                  <option value="120">120Mins (two hours)</option>
                </select>
              </div>
            </div>
            <!-- Invite guests & Class link -->
            <div class="row flex-wrap">
              <!-- Class link -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Class Type</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Class Type"
                  v-model="data.classTitle"
                  required
                />
              </div>
              <!-- Invite guests -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Guest Email</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Guests Email"
                  v-model="data.guests"
                />
              </div>
            </div>
            <!-- Class Description -->
            <div class="row flex-wrap">
              <!-- Class Description -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Class Information</label>
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Class Information"
                  v-model="data.description"
                ></textarea>
              </div>
              <!-- Count for -->
              <div class="col-12 col-md-6 mt-5">
                <v-select
                  placeholder="TimeZone"
                  :options="TimeZoneList"
                  v-model="timeZone"
                />
              </div>
            </div>
            <div class="col-12 col-md-6 mt-3">
              <label class="f-color-3 mb-1">Count for</label>
              <div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    v-model="data.countForTeacher"
                    :checked="data.countForTeacher"
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    Teacher
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    v-model="data.countForStudent"
                    :checked="data.countForStudent"
                  />
                  <label class="form-check-label" for="flexCheckChecked">
                    Student
                  </label>
                </div>
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
import Tz from "@/components/Tz.json";

export default {
  components: {
    vSelect,
  },
  props: ["classID"],
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      teachers: [],
      data: [],
      subjectsList: [
        "Foundation level",
        "Pre-reading level",
        "Tajweed basics",
        "Intermediate",
        "Qari program",
        "Khatmah program",
        "Short surahs",
        "One Juz Surah",
        "Hafez program",
        "Ljazah program",
        "Basic arabic",
        "Intermediate arabic",
        "Upper-intermediate arabic",
        "Advanced arabic",
        "Classical arabic",
        "Indiputable facts of religion",
        "Intro to classical books",
      ],
      timeZone: moment.tz.guess(),
      TimeZoneList: Tz,

      currentStatus: 0,
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },

    updateClass() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      if (!this.data.teacherID) {
        this.loadingBtn = false;

        return (this.alerts.error = "You have to choose a teacher.");
      }

      // 1- Class of this field => Starting Date
      let data = {
        status: this.data.status,
        teacherID: this.data.teacherID,
        studentID: this.data.studentID,
        subject: this.data.subject,
        classTitle: this.data.classTitle,
        startingDate: moment(this.data.startingDate, "YYYY-MM-DD HH:mm"),
        duration: this.data.duration,
        guests: this.data.guests,
        description: this.data.description,
        timeZone: this.data.timeZone,
        countForTeacher: this.data.countForTeacher,
        countForStudent: this.data.countForStudent,
      };

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path4/${this.classID}`;
      axios
        .post(url, { ...data, currentStatus: this.currentStatus })
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.$parent.getData();
          this.loadingBtn = false;
          this.currentStatus = data.status;
        })
        .catch((e) => {
          console.log(e.message);
          this.loadingBtn = false;
        });
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
          this.data = res.data.rows[0];
          this.data.startingDate = moment(this.data.startingDate).format(
            "YYYY-MM-DD[T]HH:mm:ss"
          );
          this.displayData = true;
          this.currentStatus = res.data.rows[0].status;
        })
        .catch(() => {
          console.log("Class Info/Error catched");
        });
    },
  },
  created() {
    this.fetchTeachers();
    this.getData();
  },
};
</script>
<style scoped>
@media (min-width: 576px) {
  .modal-dialog {
    max-width: 40%;
  }
}
.days-list li {
  background-color: var(--color-3_3);
  color: var(--color-0);
  border-radius: 50%;
  width: 35px;
  text-align: center;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80%;
  cursor: pointer;
}

.days-list li:hover {
  background-color: var(--color-4);
  color: var(--color-0);
  transition: 0.2s ease-in-out;
}
.selected-day {
  background-color: var(--color-4) !important;
  color: var(--color-0) !important;
}
</style>
