# تقرير تحليل شامل — مشروع RootsExams

## 1. نظرة عامة على المشروع الحالي

| البند | Backend | Frontend |
|------|---------|----------|
| الإطار | Laravel 10.x | Next.js 15.1.0 (App Router) |
| اللغة | PHP ^8.1 | TypeScript 5.7 |
| المصادقة | Laravel Passport (OAuth) + OTP | Cookie-based JWT (js-cookie) |
| قاعدة البيانات | MySQL | — |
| الـ State | Eloquent/Session | Zustand |
| التصميم | — | Tailwind CSS v4 |
| i18n | — | next-intl (en/ar) |

---

## 2. هيكل المشروع الحالي

```
backroot/                 rootsfront/
├── app/                  ├── app/[locale]/
│   ├── Console/Commands/ │   ├── (auth)/
│   ├── Exceptions/       │   ├── (main)/
│   ├── Exports/          │   ├── (dashboard)/
│   ├── Helpers/          │   ├── globals.css
│   ├── Http/             │   └── layout.tsx
│   │   ├── Controllers/  ├── components/
│   │   ├── Middleware/   ├── store/
│   │   ├── Requests/     ├── lib/
│   │   └── Resources/    ├── i18n/
│   ├── Imports/          ├── messages/
│   ├── Mail/             ├── middleware.ts
│   ├── Models/           ├── next.config.ts
│   ├── Services/         ├── package.json
│   ├── Traits/           ├── postcss.config.mjs
│   └── User.php          ├── public/
├── config/               └── tsconfig.json
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── web.php
└── resources/views/   (لوحة الإدارة Blade)
```

---

## 3. الوحدات (Modules) الرئيسية

### 3.1 المصادقة والمستخدمون (Auth & Users)
- تسجيل حساب جديد عبر OTP.
- تسجيل الدخول برقم الجوال وكلمة المرور.
- نسيان/إعادة تعيين كلمة المرور عبر OTP.
- تحديث الملف الشخصي وكلمة المرور.
- أدوار المستخدمين: Admin (1), User (2), Accountant (3), Data Entry (4).

### 3.2 التصنيفات والمحتوى (Categories & Content)
- تصنيفات رئيسية (categories).
- تصنيفات فرعية (sub_categories).
- تصنيفات فرعية-فرعية (sub_sub_categories).
- مواضيع الأسئلة (questions_topics).
- أقسام الامتحان (exam_section).
- مقالات (blogs) وآراء (testimonials).

### 3.3 الأسئلة والإجابات (Questions & Answers)
- بنك أسئلة كبير (questions).
- خيارات إجابة متعددة (questions_answers).
- دعم صور الأسئلة/الإجابات، فيديو، تلميحات.
- أنواع الأسئلة: Radio, Multiple choice.

### 3.4 الامتحانات (Exams)
- **المحرك القديم**: exams / user_exams / user_exam_questions_answers.
- **المحرك الجديد**: exam_trails / exam_trial_details.
- أوضاع الامتحان: Tutor, Exam.
- أوضاع الأسئلة: all, unused, used, correct, incorrect, marked.
- تقسيم الأسئلة إلى مراحل (stages) بحجم 40 سؤال لكل مرحلة.
- تقارير الأداء حسب الفئات/الأقسام/المواضيع.

### 3.5 الباقات والاشتراكات (Packages & Subscriptions)
- باقات اشتراك (packages).
- اشتراكات المستخدمين (user_packages).
- باقة تجريبية تلقائية عند التحقق.
- كوبونات خصم (discounts_codes).

### 3.6 الدفع (Payments)
- HyperPay للدفع بالبطاقة.
- سجل المدفوعات (money_logs).
- بطاقات ائتمان محفوظة (users_credit_cards).

### 3.7 الفواتير والمحاسبة (Billing)
- فواتير (invoices).
- إرسال الفواتير إلى نظام Phenix.

### 3.8 الدعم والذكاء الاصطناعي
- طلبات الدعم الفني (support_requests).
- دردشة AI للشرح (ai_instructions + ChatGPT).

### 3.9 لوحة الإدارة (Admin Panel)
- CRUD لجميع الكيانات.
- إدارة الصلاحيات عبر Spatie Permission.
- استيراد/تصدير الأسئلة Excel.

---

## 4. الجداول والعلاقات

