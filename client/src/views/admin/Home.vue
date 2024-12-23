<template>
  <!-- <div>Home Admin <span class="f-color-1" @click="logout()">Log Out</span></div> -->
  <div class="d-flex">
    <!-- Admin Side-Bar -->

    <i
      v-if="!displaySidebarOnMobile"
      :class="['fa', 'fa-bars', 'fixed-top', 'fa-2x', 'p-2', 'showMenu']"
      @click="toggleDisplay"
    ></i>

    <div
      :class="[
        displaySidebarOnMobile ? '' : 'hideSidebar ',
        'aside-admin-bar col-md-1 b-color-1 f-color-0 text-center',
      ]"
      @click="toggleDisplay"
    >
      <div class="py-5 overflow-scroll h-100">
        <div>
          <ul class="list-unstyled routes d-inline">
            <li>
              <router-link to="/admin" class="d-block py-3 px-2">
                <div class="logo">
                  <img
                    src="@/assets/logo.jpg"
                    class="img-fluid mb-2"
                    style="width: 2.5em"
                  />
                </div>
                <span class="d-block">Home</span></router-link
              >
            </li>
            <li>
              <router-link to="/admin/teachers" class="d-block py-3 px-2">
                <i class="fad fa-chalkboard-teacher"></i>
                <span class="d-block">Teachers</span></router-link
              >
            </li>
            <li>
              <router-link to="/admin/guardians" class="d-block py-3 px-2">
                <i class="fas fa-user-friends"></i>
                <span class="d-block">Guardians</span></router-link
              >
            </li>
            <li>
              <router-link to="/admin/students" class="d-block py-3 px-2">
                <i class="fas fa-user-graduate"></i>
                <span class="d-block">Students</span></router-link
              >
            </li>
            <li>
              <router-link to="/admin/classes" class="d-block py-3 px-2">
                <i class="fad fa-chalkboard"></i>
                <span class="d-block">Classes</span></router-link
              >
            </li>
            <li>
              <router-link to="/admin/bills" class="d-block py-3 px-2">
                <i class="fas fa-file-invoice-dollar"></i>
                <span class="d-block">Bills</span></router-link
              >
            </li>
            <li>
              <router-link to="/admin/expenses" class="d-block py-3 px-2">
                <i class="fas fa-money-check-edit-alt"></i>

                <span class="d-block">Expenses</span></router-link
              >
            </li>
            <li>
              <router-link to="/admin/library" class="d-block py-3 px-2">
                <i class="fas fa-books"></i>
                <span class="d-block">Library</span></router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Other Sections -->
    <div class="col-10 me-md-5 p-0 container-fluid">
      <div class="px-3 py-5 p-lg-2" style="overflow: hidden; overflow-x: auto">
        <router-view :offsetNum="30"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      displaySidebarOnMobile: false,
    };
  },
  methods: {
    // Will true only in mobile screen
    toggleDisplay(event) {
      this.displaySidebarOnMobile = !this.displaySidebarOnMobile;
      // On click show
      if (
        event.target.classList.contains("aside-show") ||
        event.target.classList.contains("aside-hide")
      ) {
        event.target.classList.toggle("aside-show");
        event.target.classList.toggle("aside-hide");
      }
    },
    logout() {
      localStorage.removeItem("waraqaPanelToken");
      location.reload();
    },
  },
};
</script>
<style>
.aside-admin-bar {
  z-index: 1;
  height: 100%;
  position: fixed;
}
.logo img {
  width: 4em !important;
}
.aside-admin-bar > div::-webkit-scrollbar {
  display: none;
}
.aside-admin-bar .routes li {
  cursor: pointer;
}

.aside-admin-bar .routes li a {
  line-height: 30px;
}

.router-link-exact-active {
  background-color: #ffffff25;
}
.aside-admin-bar .routes li a i {
  font-size: 23px;
}
.showMenu {
  display: none;
}
@media (max-width: 768px) {
  .showMenu {
    display: block;
  }
  .aside-admin-bar {
    /* transition: .3s ease-in-out; */
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
  }
  .aside-show::before {
    font-weight: 900;
    content: "\f0c9";
    padding: 5px 9px;
  }
  .aside-hide::before {
    font-weight: 600;
    content: "\f00d";
    padding: 5px 11px;
  }
  .aside-show::before,
  .aside-hide::before {
    font-family: "Font Awesome 5 Free";
    position: absolute;
    right: -33%;
    color: var(--color-0);
    top: 0.5em;
    background-color: var(--color-1);
  }
  .hideSidebar {
    margin-left: -6em;
  }
}

/* ########################################## Section pages Start ###### */

.edit i {
  font-size: 70%;
  padding: 8px;
  border-radius: 3px;
  background-color: var(--color-4_1);
  color: var(--color-4);
  opacity: 0.7;
  cursor: pointer;
}
.edit i:hover {
  transition: 0.3s ease-in-out;
  opacity: 1;
}
.table-colums {
  background-color: #e9ecef;
  color: #000 !important;
  padding: 20px 0;
  border-radius: 2px;
  margin-bottom: 1em !important;
}
.table-row div {
  align-items: center;
}
.table-row .fas {
  opacity: 0.7;
}
.table-row .fas:hover {
  cursor: pointer;
  transition: 0.25s ease-in-out;
  opacity: 1;
}
.tab-hr {
  border: 1px solid var(--color-1);
  border-radius: 3px;
  opacity: 1;
}
.section-filters li {
  background-color: var(--color-1_1);
  /* width: 100px; */
  text-align: center;
  padding: 5px 0;
  border-radius: 2px;
  opacity: 0.5;
  cursor: pointer;
}
.section-filters li:hover {
  transition: 0.15s ease-in-out;
  opacity: 0.8;
}
.section-title {
  color: #5e5d6a;
}

.avatar {
  background-color: var(--color-4_1);
  color: var(--color-4);
  border-radius: 50%;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 21px;
  display: flex;
  font-size: 16px;
  justify-content: center;
  align-items: center;
}
.avatar,
.avatar-img {
  width: 3em;
  height: 3em;
}
.pagination .page-num {
  background-color: var(--color-2);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-0);
  font-size: 13px;
}
.pagination .icon {
  color: var(--color-2);
  cursor: pointer;
  opacity: 0.8;
  /* font-size:20px */
}
.pagination .icon:hover {
  transition: 0.25s ease-in-out;
  opacity: 1;
}
</style>
