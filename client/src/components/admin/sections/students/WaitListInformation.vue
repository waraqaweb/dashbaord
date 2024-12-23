<template>
  <div class="f-color-1">
    <small
      class="text-on-hover"
      @click="
        $router.push({
          name: 'StudentMain',
          query: {
            filter: 'four',
          },
        })
      "
      ><i class="fas fa-long-arrow-alt-left"></i> Back</small
    >
  </div>

  <h5 class="m-0 mt-4">Edit</h5>
  <div class="mt-3 px-3 px-md-5 py-5">
    <!-- Form -->
    <div v-if="displayData">
      <form class="mt-1" @submit.prevent="updateUserData">
        <!-- Responsible & Student's name -->
        <div class="row flex-wrap">
          <!-- Responsible -->
          <div class="col-12 col-md mt-3">
            <label class="f-color-3 mb-1">Employee</label>
            <input
              type="text"
              class="form-control"
              placeholder="Employee"
              v-model="data.responsible"
              required
            />
          </div>
          <!-- Student's name -->
          <div class="col-12 col-md mt-3">
            <label class="f-color-3 mb-1">Full Name</label>
            <input
              type="text"
              class="form-control"
              placeholder="Full Name"
              v-model="data.name"
              required
            />
          </div>

          <!-- Contact method -->
          <div class="col-12 col-md mt-3">
            <label class="f-color-3 mb-1">Channel</label>
            <input
              type="text"
              class="form-control"
              placeholder="Channel"
              v-model="data.contactMethod"
            />
          </div>
        </div>
        <div class="row flex-wrap">
          <!-- Contact information -->
          <div class="col-12 col-md mt-3">
            <label class="f-color-3 mb-1">Contact</label>
            <input
              type="text"
              class="form-control"
              placeholder="Contact"
              v-model="data.contactInfo"
            />
          </div>
          <!-- Contact Date -->
          <div class="col-12 col-md mt-3">
            <label class="f-color-3 mb-1">Contact Date</label>
            <input
              type="datetime-local"
              class="form-control"
              v-model="data.contactDate"
              required
            />
          </div>
          <!-- Contact Note -->
          <div class="col-12 col-md mt-3">
            <label class="f-color-3 mb-1">Notes</label>
            <textarea
              type="text"
              class="form-control"
              placeholder="Enter Note"
              v-model="data.notes"
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
              <span v-else>Edit</span>
            </div>
          </button>
        </div>
        <!-- Delete -->
        <hr class="my-5 opacity-0" />
        <div class="mt-5 d-flex justify-content-end align-items-center">
          <span class="delete-btn px-3 py-2" @click="deleteUser">Delete</span>
        </div>
        <!-- Alerts -->
      </form>
    </div>
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

export default {
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      data: [],
      // responsible: "",
      // name: "",
      // contactMethod: "",
      // contactInfo: "",
      // contactDate: "",
      // notes: "",
    };
  },
  methods: {
    getUserData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/students/path8/${this.userID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.data = [];
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;

          this.data = res.data.rows[0];
          delete this.data.createdAt;

          this.data.contactDate = moment(this.data.contactDate).format(
            "YYYY-MM-DD[T]HH:mm:ss"
          );
          this.displayData = true;
        })
        .catch(() => {
          console.log("Student Info/Error catched");
        });
    },
    updateUserData() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      // this.data.contactDate = moment(this.data.contactDate, "YYYY-MM-DD HH:MM:SS")
      this.data.contactDate = moment(
        this.data.contactDate,
        "YYYY/MM/DD HH:mm:ss"
      ).format("YYYY-MM-DD HH:mm:ss");
      console.log(this.data.contactDate);
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/students/path9/${this.userID}`;
      axios
        .post(url, this.data)
        .then((res) => {
          if (!res.data.success) {
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.name = "";
          this.loadingBtn = false;
        })
        .catch(() => {
          console.log("Error catched");
          this.loadingBtn = false;
        });
    },
    deleteUser() {
      this.alerts.error = null;
      this.alerts.success = null;
      if (window.confirm("Are you sure you want to delete this Student?")) {
        axios
          .delete(
            `https://dashboard.waraqaweb.com/api/v1/admin/students/path10/${this.userID}`
          )
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;
            this.$router.push("/admin/students");
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
<style scoped>
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
