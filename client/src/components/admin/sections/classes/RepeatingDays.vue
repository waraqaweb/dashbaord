<template>
  <div
    class="modal fade"
    id="RepeatingDaysModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-1 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Repeating Days</h5>
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
          <form @submit.prevent="submitForm">
            <ul class="list-unstyled m-0 days-list d-flex">
              <li
                v-for="day in days"
                :key="day.id"
                class="me-2"
                :data-day="day"
                @click="selectDays"
              >
                {{ day }}
              </li>
            </ul>
            <div class="row flex-wrap align-items-center">
              <!-- monday input -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Monday</label>

                <input
                  type="time"
                  class="form-control"
                  required
                  v-model="daysTime.Mon"
                  :disabled="selectedDays.Mon ? disabled : ''"
                />
              </div>
              <!-- tuesday input -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Tuesday</label>

                <input
                  type="time"
                  class="form-control"
                  required
                  v-model="daysTime.Tue"
                  :disabled="selectedDays.Tue ? disabled : ''"
                />
              </div>
              <!-- wednesday input -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Wednesday</label>

                <input
                  type="time"
                  class="form-control"
                  required
                  v-model="daysTime.Wed"
                  :disabled="selectedDays.Wed ? disabled : ''"
                />
              </div>
              <!-- thursday input -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Thursday</label>

                <input
                  type="time"
                  class="form-control"
                  required
                  v-model="daysTime.Thu"
                  :disabled="selectedDays.Thu ? disabled : ''"
                />
              </div>
              <!-- friday input -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Friday</label>

                <input
                  type="time"
                  class="form-control"
                  required
                  v-model="daysTime.Fri"
                  :disabled="selectedDays.Fri ? disabled : ''"
                />
              </div>
              <!-- saturday input -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Saturday</label>
                <input
                  type="time"
                  class="form-control"
                  required
                  v-model="daysTime.Sat"
                  :disabled="selectedDays.Sat ? disabled : ''"
                />
              </div>

              <!-- Sunday input -->
              <div class="col-12 col-md-6 mt-3">
                <label class="f-color-3 mb-1">Sunday</label>

                <input
                  type="time"
                  class="form-control"
                  required
                  v-model="daysTime.Sun"
                  :disabled="selectedDays.Sun ? disabled : ''"
                />
              </div>
            </div>
            <!-- Submit -->
            <div class="mt-4 text-end">
              <button
                type="submit"
                class="main-button-style with-100px f-color-0 border-0 py-2 px-3"
              >
                Done
              </button>
            </div>
          </form>
          <div data-bs-toggle="modal" :data-bs-target="name" ref="open"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment-timezone";

export default {
  props: ["selectedDays", "name"],
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      days: {
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
        Sun: "Sun",
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
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    selectDays(event) {
      this.$emit("selectDay", { event, daysTime: this.daysTime });
    },
    submitForm() {
      this.$refs.open.click();
    },
  },
};
</script>
<style scoped>
@media (min-width: 900px) {
  .modal-dialog {
    max-width: 45%;
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
