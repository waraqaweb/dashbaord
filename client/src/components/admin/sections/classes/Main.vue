<template>
  <AddClass />
  <Reschedule />
  <DeleteClasses />
  <div class="position-relative">
    <!-- Section Header -->
    <div class="d-flex justify-content-between flex-wrap">
      <h3 class="col-md-1 section-title">Classes</h3>
      <!-- Section Tabs-->
      <div class="col-md-5">
        <ul class="list-unstyled m-0 d-flex f-color-3_3">
          <li
            :class="[!previousTab ? 'f-color-1' : '', 'text-on-hover']"
            @click="switchTab(false)"
          >
            New
            <hr v-if="!previousTab" class="tab-hr mt-1" />
          </li>
          <li
            :class="[previousTab ? 'f-color-1' : '', 'ms-5 text-on-hover']"
            @click="switchTab(true)"
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
                border-radius: 35%;
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
      <div class="col-6 col-md-3">
        <div class="d-flex position-relative align-items-center">
          <input
            type="text"
            class="form-control"
            v-model="search"
            @keyup="searchFun()"
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
      style="
        position: absolute;
        right: 5px;
        margin-top: 25px;
        display: flex;
        flex-direction: row;
      "
    >
      <div
        class="f-color-1 text-on-hover me-3"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#addClassModal"
      >
        <i class="fas fa-plus"></i> Create Class
      </div>
      <div
        class="f-color-2 opacity-75 me-3 opacity-100-on-hover"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#RescheduleClassesModal"
      >
        <i class="fas fa-history"></i> Reschedule
      </div>
      <div
        class="f-color-4 text-on-hover"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#DeleteClassesModal"
      >
        <i class="fas fa-trash"></i> Delete Classes
      </div>
    </div>
    <Previous
      v-if="previousTab"
      ref="previous"
      :offsetNum="offsetNum"
      :params="$route.query"
    />
    <Current
      v-else
      ref="current"
      :offsetNum="offsetNum"
      :params="$route.query"
    />
  </div>
</template>
<script>
import AddClass from "@/components/admin/sections/classes/AddClass";
import Reschedule from "@/components/admin/sections/classes/Reschedule";
import DeleteClasses from "@/components/admin/sections/classes/DeleteClasses";
import Previous from "@/components/admin/sections/classes/Previous";
import Current from "@/components/admin/sections/classes/Current";
import axios from "axios";

export default {
  props: ["offsetNum"],
  components: {
    AddClass,
    Reschedule,
    Previous,
    Current,
    DeleteClasses,
  },
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      previousTab: false, // Default to 'new'
      noReportCount: null,
      search: "",
    };
  },
  methods: {
    searchFun() {
      this.previousTab
        ? this.$refs.previous.getData(this.search)
        : this.$refs.current.getData(this.search);

      // Update the search term in the URL
      this.$router.push({ query: { ...this.$route.query, search: this.search } });
    },
    getReportCount() {
      const url = "https://dashboard.waraqaweb.com/api/v1/client/classes/path1";
      axios
        .get(url)
        .then((res) => {
          this.noReportCount = res.data.rows[0].noReportCount;
        })
        .catch(() => {
          console.error("Failed to fetch noReportCount.");
        });
    },
    switchTab(tabState) {
      this.previousTab = tabState;

      // Update the URL with the current tab state
      this.$router.push({ query: { ...this.$route.query, tap: tabState } });

      // Reset search when switching tabs
      this.search = "";
    },
  },
  created() {
    this.getReportCount();

    // Restore tab and search state from the URL
    if (this.$route.query.tap) {
      this.previousTab = JSON.parse(this.$route.query.tap);
    }
    if (this.$route.query.search) {
      this.search = this.$route.query.search;
    }
  },
};
</script>
