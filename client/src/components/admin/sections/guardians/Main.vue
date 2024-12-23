<template>
  <div class="position-relative">
    <!-- Section Header -->
    <div class="d-flex justify-content-between flex-wrap">
      <h3 class="section-title">Guardians</h3>
      <!-- Search -->
      <div class="col-12 col-md-3">
        <div class="d-flex position-relative align-items-center">
          <input
            type="text"
            class="form-control"
            v-model="search"
            @keyup="getData()"
            placeholder="Search"
          />
          <div
            class="f-color-1 rounded px-3 position-absolute py-1"
            style="right: 7px"
          >
            <small><i class="fas fa-search"></i></small>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="payReq"
      @click="sendPayReq"
      class="f-color-4 opacity-75 opacity-100-on-hover text-decoration-underline"
    >
      Send a payment request "Postpaid guardians"?
      {{ payReqSent ? " (Sent)" : " (Not sent yet!)" }}
    </div>

    <!-- Table -->
    <div
      class="mt-4 b-color-0 box-shadow-style px-md-2 py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-3_3 d-flex mb-4">
          <small class="col-1 ms-1"> </small>
          <small class="col-3">Name</small>
          <small class="col-2">Registered</small>
          <small class="col-3">Email</small>
          <small class="col-1">Hours</small>
          <small class="col-1">Students</small>
          <!-- <small class="col-1">Info</small> -->
        </div>
        <div v-for="(row, i) in data" :key="row.id" class="table-row py-1">
          <span
            class="position-absolute"
            style="margin-top: 22.5px; left: -10px"
            >{{ i + 1 + pagination.offset }}</span
          >

          <div
            @click="
              $router.push({ name: 'GuardianInfo', params: { id: row.id } })
            "
            class="rowTable p-2 d-flex f-color-3"
          >
            <span class="col-1">
              <img
                v-if="row.picture"
                :src="row.picture"
                class="avatar-img rounded-circle"
                alt="student picture"
              />
              <span v-else class="avatar">{{
                row.name.charAt(0).toUpperCase()
              }}</span>
            </span>
            <span class="col-3">{{ row.name }}</span>
            <span class="col-2">{{
              moment(row.createdAt).format("ddd, D MMM YYYY")
            }}</span>
            <span class="col-3">{{ row.email }}</span>
            <span
              :class="[
                (row.savedPaidHours || 0) / 60 - (row.hours || 0) / 60 < 1
                  ? 'f-color-4'
                  : '',
                'col-1',
              ]"
              >{{
                (
                  (row.savedPaidHours || 0) / 60 -
                  (row.hours || 0) / 60
                ).toFixed(2)
              }}</span
            >
            <!-- <span :class="[(row.savedPaidHours/60)-(row.hours/60)<1 || !row.hours ? 'f-color-4':'','col-1']">{{row.hours? ((row.savedPaidHours/60)-(row.hours/60)).toFixed(2):0}}</span> -->
            <span class="col-1">{{ row.studentsCount }}</span>
            <!-- <div class="col-1">
              <router-link
                :to="{ name: 'GuardianInfo', params: { id: row.id } }"
                class="f-color-1"
                ><i class="fas fa-eye"></i
              ></router-link>
            </div> -->
          </div>
        </div>
        <!-- Alerts -->
        <div class="mt-4">
          <div
            v-if="alerts.success"
            class="text-start text-md-center alert text-center alert-success"
          >
            {{ alerts.success }}
          </div>
          <div
            v-else-if="alerts.error"
            class="text-start text-md-center alert text-center alert-warning"
          >
            {{ alerts.error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <vue-awesome-paginate
      style="margin-top: 20px"
      :total-items="pageCount"
      :items-per-page="offsetNum"
      :max-pages-shown="5"
      :current-page="pagination.page"
      :on-click="onClickHandler"
    />
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment-timezone";
export default {
  props: ["offsetNum"],
  components: {},
  data() {
    return {
      data: [],
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      filters: {
        one: false,
        two: false,
        three: false,
      },
      payReq: false,
      payReqSent: false,
      pageCount: 0,
      pagination: {
        page: 1,
        offset: 0,
      },
      search: "",
      userDateTime: moment().format("YYYY-MM-DD HH:mm"),
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    pagiTransitions(sense) {
      if (sense == "back") {
        if (this.pagination.offset > 0) {
          this.pagination.offset = this.pagination.offset - this.offsetNum;
          this.pagination.page--;
        }
      } else if (sense == "next") {
        this.pagination.offset = this.pagination.offset + this.offsetNum;
        this.pagination.page++;
      }
      this.getData();
    },
    getData() {
      let queryReq = {
        params: { search: this.search, offset: this.pagination.offset },
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/guardians/path0";
      axios
        .get(url, queryReq)
        .then((res) => {
          if (!res.data.success) {
            this.data = [];
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
          this.pageCount = this.data[0].fullCount;
        })
        .catch(() => {
          console.log("Guardians/Error catched");
        });
    },
    sendPayReq() {
      let url =
        "https://dashboard.waraqaweb.com/api/v1/admin/bills/guardian/path7";
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.payReqSent = true;
        })
        .catch(() => {
          console.log("Sent PayReq/Error catched");
        });
    },
    onClickHandler(page) {
      this.pagination.offset = (page - 1) * this.offsetNum;
      this.pagination.page = page;
      this.getData();
    },
  },
  created() {
    this.getData();

    //PayDay for guardians(postpaid)
    let today = moment().format("YYYY-MM-DD");
    let lastDayOfThisMonth = moment().format("YYYY-MM-28");
    if (today == lastDayOfThisMonth) {
      this.payReq = true;
    }
  },
};
</script>
<style scoped></style>
