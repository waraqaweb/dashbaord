<template>
  <div>
    <!-- Section Header -->
    <div class="d-flex justify-content-between flex-wrap">
      <h3 class="col-md-1 section-title">Classes</h3>
      <!-- Section Tabs-->
      <div class="col-md-5">
        <ul class="list-unstyled m-0 d-flex f-color-3_3">
          <li
            :class="[!previousTab ? 'f-color-1' : '', 'text-on-hover']"
            @click="previousTab = false"
          >
            New
            <hr v-if="!previousTab" class="tab-hr mt-1" />
          </li>
          <li
            :class="[previousTab ? 'f-color-1' : '', 'ms-5 text-on-hover']"
            @click="previousTab = true"
          >
            <div
              v-if="noReportCount"
              style="
                position: absolute;
                margin-top: -15px;
                margin-left: -20px;
                font-size: 14px;
                padding: 1.9px 5px;
                background-color: red;
                border-radius: 100%;
                color: white;
              "
            >
              {{ noReportCount }}
            </div>
            Old
            <hr v-if="previousTab" class="tab-hr mt-1" />
          </li>
        </ul>
      </div>
      <!-- Search -->
      <div class="col-12 col-md-3">
        <div class="d-flex position-relative align-items-center">
          <input
            type="text"
            class="form-control"
            v-model="search"
            @keyup="searchFun()"
            placeholder="Search by class title or id"
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
    <Previous
      v-if="previousTab"
      ref="previous"
      :userType="userType"
      :offsetNum="offsetNum"
      :params="$route.query"
    />
    <Current
      v-else
      :userType="userType"
      :offsetNum="offsetNum"
      :params="$route.query"
      ref="current"
    />
  </div>
</template>

<script>
import Previous from "@/components/clients/sections/classes/Previous";
import Current from "@/components/clients/sections/classes/Current";
import axios from "axios";

export default {
  props: ["userType", "offsetNum"],
  components: {
    Previous,
    Current,
  },
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      previousTab: false,
      noReportCount: null,
    };
  },
  methods: {
    searchFun() {
      this.previousTab
        ? this.$refs.previous.getData(this.search)
        : this.$refs.current.getData(this.search);
    },
    getReportCount() {
      let queryReq = {
        params: {
          userType: this.userType,
        },
      };
      const url = "https://dashboard.waraqaweb.com/api/v1/client/classes/path1";
      axios
        .get(url, queryReq)
        .then((res) => {
          this.noReportCount = res.data.rows[0].noReportCount;
        })
        .catch(() => {
          console.log("Previous/Error catched");
        });
    },
  },
  created() {
    if (this.userType == "Teacher") this.getReportCount();
    if (this.$route.query.tap) {
      this.previousTab = JSON.parse(this.$route.query.tap);
    }
    this.$watch("previousTab", () => {
      this.$router.replace({ query: null });
      this.search = "";
    });
  },
};
</script>
