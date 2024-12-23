<template>
  <div
    class="modal fade"
    id="RescheduleClassModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Reschedule this Class</h5>
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
            <!-- Starting date -->
            <div class="col-12 col-md mt-3">
              <label class="f-color-3 mb-1">Starting date</label>
              <input
                type="datetime-local"
                class="form-control"
                v-model="startingRescheduled"
                required
              />
            </div>
            <!-- Submit -->
            <div
              class="mt-4 d-flex justify-content-between flex-wrap align-items-center"
            >
              <small class="f-color-3">Send Reschedule request ?</small>
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
export default {
  props: ["classID"],
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      startingDate: "",
      studentID: "",
      teacherID: "",
      startingRescheduled: "",
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

      // 1- Class of this field => Starting Date
      let data = {
        classID: this.classID,
        studentID: this.studentID,
        teacherID: this.teacherID,
        startingDate: this.startingDate,
        startingRescheduled: this.startingRescheduled,
      };

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path8`;
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.$parent.getData();
          this.loadingBtn = false;
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
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

          this.startingDate = moment(res.data.rows[0].startingDate).format(
            "YYYY-MM-DD[T]HH:mm:ss"
          );
          this.studentID = res.data.rows[0].studentID;
          this.teacherID = res.data.rows[0].teacherID;

          this.startingRescheduled = this.startingDate; //Inisiallization
          this.displayData = true;
        })
        .catch(() => {
          console.log("Class Info/Error catched");
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
