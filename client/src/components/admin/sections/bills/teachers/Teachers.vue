<template>
  <div class="position-relative">
    <!-- Filters & Search -->
    <div class="mt-4 d-flex justify-content-md-between flex-wrap">
      <!-- Filters -->
      <div class="section-filters">
        <ul class="list-unstyled m-0 d-flex flex-wrap f-color-1 mt-sm-0 mt-5">
          <li
            :class="[filters.one ? 'opacity-100' : '', 'px-2']"
            @click="
              pagination.offset = 0;
              pagination.page = 1;
              filters.one = true;
              filters.two = false;
              $router.push({ query: { ...$route.query, filter: 'unpaid' } });
              getData();
            "
          >
            <small>Paid</small>
          </li>
          <li
            :class="[filters.two ? 'opacity-100' : '', 'ms-2 ms-md-3 px-2']"
            @click="
              pagination.offset = 0;
              pagination.page = 1;
              filters.one = false;
              filters.two = true;
              $router.push({ query: { ...$route.query, filter: 'paid' } });
              getData();
            "
          >
            <small>Unpaid</small>
          </li>
        </ul>
      </div>
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
          <small class="col-2">Status</small>
        </div>
        <div v-for="(row, i) in data" :key="row.id" class="table-row py-1">
          <span class="position-absolute mt-3" style="left: -10px">{{
            i + 1 + pagination.offset
          }}</span>
          <div
            @click="
              $router.push({
                name: 'TeacherInvoiceInfo',
                params: {
                  id: row.id,
                  tap: false,
                  page: pagination.page,
                  offset: pagination.offset,
                  filter: Object.keys(filters).find(
                    (key) => filters[key] == true
                  ),
                },
              })
            "
            class="rowTable p-3 d-flex f-color-3"
          >
            <span class="col-2">{{ row.teacherName }}</span>
            <span class="col-2">{{
              row.paidHours ? (row.paidHours / 60).toFixed(2) : 0
            }}</span>
            <span class="col-2">{{
              data[0].paymentMethod == 0 || data[0].paymentMethod == null
                ? "Not Selected"
                : data[0].paymentMethod == 1
                ? "PayPal"
                : data[0].paymentMethod == 2
                ? "Bank account"
                : data[0].paymentMethod == 3
                ? "Ria"
                : data[0].paymentMethod == 4
                ? "Western Union"
                : "Other"
            }}</span>
            <span class="col-3">{{
              moment(row.activatedAt).format("ddd, D MMM YYYY")
            }}</span>
            <span :class="[row.paid == 1 ? 'f-color-1' : 'f-color-4', 'col-2']">
              {{ row.paid == 1 ? "Paid" : "Unpaid" }}
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
export default {
  props: ["offsetNum", "params"],
  data() {
    return {
      data: [],
      alerts: {
        success: null,
        error: null,
      },
      filters: {
        one: false,
        two: true,
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
    getData(search) {
      if (search) {
        this.search = search;
      }
      let status = this.filters.one ? 1 : 2;
      let queryReq = {
        params: {
          search: this.search,
          status: status,
          offset: this.pagination.offset,
        },
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/bills/path6";
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
          console.log("Teachers Bills/Error caught");
        });
    },
    onClickHandler(page) {
      this.pagination.offset = (page - 1) * this.offsetNum;
      this.pagination.page = page;
      this.$router.push({ query: { ...this.$route.query, page, offset: this.pagination.offset } });
      this.getData();
    },
  },
  created() {
    const { filter, page, offset } = this.$route.query;

    // Set filter based on URL query parameter
    if (filter) {
      this.filters.one = filter === "unpaid";
      this.filters.two = filter === "paid";
    }

    // Preserve pagination state if available in URL
    if (page) this.pagination.page = parseInt(page);
    if (offset) this.pagination.offset = parseInt(offset);

    this.getData();
  },
};
</script>
