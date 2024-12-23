<template>
  <div
    class="modal fade"
    id="RescheduleClassesModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content borderRadius text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Reschedule Classes</h5>
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
          <form class="mt-1" @submit.prevent="RescheduleClasses">
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
                  v-model="teacherID"
                />
              </div>
              <!-- Student -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Student</label>

                <v-select
                  placeholder="Teacher"
                  :options="students"
                  label="name"
                  :reduce="(student) => student.id"
                  v-model="studentID"
                />
              </div>
            </div>
            <div v-if="displayData">
              <!-- Subject & Class Duration -->
              <div class="row flex-wrap">
                <!-- Subject -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Subject</label>
                  <select
                    class="form-select"
                    v-model="data[0].subject"
                    required
                  >
                    <option value="">Subject</option>
                    <option v-for="subject in subjectsList" :key="subject.id">
                      {{ subject }}
                    </option>
                  </select>
                </div>

                <!-- Class link -->
                <div class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Class Title</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Class title"
                    v-model="data[0].classTitle"
                    required
                  />
                </div>
              </div>
              <!-- Link & Duration -->
              <div class="row flex-wrap align-items-center">
                <!-- Class Duration -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Duration</label>
                  <select
                    class="form-select"
                    v-model="data[0].duration"
                    required
                  >
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
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Payment Cycle</label>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Months"
                    required
                    min="1"
                    v-model="data[0].payEvery"
                  />
                </div>

                <!-- Starting date -->
                <!-- <div class="col-12 col-md mt-3">
                                        <label class="f-color-3 mb-1">Start Date</label>
                                        <input type="datetime-local" class="form-control" v-model="startingDate" required>
                                    </div> -->
                <!-- Days List -->
              </div>
              <!-- Invite guests & Description -->
              <div class="row flex-wrap">
                <!-- Invite guests -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Invite Guests</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Guests' Email"
                    v-model="data[0].guests"
                  />
                </div>
                <!-- Class Description -->
                <div class="col-12 col-md mt-3">
                  <label class="f-color-3 mb-1">Class Information</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Class Information"
                    v-model="data[0].description"
                  />
                </div>
              </div>
              <div class="row flex-wrap">
                <div class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Days</label>
                  <ul class="list-unstyled m-0 days-list d-flex">
                    <li
                      v-for="day in days"
                      :key="day.id"
                      :class="[
                        data.find((el) => el[String(day)] != null)
                          ? 'selected-day'
                          : '',
                        'me-2',
                      ]"
                      :data-day="day"
                      @click="selectDays"
                    >
                      {{ day }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Repeat days -->
              <div class="row flex-wrap">
                <!-- Sunday input -->
                <div v-if="selectedDays.Sun" class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Sunday</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="daysTime.Sun"
                    required
                  />
                </div>
                <!-- monday input -->
                <div v-if="selectedDays.Mon" class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Monday</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="daysTime.Mon"
                    required
                  />
                </div>
                <!-- tuesday input -->
                <div v-if="selectedDays.Tue" class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Tuesday</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="daysTime.Tue"
                    required
                  />
                </div>
                <!-- wednesday input -->
                <div v-if="selectedDays.Wed" class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Wednesday</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="daysTime.Wed"
                    required
                  />
                </div>
                <!-- thursday input -->
                <div v-if="selectedDays.Thu" class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Thursday</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="daysTime.Thu"
                    required
                  />
                </div>
                <!-- friday input -->
                <div v-if="selectedDays.Fri" class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Friday</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="daysTime.Fri"
                    required
                  />
                </div>
                <!-- saturday input -->
                <div v-if="selectedDays.Sat" class="col-12 col-md-6 mt-3">
                  <label class="f-color-3 mb-1">Saturday</label>
                  <input
                    type="time"
                    class="form-control"
                    v-model="daysTime.Sat"
                    required
                  />
                </div>
              </div>

              <!-- Submit -->
              <div class="mt-4 d-flex justify-content-between">
                <div>
                  <small
                    @click="deleteAll"
                    class="f-color-5 text-decoration-underline cursor-pointer"
                    >Cancel Upcoming Classes</small
                  >
                </div>
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
                    <span v-else>Reschedule</span>
                  </div>
                </button>
              </div>
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

export default {
  components: {
    vSelect,
  },
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      displayData: false,
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

      data: [],

      teachers: [],
      students: [],

      guardianID: "",
      teacherID: null,
      studentID: null,

      days: {
        Sun: "Sun",
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
      },

      daysTime: {
        Sun: "",
        Mon: "",
        Tue: "",
        Wed: "",
        Thu: "",
        Fri: "",
        Sat: "",
      },
      selectedDays: {
        Sun: "",
        Mon: "",
        Tue: "",
        Wed: "",
        Thu: "",
        Fri: "",
        Sat: "",
      },
    };
  },
  //   watch: {
  //     // whenever question changes, this function will run
  //     teacherID: function() {
  // this.getscheduleData()
  //     },
  //     studentID: this.getscheduleData
  //   },

  methods: {
    moment(date) {
      return moment(date);
    },

    selectDays(event) {
      let day = event.target.getAttribute("data-day");
      if (!this.selectedDays[day]) {
        // Fill Day
        this.selectedDays[day] = day;
      } else {
        //Empty Day & time
        this.selectedDays[day] = "";
        this.daysTime[day] = "";
      }
      event.target.classList.toggle("selected-day");
    },
    getGuardian() {
      let guardianID = this.students.find(
        (elm) => elm.id == this.studentID
      ).guardianID;
      this.guardianID = guardianID;
    },
    getscheduleData() {
      let queryData = {
        params: {
          teacherID: this.teacherID,
          studentID: this.studentID,
        },
      };
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path11`;
      axios
        .get(url, queryData)
        .then((res) => {
          if (!res.data.success) {
            this.data = [];
            this.displayData = false;
            this.alerts.success = "";
            return (this.alerts.error = res.data.msg);
          }

          this.alerts.error = "";
          this.alerts.error = null;
          this.data = res.data.rows;

          if (this.data[0].Sun) {
            this.daysTime.Sun = moment(this.data[0].Sun).format("HH:mm");
            this.selectedDays.Sun = "Sun";
          }
          if (this.data[0].Mon) {
            this.daysTime.Mon = moment(this.data[0].Mon).format("HH:mm");
            this.selectedDays.Mon = "Mon";
          }
          if (this.data[0].Tue) {
            this.daysTime.Tue = moment(this.data[0].Tue).format("HH:mm");
            this.selectedDays.Tue = "Tue";
          }
          if (this.data[0].Wed) {
            this.daysTime.Wed = moment(this.data[0].Wed).format("HH:mm");
            this.selectedDays.Wed = "Wed";
          }
          if (this.data[0].Thu) {
            this.daysTime.Thu = moment(this.data[0].Thu).format("HH:mm");
            this.selectedDays.Thu = "Thu";
          }
          if (this.data[0].Fri) {
            // this.daysTime.Fri=this.data[0].Fri
            this.daysTime.Fri = moment(this.data[0].Fri).format("HH:mm");
            this.selectedDays.Fri = "Fri";
          }
          if (this.data[0].Sat) {
            this.daysTime.Sat = moment(this.data[0].Sat).format("HH:mm");
            this.selectedDays.Sat = "Sat";
          }

          this.displayData = true;
        })
        .catch(() => {
          console.log("Class Info/Error catched");
        });
    },
    RescheduleClasses() {
      let selectedDyasIsEmpty = Object.values(this.selectedDays).every(
        (x) => x === null || x === ""
      );
      if (selectedDyasIsEmpty) {
        this.alerts.success = "";
        return (this.alerts.error =
          "Please select days and times for rescheduling.");
      }
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      this.data[0].Sun = this.daysTime.Sun
        ? moment(this.daysTime.Sun, "HH:mm")
        : null;
      this.data[0].Mon = this.daysTime.Mon
        ? moment(this.daysTime.Mon, "HH:mm")
        : null;
      this.data[0].Tue = this.daysTime.Tue
        ? moment(this.daysTime.Tue, "HH:mm")
        : null;
      this.data[0].Wed = this.daysTime.Wed
        ? moment(this.daysTime.Wed, "HH:mm")
        : null;
      this.data[0].Thu = this.daysTime.Thu
        ? moment(this.daysTime.Thu, "HH:mm")
        : null;
      this.data[0].Fri = this.daysTime.Fri
        ? moment(this.daysTime.Fri, "HH:mm")
        : null;
      this.data[0].Sat = this.daysTime.Sat
        ? moment(this.daysTime.Sat, "HH:mm")
        : null;
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path12/${this.data[0].id}`;
      axios
        .post(url, this.data[0])
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.getscheduleData();
          this.loadingBtn = false;
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
    deleteAll() {
      this.alerts.error = null;
      this.alerts.success = null;

      let data = {
        studentID: this.studentID,
        teacherID: this.teacherID,
        scheduleID: this.data[0].id,
      };
      if (
        window.confirm(
          "Are you sure you want to delete all classes of this student?"
        )
      ) {
        axios
          .post(
            `https://dashboard.waraqaweb.com/api/v1/admin/classes/path14`,
            data
          )
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;
          });
      }
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
    fetchStudents() {
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/students/path0";
      axios
        .get(url, { params: { status: 1 } })
        .then((res) => {
          this.students = res.data.rows;
        })
        .catch(() => {
          console.log("Error catched");
        });
    },
  },
  created() {
    this.$watch("teacherID", this.getscheduleData);
    this.$watch("studentID", this.getscheduleData);

    this.fetchTeachers();
    this.fetchStudents();
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
