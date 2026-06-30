# تحليل قاعدة بيانات Roots (MySQL → Django)

## 1. فهم المجال والنظام (Business Domain)

النظام هو **منصة تعليمية إلكترونية** تركز على:
- تنظيم المحتوى التعليمي هرمياً: شجرة `Category` ذاتية الإحالة (self-referential) مع دعم المستويات القديمة 1/2/3
- إدارة بنك الأسئلة والإجابات مع دعم الصور والفيديو والتلميحات
- تصنيف الأسئلة حسب المواضيع (`QuestionsTopics`) والأقسام (`ExamSection`)
- إنشاء الامتحانات (`Exams`) من الأسئلة
- اشتراكات المستخدمين في باقات (`Packages`) لفترات زمنية
- تتبع أداء المستخدمين في الامتحانات (`UserExams`, `UserExamQuestionsAnswer`)
- نظام "Exam Trails" للتدريب المخصص بأوضاع مختلفة (tutor/exam, all/unused/correct...)
- نظام خصومات (`DiscountCodes`)
- معالجة مدفوعات (`HyperPay`)
- محتوى مساعد: مدونة، آراء، معلمون، إشعارات، تواصل

---

## 2. المشاكل الرئيسية في الـ Schema الأصلية

### 2.1 العلاقات والمفاتيح الأجنبية
- **غياب معظم الـ Foreign Keys**: معظم الأعمدة مثل `exam_id`, `question_id`, `user_id` هي أعداد صحيحة بدون قيود `FOREIGN KEY`.
- **تعارض أنواع البيانات**: مثلاً `exam_questions.exam_id` هو `int(11)` بينما `exams.id` هو `bigint unsigned`.
- **لا يوجد ON DELETE واضح**: مما قد يسبب بيانات يتيمة.

### 2.2 التكرار والبيانات الزائدة
- جدول `questions` يحتوي على تسلسل هرمي كامل (`category_id`, `sub_category_id`, `sub_subcategory_id`) بالإضافة إلى `questions_topic_id` و `section_id`.
- جدول `exams` يكرر نفس التسلسل الهرمي.
- `users` يحتوي على `mobile`, `mobile_number`, `mobile_country_code`, `dial_code` → تكرار.
- `user_exam_questions_answers` يحتوي على `user_id`, `exam_id` بالإضافة إلى `user_exam_id` → تطبيع ضعيف.

### 2.3 الجداول المؤقتة/الاحتياطية
يجب إزالتها من الإنتاج:
- `exam_questions20230530`
- `packages_backup`
- `questions202409`
- `users20240322`

### 2.4 جداول نظام Laravel غير ضرورية في Django
Django يوفر بدائل أفضل:
- `migrations` → Django migrations
- `sessions` → Django session framework
- `failed_jobs`, `jobs` → Celery / Django Q
- `oauth_*`, `personal_access_tokens` → DRF + JWT
- `password_resets` → Django password reset
- `roles`, `permissions`, `model_has_*`, `role_has_*` → Django auth groups/permissions
- `telescope_*` → Django Debug Toolbar / Sentry

### 2.5 مشاكل التسمية
- خلط المفرد والجمع: `exam_section` vs `exam_sections`
- اختصارات غير متسقة: `cat_id` vs `category_id`, `sub_cat_id` vs `sub_category_id`
- أسماء جداول غير موحدة: `contact_us`, `discounts_codes`, `users_credit_cards`
- `Packges` → إملاء خاطئ

### 2.6 مشاكل أنواع البيانات
- `packages.price` → `varchar` بدلاً من `decimal`
- `discounts_codes.quantity` → `double` بدلاً من `int`
- `questions_answers.exam_id` → وجوده أساساً غير منطقي
- `correct_answer_id` → `varchar` بدلاً من Foreign Key
- `exam_trails.stages` → `longtext` مع `json_valid()` بدلاً من `JSON` أصلي
- `questions.correct_answer_id` → يجب أن يكون رقم إجابة وليس نص

### 2.7 مشاكل الأمان
- `mobile_otp_request_logs` يخزّن OTP بصيغة نصية واضحة.
- `users_credit_cards` يخزّن بيانات البطاقات (token, last4digits).
- `hyperpay_results` يخزّن بيانات Card/Customer كاملة.
- `users.password` → يجب استخدام Django password hashing.
- لا يوجد rate limiting لطلبات OTP.

### 2.8 مشاكل الأداء والفهارس
- العديد من مفاتيح Foreign Key تفتقر إلى Indexes.
- `exam_trial_details` يحتوي على فهارس متكررة.
- لا توجد composite indexes للاستعلامات الشائعة.

### 2.9 مشاكل التطبيع (Normalization)
- `questions` يجب ألا يحمل تسلسل هرمي كاملاً إذا كان ينتمي إلى topic/section.
- `exam_trails` يحتوي على counts يمكن حسابها ديناميكياً.
- `user_exam_questions_answers` يحتوي على أعمدة زائدة.

---

## 3. التصميم المحسّن المقترح

