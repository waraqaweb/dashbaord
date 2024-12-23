<template>
  <div>
    <!-- Filters & Search -->
    <div class="mt-4 d-flex justify-content-md-between flex-wrap">
      <!-- Filters -->
      <div class="section-filters">
        <ul class="list-unstyled m-0 d-flex f-color-1">
          <li
            :class="[filters.one ? 'opacity-100' : '', 'px-2']"
            @click="
              (pageCount = 0),
                (pagination.offset = 0),
                (pagination.page = 1),
                (filters.one = !filters.one),
                (filters.two = false);
              getData();
            "
          >
            <small>Paid</small>
          </li>
          <li
            :class="[filters.two ? 'opacity-100' : '', 'ms-2 ms-md-3 px-2']"
            @click="
              (pageCount = 0),
                (pagination.offset = 0),
                (pagination.page = 1),
                (filters.one = false),
                (filters.two = !filters.two);
              getData();
            "
          >
            <small>Unpaid</small>
          </li>
        </ul>
      </div>
      <!-- Search -->
      <!-- <div class="mt-4 mt-md-0 col-12 col-md-4">
                <div class="d-flex position-relative align-items-center">
                    <input type="text" class="form-control" v-model="search" @keyup="getData()" placeholder="Search by teacher's name">
                    <div class="f-color-1 rounded px-3 position-absolute py-1" style="right: 7px;">
                    <small><i class="fas fa-search"></i></small></div>
                </div>
            </div> -->
    </div>

    <!-- Table -->
    <div
      class="mt-4 b-color-0 box-shadow-style px-md-2 py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-3_3 d-flex mb-4">
          <small class="col-2">Teacher</small>
          <small class="col-2">Paid Hours</small>
          <small class="col-2">Payment method</small>
          <small class="col-3">Date</small>
          <small class="col-2">status</small>
          <!-- <small class="col-1">More</small> -->
        </div>
        <div v-for="row in data" :key="row.id" class="table-row py-3">
          <div
            @click="
              $router.push({
                name: 'ClientTeacherInvoiceInfo',
                params: { id: row.id },
              })
            "
            class="rowTable p-2 d-flex f-color-3"
          >
            <span class="col-2">{{ row.teacherName }}</span>
            <span class="col-2">{{
              row.paidHours ? (row.paidHours / 60).toFixed(2) : 0
            }}</span>
            <span class="col-2">{{
              row.paymentMethod ? row.paymentMethod : "Not selected"
            }}</span>
            <span class="col-3">{{
              moment(row.activatedAt).format("ddd, D MMM YYYY")
            }}</span>
            <span :class="[row.paid == 1 ? 'f-color-1' : 'f-color-4', 'col-2']">
              {{ row.paid == 1 ? "Paid" : "Unpaid" }}
            </span>
            <!-- <div class="col-1">
              <router-link
                :to="{
                  name: 'ClientTeacherInvoiceInfo',
                  params: { id: row.id },
                }"
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
      :on-click="onClickHandler"
    />
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment-timezone";
export default {
  props: ["offsetNum"],
  data() {
    return {
      data: [],
      alerts: {
        success: null,
        error: null,
      },
      filters: {
        one: false,
        two: false,
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
      }
      let queryReq = {
        params: {
          search: this.search,
          status: status,
          offset: this.pagination.offset,
        },
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/teacher/bills/path0";
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
          console.log("Teachers Bills/Error catched");
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
