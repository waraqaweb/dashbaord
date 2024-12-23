<template>
  <div>
    <!-- Section Header -->
    <div class="d-flex justify-content-between flex-wrap">
      <div>
        <h3 class="section-title">Students</h3>
      </div>

      <!-- Search -->
      <div class="mt-4 mt-md-0 col-12 col-md-3">
        <div class="d-flex position-relative align-items-center">
          <input
            type="text"
            class="form-control"
            v-model="search"
            @keyup="getData()"
            placeholder="Search by studen't name"
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
    <!-- Filters & Search -->
    <div class="mt-4 d-flex justify-content-md-between flex-wrap">
      <!-- Filters -->
      <div class="section-filters flex-wrap">
        <ul class="list-unstyled m-0 d-flex f-color-1">
          <li
            :class="[filters.one ? 'opacity-100' : '', 'px-2']"
            @click="
              (pageCount = 0),
                (pagination.offset = 0),
                (pagination.page = 1),
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
              (pageCount = 0),
                (pagination.offset = 0),
                (pagination.page = 1),
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
              (pageCount = 0),
                (pagination.offset = 0),
                (pagination.page = 1),
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

      <div
        v-if="userType == 'Guardian'"
        class="f-color-1 text-on-hover"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#addStudentModal"
      >
        <i class="fas fa-plus"></i> Add
        <span class="d-none d-md-inline">Student</span>
      </div>
      <AddStudent v-if="userType == 'Guardian'" />
    </div>

    <!-- Table -->
    <div
      class="mt-4 b-color-0 box-shadow-style px-md-2 py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-3_3 d-flex mb-4">
          <small class="col-1">Picture</small>
          <small :class="[this.userType == 'Teacher' ? 'col-3' : 'col-2']"
            >Name</small
          >
          <small class="col-3" v-if="this.userType != 'Teacher'">Email</small>
          <small class="col-2">Guardian</small>
          <small class="col-1" v-if="this.userType != 'Teacher'">Hours</small>
          <small class="col-4" v-else>Time Zone</small>
          <small class="col-2">Status</small>
        </div>
        <div v-for="row in data" :key="row.id" class="table-row py-1">
          <div
            @click="
              this.userType != 'Teacher' &&
                $router.push({
                  name: 'ClientStudentInfo',
                  params: { id: row.id },
                })
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
            <span :class="[this.userType == 'Teacher' ? 'col-3' : 'col-2']">{{
              row.name
            }}</span>
            <span class="col-3" v-if="this.userType != 'Teacher'">{{
              row.email
            }}</span>
            <span class="col-2">{{ row.guardianName }}</span>
            <span
              v-if="this.userType != 'Teacher'"
              :class="[
                (row.savedPaidHours || 0) / 60 - (row.attendedHours || 0) / 60 <
                1
                  ? 'f-color-4'
                  : '',
                'col-1',
              ]"
              >{{
                (
                  (row.savedPaidHours || 0) / 60 -
                  (row.attendedHours || 0) / 60
                ).toFixed(2)
              }}</span
            >

            <small class="col-4" v-else>{{ row.timeZone }}</small>
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
import AddStudent from "@/components/clients/sections/students/AddStudent";

export default {
  props: ["userType", "offsetNum"],
  components: {
    AddStudent,
  },
  data() {
    return {
      data: [],
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      filters: {
        one: true,
        two: false,
        three: false,
      },
      pageCount: 0,
      pagination: {
        page: 1,
        offset: 0,
      },
      search: "",
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
      let url =
        this.userType == "Teacher"
          ? "https://dashboard.waraqaweb.com/api/v1/teacher/students/path0" //Teacher
          : "https://dashboard.waraqaweb.com/api/v1/teacher/students/path1"; //Guardian
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("waraqaToken");
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
          console.log(this.data);
        })
        .catch(() => {
          console.log("students/Error catched");
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
  },
};
</script>
