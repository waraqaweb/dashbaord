<template>
    <div>
      <!-- Header section for Students page -->
      <div class="d-flex justify-content-between flex-wrap">
        <div>
          <!-- Section title -->
          <h3 class="section-title">Students</h3>
        </div>
  
        <!-- Search bar for filtering students -->
        <div class="mt-4 mt-md-0 col-12 col-md-3">
          <div class="d-flex position-relative align-items-center">
            <!-- Input field bound to 'search' variable with v-model -->
            <!-- Triggers 'getData' method on keyup to filter results -->
            <input
              type="text"
              class="form-control"
              v-model="search"
              @keyup="getData()"
              placeholder="Search by student's name"
            />
            <!-- Search icon positioned within the input -->
            <div
              class="f-color-1 rounded px-3 position-absolute py-1"
              style="right: 7px"
            >
              <small><i class="fas fa-search"></i></small>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Filters and Add Student button section -->
      <div class="mt-4 d-flex justify-content-md-between flex-wrap">
        <!-- Filters for different student statuses -->
        <div class="section-filters flex-wrap">
          <ul class="list-unstyled m-0 d-flex f-color-1">
            <!-- Filter: Active students -->
            <!-- Toggles 'filters.one' and resets other filters -->
            <!-- Calls 'getData' to fetch filtered data -->
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
            <!-- Filter: Inactive students -->
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
            <!-- Filter: Students on vacation -->
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
  
        <!-- Add Student button (visible only for Guardian users) -->
        <div
          v-if="userType == 'Guardian'"
          class="f-color-1 text-on-hover"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addStudentModal"
        >
          <!-- Plus icon and text -->
          <i class="fas fa-plus"></i> Add
          <span class="d-none d-md-inline">Student</span>
        </div>
        <!-- AddStudent component rendered only for Guardian users -->
        <AddStudent v-if="userType == 'Guardian'" />
      </div>
  
      <!-- Table section for displaying student data -->
      <div
        class="mt-4 b-color-0 box-shadow-style px-md-2 py-3"
        style="overflow: hidden; overflow-x: auto"
      >
        <!-- Table layout with column headers -->
        <div style="min-width: 50em">
          <!-- Column names -->
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
  
          <!-- Rows generated dynamically from 'data' array -->
          <div v-for="row in data" :key="row.id" class="table-row py-1">
            <div
              @click="this.userType != 'Teacher' && 
                $router.push({
                  name: 'ClientStudentInfo',
                  params: { id: row.id },
                })
              "
              class="rowTable p-2 d-flex f-color-3"
            >
              <!-- Picture or avatar based on student data -->
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
              <!-- Student name -->
              <span :class="[this.userType == 'Teacher' ? 'col-3' : 'col-2']">{{
                row.name
              }}</span>
              <!-- Student email (if not Teacher user type) -->
              <span class="col-3" v-if="this.userType != 'Teacher'">{{
                row.email
              }}</span>
              <!-- Guardian name -->
              <span class="col-2">{{ row.guardianName }}</span>
              <!-- Remaining hours calculation -->
              <span
                v-if="this.userType != 'Teacher'"
                :class="[((row.savedPaidHours || 0) / 60 - (row.attendedHours || 0) / 60) < 1
                  ? 'f-color-4'
                  : '',
                'col-1']"
              >
                {{ ((row.savedPaidHours || 0) / 60 - (row.attendedHours || 0) / 60).toFixed(2) }}
              </span>
              <!-- Time Zone (for Teacher users) -->
              <small class="col-4" v-else>{{ row.timeZone }}</small>
              <!-- Status displayed based on 'row.status' -->
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
  
          <!-- Success and Error alerts -->
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
  
      <!-- Pagination component -->
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
  