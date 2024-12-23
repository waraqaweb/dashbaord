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
                      alt="admin picture"
                    />
                    <span v-else class="avatar">{{
                      data.name.charAt(0).toUpperCase()
                    }}</span>
                  </div>
                  <div>
                    <span class="d-block f-color-3">{{ data.name }}</span>
                    <small class="f-color-3_3">Admin</small>
                    <!-- <span
                    class="f-color-3_3 cursor-pointer float-end"
                    @click="logout()"
                    ><i class="mr-0 fal fa-sign-out"></i
                  ></span> -->
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-end flex-column">
                <div
                  class="edit"
                  data-bs-toggle="modal"
                  data-bs-target="#editUserModal"
                >
                  <i class="fas fa-edit"></i>
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

            <EditAccount :userID="userID" />
            <div class="mt-3 d-flex justify-content-between align-items-center">
              <small class="f-color-3_3">Now</small>
              <h3 class="f-color-3">{{ userTime }}</h3>
            </div>
          </div>
        </div>

        <div class="column col-12 mt-4">
          <div class="b-color-0 box-shadow-style px-3 px-md-4 py-4 mb-4">
            <div class="d-flex justify-content-between">
              <div style="display: flex">
                <label class="switch">
                  <input
                    v-model="isEmailEnabled"
                    @change="enableEmails"
                    type="checkbox"
                  />
                  <span class="slider round"></span>
                </label>

                <div style="margin-top: 5px; margin-left: 10px">
                  Email Notifications
                </div>
              </div>

              <div
                class="opacity-75 opacity-100-on-hover"
                data-bs-toggle="modal"
                data-bs-target="#addAdmin"
              >
                <i class="fas fa-plus"></i
                ><span class="d-none d-md-inline">Add an admin</span>
              </div>
              <AddAdmin />
            </div>
          </div>
        </div>
        <div class="column col-12 mt-4">
          <div class="b-color-0 box-shadow-style px-3 px-md-4 py-4">
            <div class="d-flex flex-column flex-lg-row">
              <div class="me-lg-4 me-sm-0 flex-fill">
                <div class="h3 text-center f-color-0 b-color-1">Students</div>
                <table class="table table-bordered border-light">
                  <thead>
                    <tr class="table-light">
                      <th scope="col">Active</th>
                      <th scope="col">Vacation</th>
                      <th scope="col">Inactive</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="table-light">
                      <td>
                        {{
                          usersData?.activeStudentsCount
                            ? usersData.activeStudentsCount
                            : 0
                        }}
                      </td>
                      <td>
                        {{
                          usersData?.vacationStudentsCount
                            ? usersData.vacationStudentsCount
                            : 0
                        }}
                      </td>
                      <td>
                        {{
                          usersData?.inactiveStudentsCount
                            ? usersData.inactiveStudentsCount
                            : 0
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex-fill">
                <div class="h3 text-center f-color-0 b-color-1">Teachers</div>
                <table class="table table-bordered border-light">
                  <thead>
                    <tr class="table-light">
                      <th scope="col">Active</th>
                      <th scope="col">Vacation</th>
                      <th scope="col">Inactive</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="table-light">
                      <td>
                        {{
                          usersData?.activeTeachersCount
                            ? usersData.activeTeachersCount
                            : 0
                        }}
                      </td>
                      <td>
                        {{
                          usersData?.vacationTeachersCount
                            ? usersData.vacationTeachersCount
                            : 0
                        }}
                      </td>
                      <td>
                        {{
                          usersData?.inactiveTeachersCount
                            ? usersData.inactiveTeachersCount
                            : 0
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="d-flex flex-column flex-lg-row">
              <div class="flex-fill me-lg-2 me-sm-0">
                <div class="h3 text-center f-color-0 b-color-1">Hours</div>
                <table class="table table-bordered border-light">
                  <thead>
                    <tr class="table-light">
                      <th scope="col">Attended</th>
                      <th scope="col">Scheduled</th>
                      <th scope="col">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="table-light">
                      <td>
                        {{
                          usersData?.attendedClassHours
                            ? (usersData.attendedClassHours / 60).toFixed(2)
                            : 0
                        }}
                      </td>
                      <td>
                        {{
                          usersData?.scheduledClassHours
                            ? (usersData.scheduledClassHours / 60).toFixed(2)
                            : 0
                        }}
                      </td>
                      <td>
                        {{
                          usersData?.paidClassHours
                            ? (usersData.paidClassHours / 60).toFixed(2)
                            : 0
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="d-flex flex-fill flex-column flex-sm-row">
                <div class="flex-fill me-sm-2 me-0">
                  <div class="h3 text-center f-color-0 b-color-1">Invoices</div>

                  <table class="table table-bordered border-light">
                    <thead>
                      <tr class="table-light">
                        <th scope="col">Due</th>
                        <th scope="col">Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="table-light">
                        <td>
                          {{ usersData?.dueInvoice ? usersData.dueInvoice : 0 }}
                        </td>
                        <td>
                          {{
                            usersData?.paidInvoicesHours
                              ? (usersData.paidInvoicesHours / 60).toFixed(2)
                              : 0
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex-fill">
                  <div class="h3 text-center f-color-0 b-color-1">Payment</div>
                  <table class="table table-bordered border-light">
                    <thead>
                      <tr class="table-light">
                        <th scope="col">Advance</th>
                        <th scope="col">Arrears</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="table-light">
                        <td>
                          {{ usersData?.AdvancePay ? usersData.AdvancePay : 0 }}
                        </td>
                        <td>
                          {{ usersData?.ArrearsPay ? usersData.ArrearsPay : 0 }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 mt-3 mt-md-0">
        <Notifications />
      </div>
    </div>
  </div>
</template>
<style>
.top-small-boxes small {
  font-size: 72%;
}
.top-small-boxes .numb {
  margin-top: 0.5em;
}
.dashboard-user-box .avatar {
  width: 3em;
  height: 3em;
  /* font-size: 17px; */
}
.dashboard-section .tab-hr {
  border: 1px solid var(--color-1);
}
.dashboard-section .text-on-hover:hover {
  color: var(--color-1) !important;
}
</style>
<script>
import axios from "axios";
import moment from "moment";
import Notifications from "@/components/admin/sections/dashboard/notifications/Notifications";
import EditAccount from "@/components/admin/sections/dashboard/EditAccount";
import AddAdmin from "@/components/admin/sections/dashboard/AddAdmin";
export default {
  components: { Notifications, EditAccount, AddAdmin },
  data() {
    return {
      userTime: null,
      userID: null,
      data: [],
      usersData: null,
      hours: null,
      activeStudentsCount: null,
      vacationStudentsCount: null,
      inactiveStudentsCount: null,
      activeTeachersCount: null,
      inactiveTeachersCount: null,
      vacationTeachersCount: null,
      displayData: false,
      isEmailEnabled: true,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("waraqaPanelToken");
      location.reload();
    },
    getUserData() {
      if (!localStorage.getItem("waraqaPanelToken")) {
        return (this.isAuthorized = false);
      }
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("waraqaPanelToken");
      axios
        .get("https://dashboard.waraqaweb.com/auth/v1/path11")
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/admin");
          }
          (this.userID = res.data.data[0].id), (this.data = res.data.data[0]);

          this.getHoursAndStudentsNum();
          this.getDueInvoices();
          this.displayData = true;
        })
        .catch(() => {
          this.$router.push("/admin");
        });
    },
    getHoursAndStudentsNum() {
      let queryReq = { params: { userType: "Admin" } };
      axios
        .get(
          "https://dashboard.waraqaweb.com/api/v1/client/classes/path0",
          queryReq
        )
        .then((res) => {
          if (res.data.success) {
            this.usersData = res.data.rows[0];
          }
        })
        .catch(() => {
          this.$router.push("/admin");
        });
    },
    getDueInvoices() {
      axios
        .get("https://dashboard.waraqaweb.com/api/v1/client/hours/path0")
        .then((res) => {
          if (res.data.success) {
            let rows = res.data.rows;
            let due = 0;
            for (let i = 0; i < rows.length; i++) {
              let hours = parseInt(rows[i].hours ? rows[i].hours : 0);
              let paidHours = parseInt(
                rows[i].paidHours ? rows[i].paidHours : 0
              );
              if (hours > paidHours) {
                due += paidHours - hours;
              }
            }
            this.usersData["dueInvoice"] = Math.abs(due / 60);
          }
        })
        .catch(() => {
          this.$router.push("/admin");
        });
    },
    getEmailsStatus() {
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/emails/path2";
      axios
        .get(url)
        .then((res) => {
          this.isEmailEnabled = res.data.status;
        })
        .catch((e) => console.log(e));
    },
    enableEmails() {
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/emails/path1";
      axios.post(url, { enable: this.isEmailEnabled });
    },
  },
  created() {
    this.getUserData();
    this.getEmailsStatus();
    this.userTime = moment().format("HH:mm");
  },
};
</script>
