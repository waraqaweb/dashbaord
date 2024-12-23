<template>
  <div class="position-relative">
    <!-- Section Header -->
    <div class="d-flex justify-content-between flex-wrap">
      <h3 class="section-title">Students</h3>
      <!-- Search -->
      <div class="mt-4 mt-md-0 col-12 col-md-3">
        <div class="d-flex position-relative align-items-center">
          <input
            v-if="!filters.four"
            type="text"
            class="form-control"
            v-model="search"
            @keyup="getData()"
            placeholder="Search"
          />
          <input
            v-else
            type="text"
            class="form-control"
            v-model="search"
            @keyup="getWiatListStudents()"
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
    <!-- Filters & Search -->
    <div class="mt-4 d-flex justify-content-md-between flex-wrap">
      <!-- Filters -->
      <div class="section-filters">
        <ul class="list-unstyled m-0 d-flex f-color-1 flex-wrap">
          <li
            :class="[filters.one ? 'opacity-100' : '', 'px-2']"
            @click="
              (pageCount = 0),
                (pagination.offset = 0),
                (pagination.page = 1),
                (filters.one = !filters.one),
                (filters.two = false),
                (filters.three = false),
                (filters.four = false);
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
                (filters.three = false),
                (filters.four = false);
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
                (filters.three = !filters.three),
                (filters.four = false);
              getData();
            "
          >
            <small>Vacation</small>
          </li>
          <li
            :class="[filters.four ? 'opacity-100' : '', 'ms-2 ms-md-3 px-2']"
            @click="
              (pageCount = 0),
                (pagination.offset = 0),
                (pagination.page = 1),
                (filters.one = false),
                (filters.two = false),
                (filters.three = false),
                (filters.four = !filters.four);
              filters.four ? getWiatListStudents() : getData();
            "
          >
            <small>Leads</small>
          </li>
        </ul>
      </div>

      <div
        class="f-color-1 text-on-hover"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#addStudentModal"
      >
        <i class="fas fa-plus"></i> Add
        <span class="d-none d-md-inline">Leads</span>
      </div>
      <AddStudent />
    </div>

    <!-- Main Table -->
    <div
      v-if="!filters.four"
      class="mt-4 b-color-0 box-shadow-style px-md-2 py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-3_3 d-flex mb-4">
          <small class="col-1 ms-1"> </small>
          <small class="col-2">Full Name</small>
          <small class="col-3">Email</small>
          <small class="col-2">Guardian</small>
          <small class="col-1">Hours</small>
          <small class="col-2">Status</small>
          <!-- <small class="col-1">More</small> -->
        </div>
        <div v-for="(row, i) in data" :key="row.id" class="table-row py-1">
          <span
            class="position-absolute"
            style="margin-top: 22.5px; left: -10px"
            >{{ i + 1 + pagination.offset }}</span
          >
          <div
            @click="
              $router.push({
                name: 'StudentInfo',
                params: {
                  id: row.id,
                },
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
            <span class="col-2"
              >{{ row.name
              }}<small
                v-if="Math.abs(moment().diff(row.startingDate, 'hours')) < 24"
                class="d-block f-color-1"
                >New</small
              ></span
            >
            <span class="col-3">{{ row.email }}</span>
            <span class="col-2">{{ row.guardianName }}</span>
            <span
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
              }}
            </span>

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
    <!-- Table-Leads -->
    <div
      v-else
      class="mt-4 b-color-0 box-shadow-style px-md-2 py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-3_3 d-flex mb-4">
          <small class="col-1">Employee</small>
          <small class="col-2">Full Name</small>
          <small class="col-2">Channel</small>
          <small class="col-2">Contact</small>
          <small class="col-2">Notes</small>
          <small class="col-2">Contact Date</small>
          <small class="col-1">edit</small>
        </div>
        <div v-for="row in data" :key="row.id" class="table-row py-3">
          <div class="px-2 d-flex f-color-3">
            <span class="col-1">{{ row.responsible }}</span>
            <span class="col-2">{{ row.name }}</span>
            <span class="col-2">{{ row.contactMethod }}</span>
            <span class="col-2">{{ row.contactInfo }}</span>
            <span class="col-2">{{ row.notes }}</span>
            <span class="col-2">{{
              moment(row.contactDate).format("ddd, D MMM YYYY, HH:mm")
            }}</span>
            <div class="col-1">
              <router-link
                :to="{ name: 'WaitListStudentInfo', params: { id: row.id } }"
                class="f-color-1"
                ><i class="fas fa-edit"></i
              ></router-link>
            </div>
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
      :current-page="pagination.page"
      :total-items="pageCount"
      :items-per-page="offsetNum"
      :max-pages-shown="5"
      :on-click="onClickHandler"
    />
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment-timezone";
import AddStudent from "@/components/admin/sections/students/AddStudent";

export default {
  props: ["offsetNum"],
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
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/students/path0";
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
    getWiatListStudents() {
      let queryReq = {
        params: { search: this.search, offset: this.pagination.offset },
      };

      let url = "https://dashboard.waraqaweb.com/api/v1/admin/students/path7";
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
          console.log("students/Error catched");
        });
    },
    onClickHandler(page) {
      this.pagination.offset = (page - 1) * this.offsetNum;
      this.pagination.page = page;
      this.getData();
      if (this.filters.four) {
        this.getClassesOfMonth();
      } else {
        this.getData();
      }
    },
  },
  created() {
    if (this.$route.query.filter == "four") {
      this.filters.one = false;
      this.filters.four = true;
      this.getWiatListStudents();
    } else {
      this.getData();
    }
  },
};
</script>
