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
          :totalHours="data[0].teachingHours"
          :autoCancelationReq="data[0].autoCancelationReq"
          :autoBonus="data[0].autoBonus"
        />
      </div>
      <!-- Main Information :  -->
      <div class="mt-5">
        <div class="col-12 col-md-3 mb-1">
          <span class="d-block f-color-2">Invoice Details</span>
        </div>
        <div class="row flex-wrap">
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Teacher :</small>
            <span class="info-content">{{ data[0].teacherName }}</span>
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
            <span class="info-content">{{
              moment(data[0].activatedAt).format("ddd, D MMM YYYY")
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Cancelation requests :</small>
            <span class="info-content">{{
              data[0].cancelationReq
                ? data[0].cancelationReq
                : data[0].autoCancelationReq
                ? data[0].autoCancelationReq
                : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Bonus :</small>
            <span class="info-content">{{
              data[0].bonus
                ? data[0].bonus
                : data[0].autoBonus
                ? data[0].autoBonus
                : 0
            }}</span>
          </div>
          <div
            class="mt-3 col-12 col-md-6 col-lg-4 d-flex justify-content-between"
          >
            <small class="info-title">Number of paid hours :</small>
            <span class="info-content">{{
              data[0].paidHours ? (data[0].paidHours / 60).toFixed(2) : 0
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
              data[0].paymentMethod == 0 || data[0].paymentMethod == null
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
            <span class="info-content">{{
              data[0].paymentDate
                ? moment(data[0].paymentDate).format("ddd, D MMM YYYY")
                : "Not Selected"
            }}</span>
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
      <!-- Periodic evaluations list -->
      <div class="b-color-0 box-shadow-style">
        <div class="d-flex justify-content-end align-items-center flex-wrap">
          <div class="col-12 col-md-4 f-color-1 px-md-3 text-md-end">
            <span>Total classes hours: {{ (totalHours / 60).toFixed(2) }}</span>
            <br />
            <span
              >Total teaching hours:
              {{ (data[0].teachingHours / 60).toFixed(2) }}</span
            >
          </div>
        </div>
        <!-- Table -->
        <div
          class="mt-4 b-color-0 box-shadow-style py-3"
          style="overflow: hidden; overflow-x: auto"
        >
          <div style="min-width: 62em">
            <div class="px-2 table-colums f-color-1 d-flex mb-4">
              <small class="col-2">Student</small>
              <small class="col-2">Teacher</small>
              <small class="col-2">Status</small>
              <small class="col-1">Duration</small>
              <small class="col-1">Info</small>
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
                <small class="col-1">{{ anClass.duration }}</small>
                <small class="col-1">
            <router-link
              :to="{ name: 'ClassInfo', params: { id: anClass.id } }"
              class="f-color-1"
              ><i class="fas fa-eye"></i
            ></router-link>
          </small>
                <small class="col-2">{{
                  moment(anClass.startingDate).format("ddd, D MMM YYYY HH:mm")
                }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script> 
import axios from "axios";
import moment from "moment";
import Edit from "@/components/admin/sections/bills/teachers/Edit";
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
      totalHours: 0,
    };
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    
    getData() {
      let url = `https://dashboard.waraqaweb.com/api/v1/admin/bills/path7/${this.invoiceID}`;
      axios
        .get(url)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push("/admin/bills");
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.data = res.data.rows;

          this.getInvoiceClasses();
          this.displayData = true;
        })
        .catch(() => {
          console.log("Invoice Info/Error caught");
        });
    },
    getInvoiceClasses() {
      let queryReq = {
        params: {
          teacherID: this.data[0].teacherID,
          InvoiceActivatedAt: this.data[0].activatedAt,
        },
      };
      let url = "https://dashboard.waraqaweb.com/api/v1/admin/bills/path8";
      axios
        .get(url, queryReq)
        .then((res) => {
          if (!res.data.success) {
            // this.$router.push('/admin/bills');
            return (this.alerts.error = res.data.msg);
          }
          this.alerts.error = null;
          this.classes = res.data.rows;
          this.totalHours = 0; // Re-initialize
          this.classes.forEach(
            (row) => (this.totalHours = this.totalHours + row.duration)
          );
        })
        .catch(() => {
          console.log("Invoice Info/Error caught");
        });
    },
    deleteData() {
      this.alerts.error = null;
      this.alerts.success = null;
      if (window.confirm("Are you sure you want to delete this Invoice?")) {
        axios
          .delete(
            `https://dashboard.waraqaweb.com/api/v1/admin/bills/teachers/path12/${this.invoiceID}`
          )
          .then((res) => {
            if (!res.data.success) {
              return (this.alerts.error = res.data.msg);
            }
            this.alerts.success = res.data.msg;
            this.$router.push("/admin/bills");
          });
      }
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
      doc.text(`Your classes in thirty days`, 14, 15);

      // Add the table to the PDF
      doc.autoTable(tableColumn, tableRows, { startY: 20 });

      // Get the guardian's name (adjust based on your actual data structure)
      const teacherName = this.data[0].teacherName || "Unknown Guardian"; // Fallback if guardian name is not available

      // Save the PDF with the dynamic file name
      doc.save(`Waraqa: ${teacherName}.pdf`);
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
      const teacherName = this.data[0].teacherName || "Unknown Guardian"; // Fallback if guardian name is not available

      // Write the workbook to a buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create a Blob and trigger download with the dynamic file name
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, `Waraqa classes details: ${teacherName}.xlsx`);
    },
  },
  created() {
    this.invoiceID = this.$route.params.id;
    this.getData();
  },
};
</script>