### الجداول الأساسية
| الجدول | الوصف |
|--------|-------|
| users | المستخدمون |
| categories | التصنيفات الرئيسية |
| sub_categories | التصنيفات الفرعية |
| sub_sub_categories | التصنيفات الفرعية-فرعية |
| questions | بنك الأسئلة |
| questions_answers | خيارات الإجابة |
| questions_topics | مواضيع الأسئلة |
| question_topics | ربط الأسئلة بالمواضيع |
| exam_section | أقسام الامتحان |
| exam_sections | ربط الأسئلة بالأقسام |
| exams | نماذج الامتحانات القديمة |
| exam_questions | ربط الامتحانات بالأسئلة |
| user_exams | محاولات المستخدمين القديمة |
| user_exam_questions_answers | إجابات المستخدمين القديمة |
| exam_trails | الامتحانات التجريبية الجديدة |
| exam_trial_details | تفاصيل إجابات الامتحان التجريبي |
| categories_exam_trails | ربط الامتحانات التجريبية بالتصنيفات |
| sub_categories_exam_trails | ربط الامتحانات التجريبية بالتصنيفات الفرعية |
| sub_sub_categories_exam_trails | ربط الامتحانات التجريبية بالتصنيفات الفرعية-فرعية |
| exam_trails_sections | ربط الامتحانات التجريبية بالأقسام |
| exam_trails_topics | ربط الامتحانات التجريبية بالمواضيع |
| packages | الباقات |
| packages_sub_categories | ربط الباقات بالتصنيفات الفرعية |
| user_packages | اشتراكات المستخدمين |
| discounts_codes | أكواد الخصم |
| money_logs | سجل المدفوعات |
| hyperpay_results | نتائج HyperPay |
| users_credit_cards | بطاقات المستخدمين المحفوظة |
| invoices | الفواتير |
| testimonials | الآراء |
| blogs | المقالات |
| support_requests | طلبات الدعم |
| ai_instructions | تعليمات AI |
| settings | الإعدادات |
| app_infos | إصدارات التطبيق |
| notifications | الإشعارات |
| instructors | المحاضرون |

### العلاقات الرئيسية
- user → hasMany → user_packages, exam_trails, user_exams, invoices.
- category → hasMany → sub_categories, questions, topics, exam_section, packages.
- sub_category → belongsTo → category; hasMany → sub_sub_categories, questions.
- sub_sub_category → belongsTo → sub_category; hasMany → questions.
- question → belongsTo → category/sub_category/sub_sub_category; hasMany → questions_answers, exam_sections, question_topic.
- exam_trail → belongsToMany → categories, sub_categories, sub_sub_categories, sections, topics, questions; hasMany → details.
- package → belongsTo → category; belongsToMany → sub_categories; hasMany → subscriptions.
- invoice → belongsTo → user, user_package, created_by, sent_by.

---

## 5. قائمة الـ APIs

### عامة (بدون مصادقة)
- `POST /api/login`
- `POST /api/signup`
- `POST /api/verify-otp`
- `POST /api/resend-otp`
- `POST /api/check-verification`
- `POST /api/forget`
- `POST /api/forget-verify-otp`
- `POST /api/reset`
- `GET /api/get-exams`
- `GET /api/landing/index`
- `GET /api/blogs/index`
- `GET /api/blogs/{id}`
- `GET /api/get-category/{id}`
- `GET /api/get-subcategories/{cat_id}`
- `GET /api/categories`
- `GET /api/categories/{id}/subcategories`
- `GET /api/subcategories/{id}/packages`
- `POST /api/contact`
- `GET /api/question-banks`
- `GET /api/testimonials`
- `POST /api/testimonials`

### محمية (تحتاج Bearer Token)
- `GET /api/home`
- `GET /api/get-user-info`
- `POST /api/update-user-info`
- `POST /api/update-user-password`
- `POST /api/logout`
- `POST /api/contactus`
- `GET /api/get-category`
- `GET /api/get-subcategory`
- `POST /api/support`
- `POST /api/chat`
- `GET /api/payment-types`