### 3.1 المبادئ
- استخدام PostgreSQL بدلاً من MySQL لدعم JSON أصلي، Array، Full-text search.
- تطبيق Foreign Keys على جميع العلاقات.
- توحيد التسميات: `snake_case` جمع للجداول، بدون اختصارات.
- إزالة الجداول الاحتياطية وجداول نظام Laravel.
- فصل البيانات الحساسة (بطاقات دفع) عن النظام الرئيسي.
- استخدام Django Choices بدلاً من `tinyint` السحري.
- استخدام `DecimalField` للأسعار.

### 3.2 الخريطة الجديدة للكيانات

| التطبيق | النماذج |
|---------|---------|
| `users` | User, UserProfile, OtpRequest, PasswordResetToken |
| `content` | Category (self-referential tree), QuestionsTopic, ExamSection, Blog, Testimonial, Instructor, Notification, AppInfo, Setting, ContactMessage |
| `exams` | Question, Answer, QuestionTopic, ExamSectionLink, Exam, ExamQuestion, UserExam, UserExamAnswer, UserExamTrial, ExamTrail, ExamTrailCategory, ExamTrailSubCategory, ExamTrailSubSubCategory, ExamTrailSection, ExamTrailTopic, ExamTrialDetail |
| `packages` | Package, PackageSubCategory, PackageExam, UserPackage, DiscountCode |
| `payments` | PaymentType, PaymentTransaction, Invoice, MoneyLog |

### 3.3 التغييرات المهمة

#### User
- دمج `mobile`, `mobile_number`, `mobile_country_code`, `dial_code` في حقلين: `phone` و `phone_country_code`.
- إزالة `password_token`, `token`, `remember_token` (Django يديرها).
- إضافة `is_phone_verified`, `is_email_verified`.

#### Question & Answer
- `Question.correct_answer` → ForeignKey إلى `Answer`.
- إزالة `exam` من `Answer`.
- `QuestionTopic` كـ through model بين Question و QuestionsTopic.
- `ExamSectionLink` كـ through model بين Question و ExamSection.

#### Exam
- إضافة `duration_minutes` بدلاً من `time` (TimeField).
- إضافة `passing_score`.

#### UserExam
- `UserExamQuestionsAnswer` يشير إلى `UserExam` بدلاً من تكرار user/exam.

#### ExamTrail
- تبسيط Many-to-Many relations.
- `stages` يبقى JSONField.

#### Package
- `price` → `DecimalField(max_digits=10, decimal_places=2)`.
- `period_days` → Integer.
- `no_of_trial` → `trial_count`, `no_of_exams` → `exam_count`.

#### Payments
- `HyperpayResults` → `PaymentTransaction` مع تخزين minimal data فقط.
- `UsersCreditCards` → يُحذف أو يُحفظ في vault خارجي (PCI compliance).
- `MoneyLogs` → `MoneyLog` مع مرجع واضح للاشتراك/الفاتورة.

---

## 4. التحسينات الأمنية

1. **OTP**: تشفير OTP أو حفظ hash فقط مع rate limiting.
2. **كلمات المرور**: استخدام Django PBKDF2/Bcrypt/Argon2.
3. **بطاقات الدفع**: عدم تخزين تفاصيل البطاقة؛ استخدام tokenization من البوابة.
4. **Roles**: استخدام Django Groups & Permissions + custom object-level permissions.
5. **Audit Log**: جدول `AuditLog` لتتبع التغييرات الحساسة.

---

## 5. تحسينات الأداء

1. Indexes على جميع Foreign Keys.
2. Composite indexes للاستعلامات الشائعة:
   - `(user, status)` في UserExam
   - `(exam, question)` في ExamQuestion
   - `(user, created_at)` في ExamTrail
3. استخدام `select_related` و `prefetch_related` في APIs.
4. استخدام `django-debug-toolbar` و `django-silk` للمراقبة.
5. تخزين `stages` كـ JSONField في PostgreSQL مع GIN index.

---

## 6. خصائص مفقودة مقترحة

- **Audit logging** لجميع العمليات المالية.
- **Question versioning** لتاريخ تعديل الأسئلة.
- **User activity log** للتحليلات.
- **Coupon usage tracking** مع user/package/date.
- **Notification read receipts**.
- **Exam scheduling** و timed sessions.
- **Reports engine** للإحصائيات.
- **API rate limiting**.

---

## 7. ERD Relationships Summary

```
User 1--* UserPackage *--1 Package
User 1--* UserExam *--1 Exam
User 1--* ExamTrail *--* Question (through ExamTrialDetail)
ExamTrail *--* Category (levels 1/2/3)/Section/Topic
Exam 1--* ExamQuestion *--1 Question
Question 1--* Answer
Question *--* Topic (through QuestionTopic)
Question *--* Section (through ExamSectionLink)
Package *--* Category level 2 (through PackageSubCategory)
Package 1--* PackageExam *--1 Exam
User 1--* Invoice
User 1--* PaymentTransaction
```

---

## 8. القرارات الهندسية

1. **استمرار أسماء الجداول الأصلية** في `db_table` لتسهيل ترحيل البيانات، مع إصلاح الأخطاء الوظيفية.
2. **استخدام PostgreSQL** للاستفادة من JSONField والفهارس المتقدمة.
3. **DRF + JWT** للمصادقة بدلاً من Laravel Passport/OAuth.
4. **Celery** للمهام الخلفية (إشعارات، تقارير).
5. **Services Layer** لفصل منطق الأعمال عن Views.
6. **Tests** باستخدام pytest-django.
