<template>
  <div class="position-relative">
    <!-- Filters & Search -->
    <div class="mt-4 d-flex justify-content-between flex-wrap">
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

      <div
        class="f-color-1 text-on-hover position-relative"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#CreateInvoiceModal"
      >
        <i class="fas fa-plus"></i> Create Invoice
      </div>
    </div>

    <CreateInvoice />
    <!-- Table -->
    <div
      class="mt-4 b-color-0 box-shadow-style px-md-2 py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-3_3 d-flex mb-4">
          <small class="col-2">Guardian</small>
          <small class="col-2">Invoice Number</small>
          <small class="col-2">Paid Hours</small>
          <small class="col-2">Date</small>
          <small class="col-2">status</small>
          <small class="col-1">Sent</small>

          <!-- <small class="col-1">More</small> -->
        </div>
        <div v-for="(row, i) in data" :key="row.id" class="table-row py-3">
          <span class="position-absolute mt-3" style="left: -10px">{{
            i + 1 + pagination.offset
          }}</span>
          <div
            @click="
              $router.push({
                name: 'GuardianInvoiceInfo',
                params: {
                  id: row.id,
                  tap: true,
                  page: pagination.page,
                  offset: pagination.offset,
                  filter: Object.keys(filters).find(
                    (key) => filters[key] == true
                  ),
                },
              })
            "
            class="rowTable py-3 px-2 d-flex f-color-3"
          >
            <span class="col-2">{{ row.guardianName }}</span>
            <span class="col-2">{{
              row.invoiceNumber != null ? row.invoiceNumber : "null"
            }}</span>
            <span class="col-2">
              {{ row.savedPaidHours / 60 }} Hour
              <!-- {{
                row.paymentMethod == 0
                  ? "Not Selected"
                  : row.paymentMethod == 1
                  ? "PayPal"
                  : row.paymentMethod == 2
                  ? "Bank account"
                  : row.paymentMethod == 3
                  ? "Ria"
                  : row.paymentMethod == 4
                  ? "Western Union"
                  : "Other"
              }} -->
            </span>
            <span class="col-2">{{
              moment(
                row.paymentType == 1 ? row.createdAt : row.activatedAt
              ).format("ddd, D MMM YYYY")
            }}</span>

            <span :class="[row.paid == 1 ? 'f-color-1' : 'f-color-4', 'col-2']">
              {{ row.paid == 1 ? "Paid" : "Unpaid" }}
            </span>

           <div
                :class="[
                  'col-1',
                  row.isSent == 1 ? 'sentButtonChecked' : 'sentButtonNotChecked',
                ]"
                @click.stop="sentInvoice(row.id, row.isSent == 1 ? true : false)"
              >
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
import CreateInvoice from "@/components/admin/sections/bills/CreateInvoice";

export default {
  components: {
    CreateInvoice,
  },
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
    sentInvoice(id, isSent) {
      console.log(id);
      let url = `https://dashboard.waraqaweb.com/api/v1/guardian/bills/path1/${id}`;
      axios
        .patch(url, { isSent })
        .then((res) => {
          if (!res.data.success) {
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          const index = this.data.findIndex((obj) => obj.id == id);
          this.data[index].isSent = isSent ? 0 : 1;
        })
        .catch((e) => console.log(e));
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
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/bills/path0";
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
          console.log("Guardians Bills/Error catched");
        });
    },
    onClickHandler(page) {
      this.pagination.offset = (page - 1) * this.offsetNum;
      this.pagination.page = page;
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

<style scoped>
.sentButtonChecked {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5rem;
  background-color: #05ae13;
}
.sentButtonNotChecked {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5rem;
  background-color: lightgray;
}
.sentButtonNotChecked:hover {
  background-color: rgb(107, 107, 107);
}
.sentButtonChecked:hover {
  background-color: #04520b;
}
</style>
