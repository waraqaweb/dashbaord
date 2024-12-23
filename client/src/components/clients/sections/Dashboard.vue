<template>
  <div v-if="displayData" class="dashboard-section mt-5 px-3 py-5 p-md-5">
    <div class="row flex-wrap">
      <div class="col-12 col-md-8">
        <div class="column col-12">
          <div
            class="dashboard-user-box b-color-0 box-shadow-style px-3 px-md-4 py-4"
          >
            <div class="d-flex justify-content-between">
              <div class="d-flex">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <img
                      v-if="data.picture"
                      :src="data.picture"
                      class="avatar-img rounded-circle"
                      alt="clients picture"
                    />
                    <span v-else class="avatar">{{
                      data.name.charAt(0).toUpperCase()
                    }}</span>
                  </div>
                  <div>
                    <span class="d-block f-color-3">{{ data.name }}</span>
                    <small class="f-color-3_3">{{
                      userType == "Teacher"
                        ? "Teacher"
                        : userType == "Guardian"
                        ? "Guardian"
                        : "Undefined"
                    }}</small>
                  </div>
                </div>
              </div>
              <!-- Edit && View -->
              <div class="d-flex align-items-end flex-column">
                <div class="d-flex">
                  <router-link
                    v-if="userType == 'Teacher'"
                    :to="{ name: 'ClientTeacherInfo', params: { id: data.id } }"
                    class="edit"
                    ><i class="fas fa-eye"></i
                  ></router-link>
                  <div
                    v-if="userType == 'Guardian'"
                    class="edit ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editGuardianModal"
                  >
                    <i class="fas fa-edit"></i>
                  </div>
                  <div
                    v-if="userType == 'Teacher'"
                    class="edit ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editTeacherModal"
                  >
                    <i class="fas fa-edit"></i>
                  </div>
                </div>
                <div class="mt-2">
                  <span
                    class="px-3 py-2 secondery-btn cursor-pointer float-end"
                    style="color: black"
                    @click="logout()"
                    >sign out<i class="ms-2 fal fa-sign-out"></i
                  ></span>
                </div>
              </div>
            </div>
            <EditGuardian v-if="userType == 'Guardian'" :userID="userID" />
            <EditTeacher v-if="userType == 'Teacher'" :userID="userID" />
            <div class="mt-3 d-flex justify-content-between align-items-center">
              <small class="f-color-3_3">Now</small>
              <h3 class="f-color-3">{{ userTime }}</h3>
            </div>
          </div>
        </div>
        <div class="column col-12 mt-4">
          <!-- Alert to complete the info -->
          <div
            v-if="
              (userType == 'Teacher' && !data.classLink) ||
              (userType == 'Guardian' && !data.paymentMethod)
            "
            class="mb-2 f-color-4 b-color-4_1 py-1 px-3 px-md-4"
          >
            Your information is currently incomplete; please complete all
            fields.
            <ins
              v-if="userType == 'Guardian'"
              data-bs-toggle="modal"
              data-bs-target="#editGuardianModal"
              class="link-primary h5"
              role="button"
              >From Here</ins
            >
            <ins
              v-if="userType == 'Teacher'"
              data-bs-toggle="modal"
              data-bs-target="#editTeacherModal"
              class="link-primary h5"
              role="button"
              >From Here</ins
            >
          </div>

          <div v-if="nextClass" class="col-12">
            <div
              class="alert alert-primary d-flex align-items-center"
              role="alert"
            >
              The next class is {{ nextClass }} with {{ nextClassStudent }}.
            </div>
          </div>
        </div>

        <div class="d-flex">
          <div class="col-12 col-md-3 me-3 top-small-boxes">
            <div
              class="b-color-1 f-color-0 box-shadow-style px-3 px-md-4 py-4 h-100"
            >
              <span class="d-block">Due Hours</span>
              <h3 v-if="userType == 'Teacher'" class="numb text-end">
                {{ (data.hours / 60).toFixed(2) }}
              </h3>
              <h3 v-if="userType == 'Guardian'" class="numb text-end">
                {{ hours ? (savedPaidHours / 60 - hours / 60).toFixed(2) : 0 }}
              </h3>
            </div>
          </div>
          <div class="col-12 col-md-3 top-small-boxes">
            <div
              class="b-color-4 f-color-0 box-shadow-style px-3 px-md-4 py-4 h-100"
            >
              <span class="d-block">Total Students</span>
              <h3 class="numb text-end">
                {{ studentsCount ? studentsCount : 0 }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4 mt-3 mt-md-0">
        <Notifications :userID="userID" :userType="userType" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Notifications from "@/components/clients/sections/dashboard/notifications/Notifications";
import EditGuardian from "@/components/clients/sections/guardians/Edit";
import EditTeacher from "@/components/clients/sections/teachers/Edit";
import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
export default {
  props: ["userType"],
  components: { Notifications, EditGuardian, EditTeacher },
  data() {
    return {
      userTime: null,
      userID: null,
      data: [],
      hours: null,
      studentsCount: null,
      savedPaidHours: null,
      displayData: false,
      nextClass: null,
      nextClassStudent: null,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("waraqaToken");
      location.reload();
    },
    getUserData() {
      if (!localStorage.getItem("waraqaToken")) {
        return (this.isAuthorized = false);
      }
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("waraqaToken");
      axios
        .get("https://dashboard.waraqaweb.com/auth/v1/path2")
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/");
          }
          (this.userID = res.data.data[0].id), (this.data = res.data.data[0]);
          this.getHoursAndStudentsNum();

          this.displayData = true;
        })
        .catch(() => {
          this.$router.push("/");
        });
    },
    getHoursAndStudentsNum() {
      let queryReq = { params: { userType: this.userType } };
      axios
        .get(
          "https://dashboard.waraqaweb.com/api/v1/client/classes/path0",
          queryReq
        )
        .then((res) => {
          if (res.data.success) {
            (this.hours = res.data.rows[0].hours),
              (this.studentsCount = res.data.rows[0].activeStudentsCount);
            this.savedPaidHours = res.data.rows[0].savedPaidHours;
            const timeAgo = new TimeAgo("en-US");
            this.nextClass = timeAgo.format(
              Date.parse(res.data.rows[0].nextClass)
            );
            this.nextClassStudent = res.data.rows[0].studentName;
          }
        })
        .catch(() => {
          this.$router.push("/");
        });
    },
  },
  created() {
    this.getUserData();
    window.setInterval(() => {
      this.userTime = moment().format("HH:mm");
    }, 1000);
  },
};
</script>
