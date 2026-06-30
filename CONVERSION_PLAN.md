# خطة تحويل المشروع — Laravel + Next.js → Django + React Vite

## 1. الهدف
إنشاء نسخة مطابقة وظيفياً بنسبة 100% من المشروع الحالي باستخدام:
- **Backend**: Django + Django REST Framework + PostgreSQL + JWT + Swagger.
- **Frontend**: React + Vite + React Router + Axios + Tailwind CSS + Redux Toolkit.

## 2. مبدأ التحويل
- عدم حذف أي ميزة.
- عدم تغيير أسماء الحقول/العلاقات إلا إذا كان ضرورياً تقنياً.
- الحفاظ على نفس Workflow المستخدم.
- استخدام `APIView` فقط في Django (ممنوع ViewSet/Routers).

## 3. خريطة الملفات

### Backend — Django
| الملف/المجلد القديم | الملف/المجلد الجديد | الملاحظات |
|---------------------|---------------------|-----------|
| `backroot/app/Models/*.php` | `backend/apps/core/models.py` | تحويل Eloquent Models إلى Django Models |
| `backroot/app/Http/Controllers/Api/*.php` | `backend/apps/api/views/*.py` | APIView لكل Controller |
| `backroot/app/Http/Resources/Api/*.php` | `backend/apps/api/serializers/*.py` | Serializers |
| `backroot/routes/api.php` | `backend/apps/api/urls.py` | URL patterns |
| `backroot/app/Http/Middleware/*.php` | `backend/apps/core/middleware.py` + permissions.py | JWT + role/permission checks |
| `backroot/app/helpers.php` | `backend/apps/core/services.py` + utils.py | Helpers & Services |
| `backroot/app/Traits/*.php` | `backend/apps/core/services.py` | Coupon / Payment logic |
| `backroot/database/migrations/*.php` | `backend/apps/core/migrations/*.py` | Django migrations |

### Frontend — React Vite
| الملف/المجلد القديم | الملف/المجلد الجديد | الملاحظات |
|---------------------|---------------------|-----------|
| `rootsfront/app/[locale]/(auth)/*` | `frontend/src/pages/auth/*` | صفحات المصادقة |
| `rootsfront/app/[locale]/(main)/*` | `frontend/src/pages/public/*` | الصفحات العامة |
| `rootsfront/app/[locale]/(dashboard)/*` | `frontend/src/pages/dashboard/*` | لوحة التحكم |
| `rootsfront/components/*` | `frontend/src/components/*` | المكونات |
| `rootsfront/store/*.ts` | `frontend/src/store/*.ts` | Redux Toolkit slices |
| `rootsfront/lib/api.ts` | `frontend/src/lib/api.ts` | Axios instance |
| `rootsfront/messages/*.json` | `frontend/src/i18n/*.json` | ملفات الترجمة |
| `rootsfront/middleware.ts` | `frontend/src/router/ProtectedRoute.tsx` | حماية المسارات |

## 4. خطوات التنفيذ

### المرحلة 1: إعداد Django Project
1. إنشاء هيكل المشروع.
2. إعداد الإعدادات (PostgreSQL, JWT, CORS, Swagger).
3. إنشاء التطبيقات: core, api, users, exams, packages, payments, content.

### المرحلة 2: نماذج Django
1. تحويل جميع Models من Laravel إلى Django Models.
2. الحفاظ على أسماء الجداول والحقول.
3. إنشاء العلاقات Many-to-Many والـ Foreign Keys.
4. إنشاء migrations.

### المرحلة 3: Serializers
1. إنشاء serializers مطابقة لـ Laravel Resources.
2. UserResource, QuestionResource, CategoryResource, ExamTrialResource, إلخ.

### المرحلة 4: Views (APIView)
1. Auth views: login, signup, verify-otp, resend-otp, forget, reset.
2. User views: profile, update profile, password, logout.
3. Home/Content views: landing, blogs, testimonials, categories.
4. ExamTrial views: CRUD + stages + answers + reports.
5. Package views: list, detail, subscribe, coupon.
6. Support/Chat views.

### المرحلة 5: URLs & Permissions
1. ربط جميع الـ views بـ urls.py.
2. إنشاء custom permissions للـ JWT وللأدوار.

### المرحلة 6: React Vite Project
1. إنشاء مشروع Vite + React + TypeScript.
2. تثبيت Tailwind CSS, Axios, React Router, Redux Toolkit, React-i18next, js-cookie.

### المرحلة 7: State Management
1. تحويل Zustand stores إلى Redux Toolkit slices.
2. authSlice, examSlice, packagesSlice, chatSlice, supportSlice.

### المرحلة 8: Pages & Components
1. إنشاء الصفحات والمكونات مطابقة للتصميم الحالي.
2. حماية المسارات عبر ProtectedRoute.

### المرحلة 9: API Integration
1. تحديث endpoints لتتواصل مع Django.
2. التأكد من تطابق response structure.

### المرحلة 10: Testing
1. اختبار الـ APIs.
2. اختبار سير الامتحان.
3. اختبار المصادقة والاشتراكات.

## 5. القرارات التقنية

### Django
- استخدام `django-rest-framework-simplejwt` للمصادقة.
- استخدام `drf-yasg` أو `drf-spectacular` لـ Swagger.
- تخزين JWT token في cookies (للواجهة) مع دعم Bearer header.
- إنشاء `BaseApiView` يوحد شكل الـ response.

### React
- استخدام Redux Toolkit بدلاً من Zustand.
- استخدام React Router v6.
- استخدام React-i18next بدلاً من next-intl.
- الحفاظ على Tailwind CSS v4 مع استيراد متغيرات الألوان.

## 6. المخاطر والتحديات
1. **كود HyperPay**: يحتاج إلى إعادة كتابة دقيقة لتجنب الأخطاء.
2. **جداول مفقودة**: يجب إنشاؤها في Django migrations.
3. **Response structure**: يجب الحفاظ على نفس شكل الـ responses لضمان عمل الـ Frontend.
4. **كبير الحجم**: المشروع كبير، لذا سيتم تسليم الأساس ثم استكمال الباقي.
