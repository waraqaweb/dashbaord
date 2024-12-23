<template>
  <div
    class="reg-modals contractModal modal fade"
    id="contractModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content text-start">
        <!-- عقد عمل مع مؤسسة ورقة -->
        <div v-if="tab == 0">
          <header
            class="b-color-1 f-color-0 py-3 px-4 d-flex justify-content-between"
          >
            <h4 class="m-0">عقد عمل مع مؤسسة ورقة.</h4>
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
            <article class="f-color-2">
              <h4 class="text-center mb-5">بسم الله الرحمن الرحيم</h4>
              <p>
                يسر مؤسسة ورقة لتعليم القرآن الكريم واللغة العربية والدراسات
                الإسلامية انضمامك إلى فريقنا سائلين المولى سبحانه أن نكون عونا
                على الخير وأن يستخدمنا فيما يرضيه.
              </p>
              <p>
                ولإتمام خطوات الانضام يرجى قراءة البيانات التالية ومراجعتها
                بدقة، علما بأنك ستحتاج إلى المستندات التالية:
              </p>
              <p>
                ١ - صورة عن البطاقة الشخصية أو جواز السفر. <br />.٢ - صور عن
                الوثائق والشهادات العلمية <br />
                ٣ - للرجال: صورة فوتوغرافية واضحة، ويمكن للنساء إرفاق صورة
                اختياريا. <br />٤ - السيرة الذاتية.
              </p>
              <p>
                أذكرك أن تستخير الله قبل أن تقدم على هذه الخطوة وأن تسأله
                التوفيق,<br />نحن في انتظارك ومتطلعون للتعاون معك بإذن الله,<br />دمت
                في رعاية الله وأمنه.<br />ورقة
              </p>
            </article>
            <footer class="d-flex justify-content-end">
              <button
                class="border-0 main-button-style f-color-0 py-2 px-3 rounded"
                @click="tab++"
              >
                التالي
              </button>
            </footer>
          </div>
        </div>
        <!-- بنود العقد -->
        <div v-if="tab == 1">
          <header
            class="b-color-1 f-color-0 py-3 px-4 d-flex justify-content-between"
          >
            <h4 class="m-0">بنود العقد.</h4>
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
            <article class="f-color-2">
              <span>الطرف الأول: مؤسسة ورقة.</span>
              <div>
                <span>الطرف الثاني: </span>
                <span> {{ name }}</span>
              </div>
              <!-- Paragraphs -->
              <div class="content my-5">
                <p>:وقد اتفق الطرفان على ما يلي</p>
                <p>يعمل الطرف الثاني لدى الطرف الأول بمهنة معلم بنظام الساعة نظير مبلغ يختلف حسب عدد ساعات تدريس المعلم في شهره كما هو موضح في الجدول التالي</p>
                <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; text-align: center; border-collapse: collapse; margin-bottom: 1rem;">
                  <thead>
                    <tr>
                      <th style="border: 1px solid #000;">الأجر بالجنيه المصري للساعة بما يقابل</th>
                      <th style="border: 1px solid #000;">عدد الساعات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #000;">3 دولار</td>
                      <td style="border: 1px solid #000;">من 1 إلى 60 ساعة</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000;">3.25 دولار</td>
                      <td style="border: 1px solid #000;">من 61 إلى 75 ساعة</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000;">3.50 دولار</td>
                      <td style="border: 1px solid #000;">من 76 إلى 90 ساعة</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000;">3.75 دولار</td>
                      <td style="border: 1px solid #000;">من 91 إلى 110 ساعة</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000;">4 دولار</td>
                      <td style="border: 1px solid #000;">من 111 إلى 130 ساعة</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000;">4.25 دولار</td>
                      <td style="border: 1px solid #000;">من 131 إلى 150 ساعة</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000;">4.50 دولار</td>
                      <td style="border: 1px solid #000;">أكثر من 150 ساعة</td>
                    </tr>
                  </tbody>
                </table>

                <p>بواقع ثلثي المبلغ للدرس والثلث أجر تسليم تقرير الدرس عن كل ساعة تحتسب عند تسليم التقرير في أول 24 ساعة من انتهاء وقت الدرس. وعلى الطرف الثاني توفير ساعات العمل المطلوبة حتى يتم احتساب الوقت بفاعلية.</p>

                <p>ويحول الراتب بالجنيه المصري حسب سعر صرف البنك المركزي المصري في يوم استلام مؤسسة ورقة أو مندوبها المبلغ من البنك، والذي قد يختلف من شهر لآخر حسب مصلحة العمل. ومؤسسة ورقة غير ملزمة بالتعويض عن فرق التحويل في حالة تغير سعر الصرف بالزيادة أو النقصان بعد قيام المؤسسة بسحب المبلغ من البنك.</p>

                <p>وننوه إلى أنه يعتد فقط بالدروس التي درسها المعلم فعلياً في نفس شهر المحاسبة. وفي حالة تخلف المعلم عن أي درس بسبب السهو أو الخطأ أو النسيان دون اعتذار للطالب قبل موعد الدرس بثلاث ساعات على الأقل، ستخصم مدة هذا الدرس من إجمالي الساعات التي درسها في ذلك الشهر، مما يؤثر سلباً على عدد ساعاته. ولمؤسسة ورقة الحق في مضاعفة الخصم إذا تكرر هذا الأمر أكثر من مرة في نفس الشهر.</p>

                <p>كما أنه في حال التدريس ينطبق عليه شروط المعلم، وهي كما يلي:</p>

                <p>
                  أ - يلتزم الطرف الثانى بتقديم جميع البيانات الخاصة التى تطلب
                  منه حتى نتمكن من تحويل الراتب.
                </p>
                <p>
                  ب - يلتزم الطرف الثانى بالاشتراك فى خدمة انترنت قوية ومميزة
                  حتى يكون تواصل المعلم مع الطالب أثناء الحصة مفيدا.
                </p>
                <p>
                  ج- في حال ضعف الإنترنت عند المعلم مما يترتب عليه إلغاء الدرس
                  او إعادته لا يتم محاسبة المعلم على الدرس.
                </p>
                <p>
                  د- فى حال تكرار الشكوى من ضعف الانترنت بسبب ضعف الاشتراك أكثر
                  من مرة خلال الشهر الواحد يتم غلق جدول المعلم وهذا يعنى وقف
                  تسجيل طلاب جدد ويتم سحب الطلاب من عند المعلم بواقع طالب كل يوم
                  حتى يلتزم الطرف الثانى بتحضير الدروس وعدم التسبب في أي أذى
                  نفسي أو بدني للطالب وحضور الاجتماعات الجانبية عند طلب الطرف
                  الأول الاجتماع به وهي خارج إطار البند رقم ١ وعليه الالتزام
                  بالحضور في الوقت المحدد من قبل الطرف الأول ويتم التنسيق مع
                  الطرف الثاني لتحديد الموعد المناسب للقاءات والتباحث في قضايا
                  العمل.
                </p>
                <p>
                  هـ- يلتزم الطرف الثاني باستخدام الوقت بفاعلية تامة وأن ينجز
                  الأعمال المناطة به في أقرب وقت وعدم التأخر في إنجاز الأعمال
                  يلتزم الطرف الثاني بتطبيق معايير الجودة وسرعة الانجاز
                  والالتزام بكافة التعليمات والتنظيمات المباشره من رئاسة القسم
                  الذي يعمل به.
                </p>
                <p>
                  و - يلتزم الطرف الثاني بعدم الاحتفاظ بأي ارقام او اي طريقة
                  تواصل سواء ايميل او التواصل عن طريق وسائل التواصل الاجتماعي او
                  اي وسيلة اخرى مع عملاء الشبكة وعدم تداول هذه المعلومات إلا
                  لمصلحة الطرف الأول وموافقته على ذلك.
                </p>
                <p>
                  ز - يلتزم الطرف الأول بدفع مستحقات الطرف الثاني في الأسبوع
                  الأول من بداية الشهر.
                </p>
                <p>
                  ح - يصبح هذا العقد ملغيا بدون تعويض أو مكافاة فيما ارتكب الطرف
                  الثاني احد الامور الموجبة لإلغاء العقد وهي: إفشاء أسرار العمل,
                  التحدث مع العملاء خارج موضوع العمل المنوط بالطرف الثاني اداؤه,
                  التعاقد الباطن مع العملاء المباشرين, أخذ أي مبلغ مادي من
                  العملاء, الإخلال بالآداب الإسلامية , التعدي اللفظي أو الجسدي
                  على العملاء أو العاملين في الشبكة, التخلف عن ساعات العمل
                  المطلوبة وعدم إنجاز الأعمال بالشكل المطلوب والمحدد.
                </p>
                <p>
                  ط - يتعهد الطرف الثاني بعدم إفشاء الأسرار أو نقل أي معلومة
                  خاصة بالعمل في أي وسيلة اتصال مرئية أو مسموعة أو مقروءة. 
                </p>
              </div>
            </article>
            <footer class="d-flex justify-content-end">
              <button
                class="border-0 main-button-style f-color-0 py-2 px-3 rounded"
                @click="tab++"
              >
                التالي
              </button>
              
            </footer>
            <div class="d-flex justify-content-end py-4 px-3">
          <button
            class="btn btn-secondary px-5"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            إغلاق
          </button>
        </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["name"],
  data() {
    return {
      tab: 0,
    };
  },
};
</script>
<style>
/* Modal Adjustments */
header button {
  width: 50px;
}

