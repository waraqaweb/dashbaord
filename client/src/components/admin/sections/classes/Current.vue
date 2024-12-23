<template>
  <div>
    <!-- Table -->
    <div
      class="mt-5 b-color-0 box-shadow-style px-md-2 py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-3_3 d-flex mb-4">
          <small class="col-3">Date</small>
          <small class="col-2">Student</small>
          <small class="col-2">Teacher</small>
          <small class="col-2">Subject</small>
          <small class="col-2">Duration</small>
          <small class="col-1">More</small>
        </div>
        <div v-for="row in data" :key="row.id" class="table-row py-1">
          <div
            @click="
              $router.push({
                name: 'ClassInfo',
                params: {
                  id: row.id,
                },
                query: {
                  tap: false,
                  page: pagination.page,
                  offset: pagination.offset,
                },
              })
            "
            class="rowTable p-2 d-flex f-color-3"
          >
            <span class="col-3" style="font-family: Merienda">
              <span
                style="
                  margin-left: 35px;
                  font-weight: 900;
                  color: #4c4a4c;
                  font-family: Merienda;
                "
              >
                {{ moment(row.startingDate).format("hh:mm A") }}
              </span>
              <br />
              {{ moment(row.startingDate).format("ddd, MMM D, YYYY") }}
            </span>

            <span class="col-2">{{ row.studentName }}</span>
            <span class="col-2">{{ row.teacherName }}</span>
            <span class="col-2">{{ row.subject }}</span>

            <span class="col-2">{{ row.duration }} m</span>

            <div class="col-1">
              <!-- Example single danger button -->
              <div class="btn-group dropstart">
                <div
                  @click.stop=""
                  data-bs-toggle="dropdown"
                  class="btn"
                  style="border-radius: 2px"
                >
                  <i class="fa fa-lg fa-ellipsis-v"></i>
                </div>

                <!-- Action -->
                <ul @click.stop="" class="dropdown-menu">
                  <li>
                    <button @click="deleteData(row.id)" class="dropdown-item">
                      <i
                        data-bs-toggle="dropdown"
                        class="fas fa-trash px-2"
                      ></i>
                      Delete
                    </button>
                  </li>

                  <li>
                    <button
                      @click="
                        remindUser({
                          userType: 'Student',
                          classID: row.id,
                          userID: row.studentID,
                        })
                      "
                      class="dropdown-item"
                    >
                      <i class="fas fa fa-bell px-2" aria-hidden="true"></i>

                      Remind student
                    </button>
                  </li>
                  <li>
                    <button
                      @click="
                        remindUser({
                          userType: 'Teacher',
                          classID: row.id,
                          userID: row.teacherID,
                        })
                      "
                      class="dropdown-item"
                    >
                      <i class="fas fa fa-bell px-2" aria-hidden="true"></i>

                      Remind teacher
                    </button>
                  </li>
                </ul>
              </div>
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
      :total-items="pageCount"
      :items-per-page="offsetNum"
      :max-pages-shown="5"
      :on-click="onClickHandler"
      :current-page="pagination.page"
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
    getData(search) {
      if (search != null) {
        this.search = search;
      }
      let queryReq = {
        params: {
          date: this.userDateTime,
          type: "",
          search: this.search,
          offset: this.pagination.offset,
        },
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/classes/path1";
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
          console.log("Current/Error catched");
        });
    },
    deleteData(id) {
      this.alerts.error = null;
      this.alerts.success = null;
      if (window.confirm("Are you sure you want to delete this Class?")) {
        axios
          .delete(
            `https://dashboard.waraqaweb.com/api/v1/admin/classes/path6/${id}`
          )
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;
            this.getData();
          });
      }
    },
    remindUser(data) {
      this.alerts.error = null;
      this.alerts.success = null;

      let url = `https://dashboard.waraqaweb.com/api/v1/admin/classes/path9`;
      axios
        .post(url, data)
        .then((res) => {
          window.scrollTo(
            0,
            document.body.scrollHeight || document.documentElement.scrollHeight
          );
          if (!res.data.success) {
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.success = res.data.msg;
        })
        .catch(() => {
          console.log("Error catched");
        });
    },
    onClickHandler(page) {
      this.pagination.offset = (page - 1) * this.offsetNum;
      this.pagination.page = page;
      this.getData();
    },
  },
  created() {
    if (this.params.tap) {
      this.pagination.page = this.params.page;
      this.pagination.offset = this.params.offset;
    }
    this.getData();
  },
};
</script>
