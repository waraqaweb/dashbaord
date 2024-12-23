<template>
  <div>
    <div v-if="isAuthorized">
      <Home />
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Home from "@/views/admin/Home";
import Login from "@/views/admin/Login";
export default {
  components: {
    Home,
    Login,
  },
  data() {
    return {
      isAuthorized: false,
    };
  },
  created() {
    this.reCheckAuth();
  },
  methods: {
    setAuthorized() {
      this.isAuthorized = true;
    },

    reCheckAuth() {
      if (!localStorage.getItem("waraqaPanelToken")) {
        return (this.isAuthorized = false);
      }
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("waraqaPanelToken");
      axios
        .get("https://dashboard.waraqaweb.com/auth/v1/path11")
        .then((res) => {
          if (res.data.success) {
            return (this.isAuthorized = true);
          }
          this.$router.push("/admin");
        })
        .catch(() => {
          this.$router.push("/admin");
        });
    },
  },
};
</script>
