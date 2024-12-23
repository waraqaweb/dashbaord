<template>
  <div
    class="modal fade"
    id="ChoosePicModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-start">
        <header
          class="b-color-2 f-color-0 py-3 px-4 d-flex justify-content-between"
        >
          <h5 class="m-0">Select Image</h5>
          <button
            type="button"
            class="f-color-0 border-0 background-none"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="fas fa-times"></i>
          </button>
        </header>
        <div class="mt-3 px-3 px-md-5 py-5">
          <input type="file" ref="avatar" @change="selectFile" hidden />
          <div v-if="cropperImage">
            <cropper ref="cropper" @change="change" :src="cropperImage" />
          </div>
          <div v-if="height">
            height: {{ height }}
            <br />
            width: {{ width }}
          </div>

          <div style="text-align: center; margin-top: 20px">
            <span
              class="btn btn-primary mx-2"
              @click="this.$refs.avatar.click()"
              >Upload image</span
            >
            <span class="btn btn-primary" @click="cropImage">Done</span>
          </div>
        </div>
        <span ref="goBack" data-bs-toggle="modal" :data-bs-target="name"></span>
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
  </div>
</template>
<script>
import moment from "moment-timezone";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  components: {
    Cropper,
  },
  props: ["name"],
  data() {
    return {
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      cropperImage: null,
      height: null,
      width: null,
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    change({ coordinates }) {
      this.height = coordinates.height;
      this.width = coordinates.width;
    },
    selectFile(event) {
      // Update Preview Start
      let files = event.target.files;
      if (!files.length) {
        console.log("file input is empty");
        return;
      }
      let reader = new FileReader();
      reader.onload = (event) => {
        this.cropperImage = event.target.result;
      };
      reader.readAsDataURL(files[0]);
    },
    cropImage() {
      this.alerts.error = "";
      this.alerts.success = "";
      const result = this.$refs.cropper.getResult();
      // if (result.canvas.height) {

      // }
      //   const newTab = window.open();

      //   // for testing open the result in a new tab
      //   newTab.document.body.innerHTML = `<img src="${result.canvas.toDataURL(
      //     "image/jpeg"
      //   )}"></img>`;

      console.log(result.canvas);
      console.log(result.coordinates);

      if (Math.abs(result.coordinates.width - result.coordinates.height) > 50) {
        return (this.alerts.error =
          "The difference in vertical and horizontal lengths cannot be more than 50px.");
      }
      fetch(result.canvas.toDataURL("image/jpeg"))
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "dot.jpeg", blob);
          console.log(file);
          this.$emit("changeImage", {
            file,
            src: result.canvas.toDataURL("image/jpeg"),
          });
          this.$refs.goBack.click();
        });

      //   console.log(result.canvas.toDataURL("image/jpeg"));
      //   this.$emit("changeImage", result.canvas.toDataURL("image/jpeg"));
    },
  },
  // created() {
  //   console.log("test");
  // },
};
</script>
