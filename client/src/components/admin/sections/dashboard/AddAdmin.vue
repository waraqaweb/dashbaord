<template>
  <div
    class="modal fade"
    id="addAdmin"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog custom-with-modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Add an admin</h5>
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
          <form class="mt-1" @submit.prevent="addAmin">
            <!-- Name & Email -->
            <div class="row flex-wrap">
              <!-- Name -->
              <div class="col-12 col-md mt-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Name"
                  v-model="name"
                  required
                />
              </div>
              <!-- Email -->
              <div class="col-12 col-md mt-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Email"
                  v-model="email"
                  required
                />
              </div>
            </div>
            <!-- Password -->
            <div class="row flex-wrap">
              <!-- Password -->
              <div class="col-12 col-md-6 mt-3">
                <input
                  type="password"
                  class="form-control"
                  placeholder="password"
                  v-model="password"
                />
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
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    addAmin() {
      this.alerts.error = "";
      this.alerts.success = "";
      this.loadingBtn = true;

      let data = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      let url =
        "https://dashboard.waraqaweb.com/api/v1/admin/admin/account/path2";
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
          this.name = "";
          this.email = "";
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
@media (min-width: 576px) {
  .modal-dialog {
    max-width: 40%;
  }
}
</style>
