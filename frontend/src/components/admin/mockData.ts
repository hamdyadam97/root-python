const statuses = ['active', 'inactive', 'archived', 'pending', 'published', 'draft', 'completed', 'failed'];

const names: Record<string, string[]> = {
  specialties: ['Internal Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 'Surgery', 'Emergency Medicine', 'Orthopedics', 'Obstetrics & Gynecology'],
  categories: ['Heart Failure', 'Arrhythmia', 'Coronary Artery Disease', 'ECG', 'Hypertension', 'Pulmonology', 'Nephrology'],
  'sub-categories': ['Diagnosis', 'Treatment', 'Clinical Guidelines', 'Medications', 'Case Studies', 'Complications'],
  topics: ['Acute Heart Failure', 'Chronic Heart Failure', 'Beta Blockers', 'Diuretics', 'Implantable Devices'],
  courses: ['Cardiology Mastery', 'Surgery Fundamentals', 'Pediatrics Essentials', 'Pharmacology Advanced'],
  exams: ['Cardiology Mock Exam', 'Surgery Final', 'Internal Medicine Practice', 'Pediatrics Assessment'],
  students: ['Ahmed Hassan', 'Sara Ali', 'Mohamed Salah', 'Fatima Zahra', 'Omar Khaled'],
  instructors: ['Dr. Khalid Ibrahim', 'Dr. Layla Farouk', 'Dr. Youssef Nabil', 'Dr. Nour El-Din'],
  subscriptions: ['Elite Medical', 'Pro Surgery', 'Basic Pediatrics', 'Premium Bundle'],
  orders: ['#ORD-1001', '#ORD-1002', '#ORD-1003', '#ORD-1004', '#ORD-1005'],
  payments: ['Visa ending 4242', 'Mastercard ending 8888', 'PayPal', 'Fawry'],
  certificates: ['Internal Medicine Certificate', 'Surgery Certificate', 'Pediatrics Certificate'],
  offers: ['SUMMER30', 'WELCOME20', 'MEDPRO50', 'FLASH15'],
  blog: ['How to Pass Medical Exams', 'Top Study Strategies', 'New Question Bank Updates'],
  pages: ['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'],
  testimonials: ['Great platform!', 'Helped me pass my exam', 'Excellent content'],
  notifications: ['New Course Alert', 'Subscription Renewal', 'System Maintenance'],
  'support-tickets': ['Payment Issue', 'Cannot Access Exam', 'Question Error Report'],
  reports: ['Monthly Revenue', 'Student Performance', 'Question Usage'],
  analytics: ['Daily Active Users', 'Exam Completion Rate', 'Average Score'],
  roles: ['Super Admin', 'Content Manager', 'Support Agent', 'Finance Manager'],
  users: ['admin@rootsexams.com', 'editor@rootsexams.com', 'support@rootsexams.com'],
  settings: ['Site Name', 'Default Language', 'Currency', 'SMTP Host'],
  'exam-templates': ['Mock Template', 'Final Template', 'Adaptive Template'],
  'question-banks': ['Cardiology Bank', 'Surgery Bank', 'Pediatrics Bank'],
  questions: ['ECG Interpretation', 'Heart Failure Diagnosis', 'Pediatric Fever', 'Surgical Instruments'],
};

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const date = (i: number) => {
  const d = new Date();
  d.setDate(d.getDate() - i * 3);
  return d.toISOString().split('T')[0];
};

export function generateMockRows(entityId: string, count = 20) {
  const list = names[entityId] || ['Item'];
  return Array.from({ length: count }).map((_, i) => {
    const base: any = {
      id: i + 1,
      name: pick(list) + ' ' + (i + 1),
      title: pick(list) + ' ' + (i + 1),
      status: pick(statuses),
      created_at: date(i),
    };

    switch (entityId) {
      case 'questions':
        base.title = base.name;
        base.type = pick(['Single Choice', 'Multiple Choice', 'True/False', 'Image-Based']);
        base.difficulty = pick(['Easy', 'Medium', 'Hard']);
        break;
      case 'students':
        base.email = 'student' + (i + 1) + '@example.com';
        base.exams = rand(0, 50);
        break;
      case 'instructors':
        base.specialty = pick(names.specialties);
        base.courses = rand(1, 12);
        break;
      case 'courses':
        base.instructor = pick(names.instructors);
        base.students = rand(10, 500);
        break;
      case 'exams':
        base.students = rand(0, 300);
        base.questions = rand(10, 200);
        break;
      case 'subscriptions':
        base.student = pick(names.students);
        base.package = pick(names.subscriptions);
        base.endDate = date(-rand(1, 365));
        break;
      case 'orders':
        base.student = pick(names.students);
        base.amount = '$' + rand(50, 500);
        base.date = date(i);
        break;
      case 'payments':
        base.student = pick(names.students);
        base.method = pick(names.payments);
        base.amount = '$' + rand(50, 500);
        base.date = date(i);
        break;
      case 'certificates':
        base.student = pick(names.students);
        base.course = pick(names.courses);
        base.issueDate = date(i);
        break;
      case 'offers':
        base.code = pick(names.offers);
        base.discount = rand(10, 60) + '%';
        break;
      case 'blog':
        base.author = pick(names.instructors);
        base.views = rand(100, 10000);
        break;
      case 'pages':
        base.slug = base.name.toLowerCase().replace(/\s+/g, '-');
        break;
      case 'testimonials':
        base.role = pick(names.students);
        base.rating = rand(1, 5);
        break;
      case 'notifications':
        base.audience = pick(['All', 'Students', 'Instructors']);
        base.sent = rand(0, 5000);
        break;
      case 'support-tickets':
        base.subject = base.name;
        base.student = pick(names.students);
        base.priority = pick(['Low', 'Medium', 'High']);
        break;
      case 'users':
        base.email = 'user' + (i + 1) + '@example.com';
        base.role = pick(names.roles);
        break;
      case 'roles':
        base.users = rand(0, 20);
        base.permissions = rand(5, 50);
        break;
      case 'question-banks':
        base.topic = pick(names.topics);
        base.questions = rand(50, 2000);
        break;
      case 'specialties':
        base.categories = rand(3, 15);
        base.questions = rand(100, 5000);
        break;
      case 'categories':
        base.specialty = pick(names.specialties);
        base.subCategories = rand(2, 12);
        break;
      case 'sub-categories':
        base.category = pick(names.categories);
        base.topics = rand(2, 10);
        break;
      case 'topics':
        base.subCategory = pick(names['sub-categories']);
        base.questions = rand(10, 500);
        break;
      case 'exam-templates':
        base.mode = pick(['Mock', 'Final', 'Practice']);
        base.questions = rand(10, 200);
        break;
      case 'reports':
        base.type = pick(['Revenue', 'Performance', 'Usage']);
        break;
      case 'analytics':
        base.metric = pick(['Users', 'Exams', 'Score']);
        base.value = rand(10, 99) + '%';
        break;
      case 'settings':
        base.key = 'setting_' + (i + 1);
        base.value = pick(['Enabled', 'Disabled', 'Auto']);
        base.group = pick(['General', 'Payment', 'Notifications']);
        break;
    }

    return base;
  });
}
