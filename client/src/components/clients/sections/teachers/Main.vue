<template>
  <div>
    <!-- Section Header -->
    <div>
      <h3 class="section-title">Teachers</h3>
    </div>
    <!-- Filters & Search -->
    <div class="mt-4 d-flex justify-content-md-between flex-wrap">
      <!-- Filters -->
      <div class="section-filters">
        <ul class="list-unstyled m-0 d-flex f-color-1">
          <li
            :class="[filters.one ? 'opacity-100' : '', 'px-2']"
            @click="
              (filters.one = !filters.one),
                (filters.two = false),
                (filters.three = false);
              getData();
            "
          >
            <small>Active</small>
          </li>
          <li
            :class="[filters.two ? 'opacity-100' : '', 'ms-2 ms-md-3 px-2']"
            @click="
              (filters.one = false),
                (filters.two = !filters.two),
                (filters.three = false);
              getData();
            "
          >
            <small>Inactive</small>
          </li>
          <li
            :class="[filters.three ? 'opacity-100' : '', 'ms-2 ms-md-3 px-2']"
            @click="
              (filters.one = false),
                (filters.two = false),
                (filters.three = !filters.three);
              getData();
            "
          >
            <small>Vacation</small>
          </li>
        </ul>
      </div>
      <!-- Search -->
      <div class="mt-4 mt-md-0 col-12 col-md-4">
        <div class="d-flex position-relative align-items-center">
          <input
            type="text"
            class="form-control"
            v-model="search"
            @keyup="getData()"
            placeholder="Search by Teacher's name or Email"
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
    <!-- Table -->
    <div
      class="mt-4 b-color-0 box-shadow-style px-md-2 py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-3_3 d-flex mb-4">
          <small class="col-3">Picture</small>
          <small class="col-3">Name</small>
          <small class="col-1">Students</small>
          <small class="col-1">Hours</small>
          <small class="col-2">Class Link</small>
          <small class="col-2">Status</small>
        </div>
        <div v-for="row in data" :key="row.id" class="table-row py-3">
          <div class="px-2 d-flex f-color-3">
            <span class="col-3">
              <img
                v-if="row.picture"
                :src="row.picture"
                class="avatar-img rounded-circle"
                alt="teacher picture"
              />
              <span v-else class="avatar">{{
                row.name.charAt(0).toUpperCase()
              }}</span>
            </span>
            <span class="col-3">{{ row.name }}</span>
            <span class="col-1">{{
              row.studentsCount ? row.studentsCount : 0
            }}</span>
            <span :class="[row.hours < 1 ? 'f-color-4' : '', 'col-1']">{{
              row.hours ? (row.hours / 60).toFixed(2) : 0
            }}</span>
            <span class="col-2"
              ><a :href="row.classLink" target="_blank"
                ><i class="fas fa-play f-color-1"></i></a
            ></span>
            <span
              :class="[row.status == 1 ? 'f-color-1' : 'f-color-4', 'col-2']"
            >
              {{
                row.status == 1
                  ? "Active"
                  : row.status == 2
                  ? "Inactive"
                  : "Vacation"
              }}
            </span>
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
    <div class="mt-4 pagination d-flex align-items-center">
      <div class="icon" @click="pagiTransitions('back')">
        <i class="fas fa-long-arrow-alt-left"></i>
      </div>
      <div class="page-num mx-3">
        <small>{{ pagination.page }}</small>
      </div>
      <div class="icon" @click="pagiTransitions('next')">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
    </div>
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
      let status;
      if (this.filters.one) {
        status = 1;
      } else if (this.filters.two) {
        status = 2;
      } else if (this.filters.three) {
        status = 3;
      }
      let queryReq = {
        params: {
          search: this.search,
          status: status,
          offset: this.pagination.offset,
        },
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/teachers/path0";
      axios
        .get(url, queryReq)
        .then((res) => {
          if (!res.data.success) {
            this.data = [];
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;
        })
        .catch(() => {
          console.log("Previous/Error catched");
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
