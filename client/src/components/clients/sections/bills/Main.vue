<template>
  <div>
    <!-- Section Header -->
    <div>
      <h3 class="section-title">Bills</h3>
    </div>
    <Guardians v-if="userType == 'Guardian'" :offsetNum="offsetNum" />
    <Teachers
      v-else-if="userType == 'Teacher'"
      :offsetNum="offsetNum"
    />
  </div>
</template>

<script>
import Guardians from "@/components/clients/sections/bills/guardians/Guardians";
import Teachers from "@/components/clients/sections/bills/teachers/Teachers";
export default {
  props: ["offsetNum", "userType"],
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
    };
  },
};
</script>