### الامتحانات التجريبية
- `GET /api/exams/get`
- `GET /api/exams/{id}/get`
- `GET /api/exams/create`
- `GET /api/exams/subcategories`
- `GET /api/exams/sub-subcategories`
- `GET /api/exams/sections`
- `GET /api/exams/topics`
- `GET /api/exams/refresh-sections-and-topics`
- `POST /api/exams/store`
- `POST /api/exams/reset`
- `GET /api/exams/get-questions`
- `GET /api/exams/{question_id}/get-question`
- `GET /api/exams/{exam_id}/current-stage`
- `GET /api/exams/{exam_id}/stage/{stage_number}`
- `POST /api/exams/{exam_id}/advance-stage`
- `POST /api/exams/{exam_id}/store-question-answer`
- `POST /api/exams/{exam_id}/store-single-question-answer`
- `GET /api/exams/{exam_id}/overview`
- `POST /api/exams/{exam_id}/finish`

### الباقات
- `GET /api/packages/data`
- `GET /api/packages/index`
- `GET /api/packages/{id}/get`
- `GET /api/packages/{id}/related`
- `GET /api/packages/user-subscription`
- `POST /api/packages/subscribe`
- `POST /api/packages/store-subscribe`
- `POST /api/packages/checkout`
- `GET /api/packages/package-payment`
- `POST /api/packages/check-coupon`

---

## 6. نظام المستخدمين والصلاحيات

### الأدوار
| role_type | الدور |
|-----------|-------|
| 1 | Admin |
| 2 | User |
| 3 | Accountant |
| 4 | Data Entry |

### الصلاحيات الرئيسية في لوحة الإدارة
- user_access, appinfo_access, billing_access, package_access, userpackage_access.
- discountscode_access, payment_type_access, instructor_access.
- category_access, subcategory_access, sub_subcategory_access.
- topic_access, exam_section_access, exam_access, question_access.
- examquestion_access, userexam_access, notification_access.
- ai_instruction_access, blog_access, lab_value_access.
- categories_export_access, testimonial_access.

---

## 7. العمليات التجارية (Business Logic)

### 7.1 التسجيل والتحقق
1. المستخدم يدخل الاسم والجوال وكلمة المرور والبيانات الشخصية.
2. النظام يتحقق من صحة البيانات ويوجد حساباً.
3. يُرسل OTP عبر BroadNet SMS.
4. عند التحقق الناجح، يُنشئ اشتراك تجريبي.
5. يُصدر Passport access token.

### 7.2 إنشاء الامتحان
1. المستخدم يختار التصنيفات التي يملك اشتراكاً فيها.
2. يختار الفئات الفرعية والأقسام والمواضيع.
3. يختار وضع الامتحان (tutor/exam) ووضع الأسئلة.
4. النظام يولّد أسئلة عشوائية حسب المعايير.
5. يقسم الأسئلة إلى مراحل (40 سؤال لكل مرحلة).

### 7.3 حل الامتحان
1. Tutor Mode: يظهر التصحيح والشرح فور الإجابة.
2. Exam Mode: يحفظ الإجابة بدون تصحيح فوري.
3. يمكن للمستخدم الانتقال بين المراحل بعد إكمال المرحلة الحالية.
4. عند الانتهاء، يحسب النظام النتيجة ويعرض التقارير.

### 7.4 الاشتراكات والدفع
1. عرض الباقات المتاحة.
2. تطبيق كوبون الخصم.
3. إذا كان السعر = 0، يُنشئ الاشتراك مباشرة.
4. وإلا، يتم إنشاء عملية دفع HyperPay وإعادة توجيه المستخدم.
5. بعد الدفع، يُنشئ الاشتراك ويُحدث سجل المدفوعات.

### 7.5 لوحة الإدارة
- إدارة كاملة للمستخدمين والتصنيفات والأسئلة والامتحانات.
- استيراد الأسئلة من Excel/CSV.
- إدارة الباقات والاشتراكات والفواتير.

---

## 8. الملاحظات التقنية المهمة

1. بعض الجداول مفقودة من Migrations رغم استخدامها (exam_section, contact_us, lab_values).
2. بعض الأعمدة مفقودة من Migrations رغم وجودها في $fillable (subscription_status, hint, show_answer_explanation, إلخ).
3. Spatie Permission مثبت لكن User لا يستخدم HasRoles/HasPermissions.
4. كود HyperPay يحتوي على أخطاء وثغرات.
5. الـ Frontend يعتمد بشكل كبير على Client Components.
6. شرط طول الاسم الكامل (20 حرف) في التسجيل يبدو خطأ منطقياً.
