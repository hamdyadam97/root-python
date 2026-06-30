# RootsExams — Django + React Vite Rebuild

This repository contains a complete rebuild of the original Laravel + Next.js RootsExams project using:

- **Backend**: Django 4.2 + Django REST Framework + PostgreSQL + JWT (simplejwt) + Swagger (drf-spectacular)
- **Frontend**: React 18 + Vite + TypeScript + React Router + Redux Toolkit + Tailwind CSS + Axios

## Project Structure

```
rootpython/
├── backend/          # Django REST API
│   ├── config/       # Project settings, URLs, WSGI/ASGI
│   ├── apps/
│   │   ├── core/     # Pagination, utils, services, permissions, API urls
│   │   ├── users/    # User model, auth views, serializers
│   │   ├── content/  # Categories, blogs, testimonials, support, chat
│   │   ├── exams/    # Questions, exam trails, exam engine
│   │   ├── packages/ # Packages, subscriptions, coupons
│   │   └── payments/ # Payments, invoices, HyperPay placeholders
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/         # React Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/    # Redux Toolkit slices
│   │   ├── lib/      # Axios instance
│   │   ├── i18n/     # Translations (en/ar)
│   │   └── router/
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── ANALYSIS_REPORT.md
└── CONVERSION_PLAN.md
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your PostgreSQL credentials

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend will run at `http://localhost:8000`.
Swagger UI: `http://localhost:8000/api/swagger/`

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env to point to backend API

npm run dev
```

Frontend will run at `http://localhost:5173`.

## Features Rebuilt

### Authentication
- Signup with OTP
- Login with mobile + password
- Forgot/reset password via OTP
- JWT token authentication
- Profile update & password change

### Exam Engine
- Create exam with categories, sub-categories, sections, topics
- Tutor mode vs Exam mode
- Timed mode support
- Question modes: all, unused, used, correct, incorrect, marked
- Multi-stage exams (40 questions per stage)
- Save answers (single/batch)
- Finish exam and view reports

### Content
- Landing page with categories, testimonials, blogs
- Categories / sub-categories listing
- Blogs list & detail
- Testimonials submission
- Contact / support forms
- AI chat explanation (OpenAI integration placeholder)

### Packages & Subscriptions
- Package listing
- User subscriptions
- Coupon discount check
- Subscription flow with HyperPay placeholder

### Admin Panel
All models are registered in Django admin at `/admin/`.

## Notes

- The rebuild preserves the original database schema and API response structure as closely as possible.
- Some external integrations (BroadNet SMS, HyperPay, Phenix Billing, OpenAI) require real credentials in `.env`.
- The admin web panel from Laravel has been replaced by Django admin. Advanced permission-based admin views can be added incrementally.
- The project was built without running Python in this environment; running migrations and tests locally is required.

## Next Steps / Completion Checklist

1. Run backend migrations and verify model creation.
2. Import existing data from MySQL to PostgreSQL.
3. Configure real SMS/payment credentials.
4. Add remaining admin dashboard views if needed.
5. Add automated tests for critical exam flow.
6. Deploy backend + frontend.
