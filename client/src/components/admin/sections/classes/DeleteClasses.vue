<template>
  <div
    class="modal fade"
    id="DeleteClassesModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-start borderRadius">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Delete All Classes</h5>
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
          <form class="mt-1" @submit.prevent="deleteClasses">
            <!-- Starting date -->
            <div class="col-12 col-md mt-3">
              <label class="f-color-3 mb-1">Choose a date</label>

              <Datepicker
                placeholder="Date"
                v-model="startingRescheduled"
                required
                textInput
              />
            </div>
            <!-- Submit -->
            <div
              class="mt-4 d-flex justify-content-end flex-wrap align-items-center"
            >
              <button
                :disabled="loadingBtn"
                type="submit"
                class="btn btn-danger f-color-0 border-0 py-2 px-3 rounded"
              >
                <div>
                  <span
                    v-if="loadingBtn"
                    class="spinner-grow spinner-grow-sm mx-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span v-else>Delete All</span>
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
import "@vuepic/vue-datepicker/dist/main.css";
import Datepicker from "@vuepic/vue-datepicker";

export default {
  components: {
    Datepicker,
  },
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      startingRescheduled: "",
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    deleteClasses() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/classes/path15";
      axios
        .post(url, {
          data: this.startingRescheduled,
        })
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          console.log(res.data);
          this.alerts.success = res.data.msg;
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
