<template>
  <div v-if="displayData" class="information">
    <div class="f-color-1">
      <small class="text-on-hover" @click="$router.go(-1)"
        ><i class="fas fa-long-arrow-alt-left"></i> Back</small
      >
    </div>
    <div>
      <!-- Avatar and Edit  -->
      <div class="mt-5 d-flex justify-content-between">
        <!-- Avatar -->
        <div class="d-flex align-items-center">
          <div class="me-3">
            <img
              v-if="data[0].picture"
              :src="data[0].picture"
              class="avatar-img rounded-circle"
              alt="Guardian picture"
            />
            <span v-else class="avatar">{{
              data[0].name.charAt(0).toUpperCase()
            }}</span>
          </div>
          <div>
            <span class="d-block f-color-3">{{ data[0].name }}</span>
            <small class="f-color-3_3">Guardian</small>
          </div>
        </div>
        <!-- Edit & Login -->
        <div>
          <!-- Edit -->
          <div
            class="edit"
            data-bs-toggle="modal"
            data-bs-target="#editGuardianModal"
          >
            <i class="fas fa-edit"></i>
          </div>
          <Edit :userID="this.userID" />
          <!-- Login -->
          <div class="mt-2 edit" @click="accessAccount">
            <i class="fas fa-user-lock"></i>
          </div>
        </div>
      </div>
      <!-- Personal Information  -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Personal Information:</span>
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Birthday :</small>
            <span class="info-content">{{
              data[0].birthday
                ? moment(data[0].birthday).format("YYYY-MM-DD")
                : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Language :</small>
            <span class="info-content">{{
              data[0].language ? data[0].language : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Email :</small>
            <span class="info-content">{{
              data[0].email ? data[0].email : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Phone :</small>
            <span class="info-content">{{
              data[0].phone ? data[0].phone : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Address :</small>
            <span class="info-content">{{
              data[0].address ? data[0].address : "Not Selected"
            }}</span>
          </div>

          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">TimeZone :</small>
            <span class="info-content">{{
              data[0].timeZone ? data[0].timeZone : "Not Selected"
            }}</span>
          </div>
        </div>
      </div>
      <!-- General Information : -->
      <div class="mt-5 overflow-hidden">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">General Information :</span>
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Status :</small>
            <span class="info-content">{{
              data[0].status == 1
                ? "Active"
                : data[0].status == 2
                ? "Inactive"
                : "Vacation"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Students :</small>
            <span class="info-content">{{
              data[0].studentsCount ? data[0].studentsCount : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Payment Method :</small>
            <span class="info-content">{{
              data[0].paymentMethod ? data[0].paymentMethod : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Hours price :</small>
            <span class="info-content">{{
              data[0].hoursPrice ? data[0].hoursPrice : "Not Selected"
            }}</span>
          </div>

          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Transfer price :</small>
            <span class="info-content">{{
              data[0].transferPrice != null
                ? data[0].transferPrice
                : "Not Selected"
            }}</span>
          </div>

          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Payment type :</small>
            <span class="info-content">{{
              data[0].paymentType == 1
                ? "Prepaid"
                : data[0].paymentType == 2
                ? "Postpaid"
                : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Last time paid :</small>
            <span class="info-content">{{
              data[0].lastPaid
                ? moment(data[0].lastPaid).format("YYYY-MM-DD")
                : "Not Selected"
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete -->
    <hr class="my-5 opacity-0" />
    <div class="mt-5 d-flex justify-content-end align-items-center">
      <span class="delete-btn px-3 py-2" @click="deleteUser">Delete</span>
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
  </div>
</template>

<script>
import axios from "axios";
import Tz from "@/components/Tz.json";
import Edit from "@/components/admin/sections/guardians/Edit";
import moment from "moment";
export default {
  components: { Edit },
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      userID: null,
      TimeZoneList: Tz,
      data: [],
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    accessAccount() {
      let data = {
        email: this.data[0].email,
      };
      let url = "https://dashboard.waraqaweb.com/auth/v1/path6";
      axios
        .post(url, data)
        .then((res) => {
          if (!res.data.success) {
            this.loadingBtn = false;
            return (this.alerts.error = res.data.msg);
          }
          localStorage.setItem("waraqaToken", res.data.token);
          this.$router.push("/");
        })
        .catch(() => {
          return (this.alerts.error = "Sorry, failed to access acount!");
        });
    },
    getUserData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/guardians/path1/${this.userID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/admin/guardians");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.displayData = true;
        })
        .catch(() => {
          console.log("Guardian Info/Error catched");
        });
    },
    deleteUser() {
      this.alerts.error = null;
      this.alerts.success = null;
      if (window.confirm("Are you sure you want to delete this Guardian?")) {
        axios
          .delete(
            `https://dashboard.waraqaweb.com/api/v1/admin/guardians/path3/${this.userID}`
          )
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;
            this.$router.push("/admin/guardians");
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