@media (min-width: 576px) {
  .reg-modals .modal-dialog {
    max-width: 50%;
  }
}

.contractModal .modal-content {
  font-family: El Messiri, sans-serif;
  text-align: right !important;
  direction: rtl;
}

.reg-modals .content {
  height: 450px;
  overflow-y: auto;
}

.reg-modals .content::-webkit-scrollbar {
  width: 4px;
}

.reg-modals .content::-webkit-scrollbar-thumb {
  background: var(--color-1);
}

/* Responsive Form Fields */
.reg-modals .form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.reg-modals input, 
.reg-modals textarea, 
.reg-modals select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--color-3_3);
  font-size: 1rem;
  transition: border-color var(--transition-speed), box-shadow var(--transition-speed);
}

.reg-modals input:focus,
.reg-modals textarea:focus,
.reg-modals select:focus {
  border-color: var(--color-1);
  box-shadow: 0 0 8px rgba(44, 115, 108, 0.5);
  outline: none;
}

/* Responsive Layout */
@media (min-width: 768px) {
  .reg-modals .form-group {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .reg-modals input, 
  .reg-modals textarea, 
  .reg-modals select {
    flex: 1 1 48%; /* Two fields per row on larger screens */
  }
}

@media (max-width: 576px) {
  .reg-modals .form-group {
    flex-direction: column; /* One field per row on smaller screens */
  }

  .reg-modals input, 
  .reg-modals textarea, 
  .reg-modals select {
    flex: 1 1 70%; /* Full width for small screens */
  }
}

</style>
