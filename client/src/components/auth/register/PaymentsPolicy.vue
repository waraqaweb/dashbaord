<template>
  <div
    class="reg-modals modal fade"
    id="PaymentsPolicyModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-start">
        <!-- Content -->
        <div>
          <header
            class="b-color-1 f-color-0 py-3 px-3 px-md-5 d-flex justify-content-between"
          >
            <h4 class="m-0">Payment and cancellation policy</h4>
            <button
              type="button"
              class="f-color-0 border-0 background-none"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </header>
          <article
            class="f-color-2 mt-3 px-3 px-md-5 py-5 content"
            style="line-height: 2em"
          >
            <p><strong>Money Transfer Platform:</strong> PayPal and Wise.</p>

            <h3>Details</h3>
            <ul>
              <li>
                You will receive an e-invoice every 30 days via your registered email. This invoice will assess the cost of anticipated sessions in the upcoming month based on your current schedule.
              </li>
              <li>
                Any canceled lessons may be rescheduled on alternate days. If you prefer not to reschedule, the extra payment will be applied to the next month’s classes.
              </li>
              <li>
                No additional invoices will be issued until you have exhausted payments already made.
              </li>
            </ul>

            <h3>When to Make the Payment?</h3>
            <ul>
              <li>
                Except for the first invoice, all payments are made monthly in advance.
              </li>
              <li>
                The first invoice will be issued after you have indicated satisfaction with the first lesson with your assigned teacher.
              </li>
            </ul>

            <h3>Transfer Fees</h3>
            <p>
              We add a maximum fee of $5.00 USD on the total amount of each invoice, regardless of the amount you send. This charge covers the PayPal usage fees that all parties incur in making and accepting payment.
            </p>
            <p>
              <strong>Example Invoice:</strong><br>
              Total hours at $10 USD per hour plus the transfer fee:<br>
              15 hours X $10 = $150 + $5 = ($155 Total)
            </p>
            <p>
              You may make early payments using one of our approved payment methods, such as PayPal, or request an early payment invoice.
            </p>

            <h3>Late Payments</h3>
            <ul>
              <li>Payment is due within two days of the date of invoice.</li>
              <li>
                If an invoice is overdue, our team will contact you at least three times before putting classes on hold.
              </li>
              <li>
                Late Fees may apply if payments are not made within two days of the invoice date. However, Late Fees will not be applied until at least three attempts have been made to contact you regarding the late payment.
              </li>
              <li>
                In cases of errors on our part, Late Fees will be waived or refunded. If you miss a payment, contact us immediately to discuss how the payment can be made.
              </li>
              <li>
                Payments will be applied to the oldest outstanding payment first.
              </li>
            </ul>

            <h3>Class Cancellation and Refund Policy</h3>
            <ul>
              <li>
                Notify Waraqa at least 3 hours before the lesson start-time through the WhatsApp group to be eligible for rescheduling the canceled class.
              </li>
              <li>
                Teachers will not charge fees for classes they cancel.
              </li>
              <li>
                Students can reschedule up to 50% of their total registered monthly hours if cancellations are made 3 hours or more before the lesson start-time.
              </li>
              <li>
                Lessons not canceled according to this policy will remain liable for payment as per the Payment Schedule.
              </li>
              <li>
                Contact us if financial hardship prevents you from making payments to discuss alternative schedules or solutions.
              </li>
            </ul>
          </article>

        </div>
      </div>
    </div>
  </div>
</template>
