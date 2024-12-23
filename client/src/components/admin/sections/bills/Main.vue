<template>
  <div class="position-relative">
    <!-- Section Header -->
    <div class="d-flex justify-content-between flex-wrap">
      <h3 class="section-title">Billing</h3>

      <!-- Section Tabs-->
      <div class="col-md-5">
        <ul class="list-unstyled m-0 d-flex f-color-3_3">
          <li
            :class="[firstTab === 'guardian' ? 'f-color-1' : '', 'text-on-hover']"
            @click="switchTab('guardian')"
          >
            Guardians
            <hr v-if="firstTab === 'guardian'" class="tab-hr mt-1" />
          </li>
          <li
            :class="[firstTab === 'teacher' ? 'f-color-1' : '', 'ms-5 text-on-hover']"
            @click="switchTab('teacher')"
          >
            Teachers
            <hr v-if="firstTab === 'teacher'" class="tab-hr mt-1" />
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

    <Guardians
      v-if="firstTab === 'guardian'"
      ref="guardian"
      :offsetNum="offsetNum"
      :params="$route.params"
    />
    <Teachers
      v-else
      ref="teacher"
      :offsetNum="offsetNum"
      :params="$route.params"
    />
  </div>
</template>

<script>
import Guardians from "@/components/admin/sections/bills/guardians/Guardians";
import Teachers from "@/components/admin/sections/bills/teachers/Teachers";

export default {
  props: ["offsetNum"],
  components: {
    Guardians,
    Teachers,
  },
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      firstTab: "guardian", // Default tab
      search: "",
    };
  },
  methods: {
    searchFun() {
      this.firstTab === "guardian"
        ? this.$refs.guardian.getData(this.search)
        : this.$refs.teacher.getData(this.search);
      // Update search term in the URL for persistence
      this.$router.push({ query: { ...this.$route.query, search: this.search } });
    },
    switchTab(tabName) {
      this.firstTab = tabName;
      // Update the URL with the current tab name
      this.$router.push({ query: { ...this.$route.query, tap: tabName } });
    },
  },
  created() {
    if (this.$route.query.tap) {
      this.firstTab = this.$route.query.tap; // Read the tab name from the URL
    }
    if (this.$route.query.search) {
      this.search = this.$route.query.search; // Set the search term from the URL if available
    }
  },
};
</script>
