<template>
  <div class="b-color-0 box-shadow-style px-3 px-md-4 py-4">
    <span class="fw-bold f-color-1"
      >Notification
      <span
        v-if="messagesNotSeen"
        style="
          font-size: 15px;
          padding: 3px 6px;
          background-color: red;
          border-radius: 100%;
          color: white;
        "
      >
        {{ messagesNotSeen }}
      </span>
    </span>
    <ul class="mt-3 list-unstyled m-0 d-flex f-color-3_3">
      <li
        class="text-on-hover"
        @click="
          (all = true),
            (request = false),
            (classes = false),
            (invoice = false),
            (type = null);
          getNotification();
        "
      >
        <small
          >All
          <hr v-if="all" class="tab-hr mt-1"
        /></small>
      </li>
      <li
        class="ms-4 text-on-hover"
        @click="
          (all = false),
            (request = true),
            (classes = false),
            (invoice = false),
            (type = 1);
          getNotification();
        "
      >
        <small
          >Request
          <hr v-if="request" class="tab-hr mt-1"
        /></small>
      </li>
      <li
        class="ms-4 text-on-hover"
        @click="
          (all = false),
            (request = false),
            (classes = true),
            (invoice = false),
            (type = 2);
          getNotification();
        "
      >
        <small
          >Class
          <hr v-if="classes" class="tab-hr mt-1"
        /></small>
      </li>
      <li
        class="ms-4 text-on-hover"
        @click="
          (all = false),
            (request = false),
            (classes = false),
            (invoice = true),
            (type = 3);
          getNotification();
        "
      >
        <small
          >Invoice
          <hr v-if="invoice" class="tab-hr mt-1"
        /></small>
      </li>
    </ul>
    <!-- Display Notifications -->
    <div class="notifications-content px-1 px-md-2">
      <div
        v-for="notfi in data"
        :key="notfi"
        @mouseover="
          seenNotification(
            notfi.id,
            userType == 'Guardian' ? notfi.seenByGuardian : notfi.seenByTeacher
          )
        "
        :class="[
          (userType == 'Guardian' && notfi.seenByGuardian == 1) ||
          (userType == 'Teacher' && notfi.seenByTeacher == 1)
            ? 'opacity-100'
            : 'opacity-75 opacity-100-on-hover',
          'mt-2 py-4 px-3 rounded',
        ]"
      >
        <div class="d-flex justify-content-between">
          <span class="fw-bold d-block"
            >{{
              notfi.type == 1
                ? "Request"
                : notfi.type == 2
                ? "Class"
                : notfi.type == 3
                ? "Invoice"
                : ""
            }}
            Notification</span
          >
          <small
            ><i
              class="fas fa-times opacity-50 opacity-100-on-hover"
              @click="
                deleteNotificationID = notfi.id;
                deleteNotification();
              "
            ></i
          ></small>
        </div>
        <small style="font-size: 75%">{{
          moment(notfi.createdAt).format("ddd, D MMM YYYY, HH:mm")
        }}</small>
        <small
          class="d-block"
          v-html="userType == 'Teacher' ? notfi.teacherMsg : notfi.guardianMsg"
        ></small>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import axios from "axios";
export default {
  props: ["userID", "userType"],
  data() {
    return {
      alerts: {
        success: null,
        error: null,
      },
      type: null,

      all: true,
      request: false,
      classes: false,
      invoice: false,
      deleteNotificationID: null,
      data: [],
      messagesNotSeen: 1,
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    getNotification() {
      this.messagesNotSeen = 0;
      let queryReq = {
        params: {
          userType: this.userType,
          userID: this.userID,
          type: this.type,
        },
      };
      let url =
        "https://dashboard.waraqaweb.com/api/v1/admin/notifications/path1";
      axios
        .get(url, queryReq)
        .then((res) => {
          if (!res.data.success) {
            this.data = [];
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.messagesNotSeen = res.data.rows.filter(
            (obj) =>
              obj[
                this.userType == "Guardian" ? "seenByGuardian" : "seenByTeacher"
              ] == 0
          ).length;
        })
        .catch(() => {
          console.log("Notifications /Error catched");
        });
    },
    seenNotification(id, status) {
      if (!status) {
        let data = {};
        if (this.userType == "Guardian") {
          data.seenByGuardian = 1;
        } else if (this.userType == "Teacher") {
          data.seenByTeacher = 1;
        }
        let url = `https://dashboard.waraqaweb.com/api/v1/admin/notifications/path3/${id}`;
        axios
          .post(url, data)
          .then((res) => {
            if (!res.data.success) {
              this.data = [];
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.error = null;
            this.getNotification();
          })
          .catch(() => {
            console.log("Notifications /Error catched");
          });
      }
    },
    deleteNotification() {
      this.alerts.error = null;
      this.alerts.success = null;
      axios
        .delete(
          `https://dashboard.waraqaweb.com/api/v1/admin/notifications/path2/${this.deleteNotificationID}`
        )
        .then((res) => {
          if (!res.data.success) {
            return (this.alerts.error = res.data.msg);
          }
          this.getNotification();
          // this.alerts.success = res.data.msg;
          // this.$router.push('/admin/classes');
        });
      // if (window.confirm("Are you sure you want to delete this Class?")) {
      // }
    },
  },
  created() {
    this.getNotification();
  },
};
</script>
