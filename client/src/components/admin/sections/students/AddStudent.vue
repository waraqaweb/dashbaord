<template>
  <div
    class="modal fade"
    id="addStudentModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog custom-with-modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Add a lead</h5>
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
          <form class="mt-1" @submit.prevent="addStudent">
            <!-- Responsible & Student's name -->
            <div class="row flex-wrap">
              <!-- Responsible -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Employee</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter Responsible"
                  v-model="responsible"
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
                  v-model="name"
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
                  v-model="contactMethod"
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
                  v-model="contactInfo"
                />
              </div>
              <!-- Contact Date -->
              <div class="col-12 col-md mt-3">
                <label class="f-color-3 mb-1">Contact Date</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="contactDate"
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
                  v-model="notes"
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
                  <span v-else>Add</span>
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
import axios from "axios";
export default {
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      responsible: "",
      name: "",
      contactMethod: "",
      contactInfo: "",
      contactDate: "",
      notes: "",
    };
  },
  methods: {
    addStudent() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let data = {
        responsible: this.responsible,
        name: this.name,
        contactMethod: this.contactMethod,
        contactInfo: this.contactInfo,
        contactDate: this.contactDate,
        notes: this.notes,
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/students/path1";
      axios
        .post(url, data)
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
