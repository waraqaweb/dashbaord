<template>
  <div>
    <div v-if="teacherAuthorized || guardianAuthorized">
      <Home :userType="userType" />
    </div>
    <div v-else>
      <Auth />
    </div>
  </div>
</template>
<script>
import Home from "@/views/client/Home";
// import TeacherHome from '@/views/client/teacher/Home';
// import GuardianHome from '@/views/client/guardian/Home';
import Auth from "@/views/client/Auth";
import axios from "axios";
export default {
  components: {
    Home,
    Auth,
  },
  data() {
    return {
      userType: null,
      teacherAuthorized: false,
      guardianAuthorized: false,
      paymentType: null, //For guardian
      guardianID: null,
    };
  },
  methods: {
    setAuthorized(userType) {
      if (userType == "Guardian") {
        this.guardianAuthorized = true;
        this.userType = "Guardian";
      } else if (userType == "Teacher") {
        this.teacherAuthorized = true;
        this.userType = "Teacher";
      }
      this.reCheckAuth();
    },
    // To select which components shown (teacher, guardian, or login )
    reCheckAuth() {
      axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("waraqaToken");
      axios
        .get("https://dashboard.waraqaweb.com/auth/v1/path2")
        .then((res) => {
          if (res.data.success) {
            let userType = res.data.userType;
            if (userType == "Guardian") {
              this.paymentType = res.data.data[0].paymentType;
              this.guardianID = res.data.data[0].id;

              this.guardianAuthorized = true;
              this.userType = "Guardian";
            } else if (userType == "Teacher") {
              this.teacherID = res.data.data[0].id;

              this.teacherAuthorized = true;
              this.userType = "Teacher";
            }

            //PayDay for Teachers && guardians(postpaid)
            let url;
            if (this.userType == "Guardian" && this.paymentType == 2) {
              url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/guardian/path8/${this.guardianID}`;
            } else if (this.userType == "Teacher") {
              url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/teachers/path11/${this.teacherID}`;
            }
            axios.post(url);
          }
        })
        .catch(() => {
          this.$router.push("/");
        });
    },
  },
  created() {
    this.reCheckAuth();
  },
};
</script>
