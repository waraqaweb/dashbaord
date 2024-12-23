<template>
  <div v-if="displayData" class="information">
    <div class="f-color-1">
      <small
        class="text-on-hover"
        @click="$router.go(-1)"
      >
        <i class="fas fa-long-arrow-alt-left"></i> Back
      </small>
    </div>
    <div>
      <!-- Avatar and Edit  -->
      <div class="mt-5 d-flex justify-content-end">
        <!-- Avatar -->
        <!-- Edit -->
        <div
          class="edit"
          data-bs-toggle="modal"
          data-bs-target="#EditInvoiceModal"
        >
          <i class="fas fa-edit"></i>
        </div>
        <div style="margin-left: 15px" class="edit" @click="deleteData">
          <i class="fas fa-trash"></i>
        </div>
        <Edit
          :invoiceID="invoiceID"
          :totalHours="totalHours"
          :classesIDs="classesIDs"
        />
      </div>
      <!-- Main Information :  -->
      <div>
        <div class="col-12 col-md-3 mb-2">
          <span class="d-block f-color-2">Main Information :</span>
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Guardian :</small>
            <span class="info-content">{{ data[0].guardianName }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Invoice number :</small>
            <span class="info-content">{{
              data[0].invoiceNumber ? data[0].invoiceNumber : "Not Selected"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Invoice date :</small>
            <span
              class="info-content clickable-date"
              @click="copyToClipboard(moment(data[0].activatedAt).format('D MMM YYYY'))"
            >
              {{ moment(data[0].activatedAt).format("ddd, D MMM YYYY") }}
            </span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Transfer fess :</small>
            <span class="info-content">{{
              data[0].transferFess ? data[0].transferFess : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Extra amount :</small>
            <span class="info-content">{{
              data[0].extraAmount ? data[0].extraAmount : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Number of paid hours :</small>
            <span class="info-content">{{
              data[0].savedPaidHours ? data[0].savedPaidHours / 60 : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Total amount paid :</small>
            <span class="info-content">{{
              data[0].totalAmountPaid ? data[0].totalAmountPaid : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Payment method :</small>
            <span class="info-content">{{
              data[0].paymentMethod == 0
                ? "Not Selected"
                : data[0].paymentMethod == 1
                ? "PayPal"
                : data[0].paymentMethod == 2
                ? "Bank account"
                : data[0].paymentMethod == 3
                ? "Ria"
                : data[0].paymentMethod == 4
                ? "Western Union"
                : "Other"
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Payment date :</small>
            <span
              class="info-content clickable-date"
              @click="copyToClipboard(moment(data[0].paymentDate).format('D MMM YYYY'))"
            >
              {{
                data[0].paymentDate
                  ? moment(data[0].paymentDate).format("ddd, D MMM YYYY")
                  : "Not Selected"
              }}
            </span>
          </div>
        </div>
      </div>
      <!-- Paid status -->
      <div
        v-if="data[0].paid != 1"
        class="mt-4 col-12 col-md-4 f-color-4 b-color-4_1 py-1 px-2"
      >
        This invoice has not yet been paid.
      </div>
      <div class="d-flex justify-content-end mb-3">
      <!-- PDF Download Icon -->
      <div @click="exportToPDF" class="icon-button me-3" style="cursor: pointer;">
        <i class="fas fa-file-pdf"></i>
      </div>

      <!-- Excel Download Icon -->
      <div @click="exportToExcel" class="icon-button" style="cursor: pointer;">
        <i class="fas fa-file-excel"></i>
      </div>
    </div>


      <!-- Classes that must be paid -->
      <div class="b-color-0 box-shadow-style mt-4">
        <div class="d-flex justify-content-end align-items-center flex-wrap">
          <div class="col-12 col-md-2 f-color-1 px-md-3 text-md-end">
            <span>Total hours: {{ (totalHours / 60).toFixed(2) }}</span>
            <br />
            <span class="pt-4"
              >Total fees:
              {{
                data[0].hoursPrice
                  ? (
                      (totalHours / 60) * data[0].hoursPrice +
                      data[0].transferPrice
                    ).toFixed(2)
                  : "Null"
              }}</span
            >
          </div>
        </div>
        <!-- Table -->
            <!-- Prepaid Classes Table -->
            <div
    v-if="data[0].paymentType == 1"
    class="mt-4 b-color-0 box-shadow-style py-3"
    style="overflow: hidden; overflow-x: auto"
  >
    <div style="min-width: 62em">

      <div class="px-2 table-colums f-color-1 d-flex mb-4">
        <small class="col-2">Student</small>
        <small class="col-2">Teacher</small>
        <small class="col-1">Class title</small>
        <small class="col-2">Class subject</small>
        <small class="col-1">Status</small>
        <small class="col-1">Duration</small>
        <small class="col-1">Info</small>
        <small class="col-1">Count</small>
        <small class="col-1">Date</small>
      </div>
      <div v-for="anClass in classes" :key="anClass.id" class="table-row py-3">
        <div class="px-2 d-flex f-color-3">
          <small class="col-2">{{ anClass.studentName }}</small>
          <small class="col-2">{{ anClass.teacherName }}</small>
          <small class="col-1">{{ anClass.classTitle }}</small>
          <small class="col-2">{{ anClass.subject }}</small>
          <small class="col-1">
            {{
              anClass.status == 1
                ? "Attended"
                : anClass.status == 4
                ? "Missed by student"
                : anClass.status == 0
                ? "Active"
                : anClass.status
            }}
          </small>
          <small class="col-1">{{ anClass.duration }}</small>
          <small class="col-1">
            <router-link
              :to="{ name: 'ClassInfo', params: { id: anClass.id } }"
              class="f-color-1"
              ><i class="fas fa-eye"></i
            ></router-link>
          </small>
          <small class="col-1">
            <div
              @click="
                changeCount(anClass.id, parseInt(anClass.countOnInvoice))
              "
              class="f-color-1"
            >
              <i
                :class="[parseInt(anClass.countOnInvoice) === 1 ? 'fas fa-minus' : 'fas fa-plus']"
              ></i>
            </div>
          </small>
          <small
            class="col-1 clickable-date"
            @click="copyToClipboard(moment(anClass.startingDate).format('ddd, D MMM YYYY'))"
          >
            {{ moment(anClass.startingDate).format("ddd, D MMM YYYY HH:mm") }}
          </small>
        </div>
      </div>
    </div>
  </div>

    <!-- Postpaid Classes Table -->
    <div
      v-else-if="data[0].paymentType == 2"
      class="mt-4 b-color-0 box-shadow-style py-3"
      style="overflow: hidden; overflow-x: auto"
    >
      <div style="min-width: 62em">
        <div class="px-2 table-colums f-color-1 d-flex mb-4">
          <small class="col-2">Student</small>
          <small class="col-2">Teacher</small>
          <small class="col-2">Class title</small>
          <small class="col-2">Class subject</small>
          <small class="col-2">Status</small>
          <small class="col-2">Date</small>
        </div>
        <div
          v-for="anClass in classes"
          :key="anClass.id"
          class="table-row py-3"
        >
          <div class="px-2 d-flex f-color-3">
            <small class="col-2">{{ anClass.studentName }}</small>
            <small class="col-2">{{ anClass.teacherName }}</small>
            <small class="col-2">{{ anClass.classTitle }}</small>
            <small class="col-2">{{ anClass.subject }}</small>
            <small
              :class="[
                anClass.status == 1 ? 'f-color-1' : 'f-color-4',
                'col-2',
              ]"
            >
              {{
                anClass.status == 1
                  ? "Attended"
                  : anClass.status == 4
                  ? "Missed by student"
                  : anClass.status
              }}
            </small>
            <small
              class="col-2 clickable-date"
              @click="copyToClipboard(moment(anClass.startingDate).format('ddd, D MMM YYYY'))"
            >
              {{ moment(anClass.startingDate).format("ddd, D MMM YYYY HH:mm") }}
            </small>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
    <!-- Alerts -->
    <div class="mt-4">
      <div
        v-if="alerts.success"
        class="text-center alert text-center alert-success"
      >
        {{ alerts.success }}
      </div>
      <div
        v-else-if="alerts.error"
        class="text-center alert text-center alert-warning"
      >
        {{ alerts.error }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Edit from "@/components/admin/sections/bills/guardians/Edit";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  components: { Edit },
  data() {
    return {
      displayData: false,
      loadingBtn: false,
      alerts: {
        success: null,
        error: null,
      },
      invoiceID: null,
      data: [],
      classes: [],
      classesIDs: null,
      totalHours: 0,
    };
  },
  methods: {
    // Format date using Moment.js
    moment(date) {
      return moment(date);
    },

    // Change class count on the invoice
    changeCount(classID, CurrentCountOnInvoice) {
      const url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path11/${classID}`;
      axios
        .patch(url, { CurrentCountOnInvoice })
        .then(() => {
          const objIndex = this.classes.findIndex((item) => item.id === classID);
          if (objIndex !== -1) {
            this.classes[objIndex].countOnInvoice = CurrentCountOnInvoice === 1 ? 2 : 1;
          }
          this.getData(true);
        })
        .catch((err) => console.error("Error updating class count:", err));
    },

    // Fetch main invoice data
    getData(isUpdateClasses = false) {
      const url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path2/${this.invoiceID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/admin/bills");
            this.alerts.error = res.data.msg;
            return;
          }
          this.alerts.error = null;
          this.data = res.data.rows;

          // Default payment method
          this.data[0].paymentMethod = this.data[0].paymentMethod || 0;

          // Fetch class data based on payment type
          if (this.data[0].paymentType === 1) {
            this.getPrepaidClasses(isUpdateClasses);
          } else if (this.data[0].paymentType === 2) {
            this.getPostPaidClasses();
          }

          this.displayData = true;
        })
        .catch(() => {
          console.error("Error fetching invoice data");
        });
    },

    // Fetch prepaid class data
    getPrepaidClasses(isUpdateClasses) {
      const url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path3/${this.invoiceID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.alerts.error = res.data.msg;
            return;
          }
          this.alerts.error = null;
          this.classes = res.data.rows;

          let invoiceHours = this.data[0].savedPaidHours;

          // Filter classes based on hours
          this.classes = this.classes.filter((row) => {
            if (parseInt(row.countOnInvoice) === 1) invoiceHours -= row.duration;
            return invoiceHours >= 0;
          });

          // Calculate total hours
          this.totalHours = this.classes.reduce((acc, row) => {
            if (parseInt(row.countOnInvoice) === 1) acc += row.duration;
            return acc;
          }, 0);

          // Collect class IDs
          this.classesIDs = this.classes.map((row) => row.id).join(",");

          // Update classes if required
          if (isUpdateClasses) {
            const updateUrl = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path4/${this.invoiceID}`;
            axios.post(updateUrl, {
              classesIDs: this.classesIDs,
              paid: this.data[0].paid,
            });
          }
        })
        .catch(() => {
          console.error("Error fetching prepaid class data");
        });
    },

    // Fetch postpaid class data
    getPostPaidClasses() {
      const url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path5/${this.invoiceID}`;
      const queryReq = {
        params: { InvoiceActivatedAt: this.data[0].activatedAt },
      };

      axios
        .get(url, queryReq)
        .then((res) => {
          if (!res.data.success) {
            this.alerts.error = res.data.msg;
            return;
          }
          this.alerts.error = null;
          this.classes = res.data.rows;

          // Calculate total hours
          this.totalHours = this.classes.reduce((acc, row) => {
            if (parseInt(row.countOnInvoice) === 1) acc += row.duration;
            return acc;
          }, 0);

          // Collect class IDs
          this.classesIDs = this.classes.map((row) => row.id).join(",");
        })
        .catch(() => {
          console.error("Error fetching postpaid class data");
        });
    },

    // Delete invoice
    deleteData() {
      this.alerts.error = null;
      this.alerts.success = null;

      if (window.confirm("Are you sure you want to delete this Invoice?")) {
        const url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/guardian/path6/${this.invoiceID}`;
        axios
          .delete(url)
          .then((res) => {
            if (!res.data.success) {
              this.alerts.error = res.data.msg;
              return;
            }
            this.alerts.success = res.data.msg;
            this.$router.push("/admin/bills");
          });
      }
    },

    // Copy text to clipboard
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        () => {
          const message = document.createElement("div");
          message.className = "copy-message";
          message.innerText = `Copied to clipboard: ${text}`;
          document.body.appendChild(message);
          setTimeout(() => message.remove(), 3000); // Auto-remove after 3 seconds
        },
        (err) => {
          console.error("Failed to copy text:", err);
        }
      );
    },

    exportToPDF() {
      const doc = new jsPDF();

      // Define the table columns
      const tableColumn = [
        "Student",
        "Teacher",
        "Class title",
        "Class subject",
        "Status",
        "Duration",
        "Date",
      ];

      const tableRows = [];

      // Loop through the classes and prepare rows
      this.classes.forEach((anClass) => {
        const status =
          anClass.status == 1
            ? "Attended"
            : anClass.status == 4
            ? "Missed by student"
            : anClass.status == 0
            ? "Active"
            : anClass.status;

        const row = [
          anClass.studentName,
          anClass.teacherName,
          anClass.classTitle,
          anClass.subject,
          status,
          anClass.duration,
          moment(anClass.startingDate).format("ddd, D MMM YYYY HH:mm"),
        ];
        tableRows.push(row);
      });

      // Add a header or text to the PDF
      doc.text("Expected classes in thirty days", 14, 15);
      // Add the table to the PDF
      doc.autoTable(tableColumn, tableRows, { startY: 20 });


      // Get the guardian's name (adjust based on your actual data structure)
      const guardianName = this.data[0].guardianName || "Unknown Guardian"; // Fallback if guardian name is not available

      // Save the PDF with the dynamic file name
      doc.save(`Waraqa classes details: ${guardianName}.pdf`);
    },
    exportToExcel() {
      // Prepare the worksheet data
      const worksheet = XLSX.utils.json_to_sheet(
        this.classes.map((anClass) => ({
          Student: anClass.studentName,
          Teacher: anClass.teacherName,
          "Class Title": anClass.classTitle,
          "Class Subject": anClass.subject,
          Status:
            anClass.status == 1
              ? "Attended"
              : anClass.status == 4
              ? "Missed by student"
              : anClass.status == 0
              ? "Active"
              : anClass.status,
          Duration: anClass.duration,
          Date: moment(anClass.startingDate).format("ddd, D MMM YYYY HH:mm"),
        }))
      );

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Classes");

      // Get the guardian's name (adjust based on your actual data structure)
      const guardianName = this.data[0].guardianName || "Unknown Guardian"; // Fallback if guardian name is not available

      // Write the workbook to a buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create a Blob and trigger download with the dynamic file name
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, `Waraqa classes details: ${guardianName}.xlsx`);
    },
  },

  // Fetch data on component creation
  created() {
    this.invoiceID = this.$route.params.id;
    this.getData();
  },
};
</script>


<style>
.icon-button {
  font-size: 24px; /* Adjust the icon size */
  padding: 10px;
  transition: transform 0.3s ease; /* Smooth scaling effect */
}

.icon-button:hover {
  transform: scale(1.1); /* Slightly enlarge the icon on hover */
}

.clickable-date {
  cursor: pointer; /* Change the cursor to a hand when hovered */
  transition: text-shadow 0.3s ease-in-out; /* Smooth transition for text-shadow */
}

.clickable-date:hover {
  color: green; /* Pinkish text-shadow */
}
.copy-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1A5F57;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.circle-Add {
  color: var(--color-4);
  background-color: var(--color-4_1);
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  border-radius: 50%;
  opacity: 0.8;
}
.circle-Add:hover,
.circle-Add:focus {
  color: var(--color-4_1);
  background-color: var(--color-4);
  opacity: 1;
  transition: 0.2s ease-in-out;
}
.active-star {
  color: rgb(255, 186, 58);
}
</style>
