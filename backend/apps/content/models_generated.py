# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AiInstructions(models.Model):
    id = models.BigAutoField(primary_key=True)
    instructions = models.TextField()
    is_default = models.BooleanField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    question = models.ForeignKey('Questions', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ai_instructions'


class AppInfos(models.Model):
    id = models.BigAutoField(primary_key=True)
    ios_version = models.CharField(max_length=50, blank=True, null=True)
    android_version = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    map_url = models.CharField(max_length=1000, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    whatsapp = models.CharField(max_length=50, blank=True, null=True)
    working_hours = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'app_infos'


class AuditLogs(models.Model):
    id = models.BigAutoField(primary_key=True)
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=100)
    entity_id = models.IntegerField(blank=True, null=True)
    metadata = models.JSONField()
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField()
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'audit_logs'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class BlogComments(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    blog = models.ForeignKey('Blogs', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'blog_comments'


class Blogs(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.CharField(max_length=500, blank=True, null=True)
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    category = models.ForeignKey('Categories', models.DO_NOTHING)
    author = models.CharField(max_length=255, blank=True, null=True)
    reading_time = models.IntegerField()
    tags = models.CharField(max_length=500, blank=True, null=True)
    topic = models.CharField(max_length=100, blank=True, null=True)
    views = models.IntegerField()
    author_image = models.CharField(max_length=500, blank=True, null=True)
    author_title = models.CharField(max_length=255, blank=True, null=True)
    subtitle = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'blogs'


class Categories(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    icon = models.CharField(max_length=255, blank=True, null=True)
    level = models.SmallIntegerField()
    order = models.IntegerField()
    status = models.IntegerField()
    foreground_color = models.CharField(max_length=50, blank=True, null=True)
    background_color = models.CharField(max_length=50, blank=True, null=True)
    is_top = models.BooleanField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_new = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'categories'


class CategoriesExamTrails(models.Model):
    id = models.BigAutoField(primary_key=True)
    category = models.ForeignKey(Categories, models.DO_NOTHING)
    exam_trail = models.ForeignKey('ExamTrails', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'categories_exam_trails'
        unique_together = (('exam_trail', 'category'),)


class ContactUs(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'contact_us'


class DiscountsCodes(models.Model):
    id = models.BigAutoField(primary_key=True)
    code = models.CharField(unique=True, max_length=255)
    marketer = models.CharField(max_length=255)
    type = models.IntegerField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    amount = models.DecimalField(max_digits=19, decimal_places=2, blank=True, null=True)
    quantity = models.IntegerField()
    used_count = models.IntegerField()
    from_date = models.DateField()
    to_date = models.DateField()
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'discounts_codes'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class ExamQuestions(models.Model):
    id = models.BigAutoField(primary_key=True)
    order = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    exam = models.ForeignKey('Exams', models.DO_NOTHING)
    question = models.ForeignKey('Questions', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'exam_questions'
        unique_together = (('exam', 'question'),)


class ExamSection(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    category = models.ForeignKey(Categories, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'exam_section'


class ExamSections(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    question = models.ForeignKey('Questions', models.DO_NOTHING)
    section = models.ForeignKey(ExamSection, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'exam_sections'
        unique_together = (('question', 'section'),)


class ExamTrails(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    question_count = models.IntegerField()
    mode = models.CharField(max_length=10)
    is_timed_mode = models.BooleanField()
    question_mode = models.CharField(max_length=10)
    total_questions = models.IntegerField()
    correct_answers = models.IntegerField()
    wrong_answers = models.IntegerField()
    stages = models.JSONField(blank=True, null=True)
    current_stage = models.IntegerField()
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'exam_trails'


class ExamTrailsSections(models.Model):
    id = models.BigAutoField(primary_key=True)
    exam_trail = models.ForeignKey(ExamTrails, models.DO_NOTHING)
    section = models.ForeignKey(ExamSection, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'exam_trails_sections'
        unique_together = (('exam_trail', 'section'),)


class ExamTrailsTopics(models.Model):
    id = models.BigAutoField(primary_key=True)
    exam_trail = models.ForeignKey(ExamTrails, models.DO_NOTHING)
    topic = models.ForeignKey('QuestionsTopics', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'exam_trails_topics'
        unique_together = (('exam_trail', 'topic'),)


class ExamTrialDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    is_correct = models.BooleanField(blank=True, null=True)
    is_marked = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    answer = models.ForeignKey('QuestionsAnswers', models.DO_NOTHING, blank=True, null=True)
    exam_trial = models.ForeignKey(ExamTrails, models.DO_NOTHING)
    question = models.ForeignKey('Questions', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'exam_trial_details'
        unique_together = (('exam_trial', 'question'),)


class Exams(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=500, blank=True, null=True)
    duration_minutes = models.IntegerField(blank=True, null=True)
    type = models.IntegerField(blank=True, null=True)
    status = models.IntegerField()
    order = models.IntegerField(blank=True, null=True)
    hint = models.TextField(blank=True, null=True)
    show_hint = models.BooleanField()
    show_answer = models.BooleanField()
    video_link = models.CharField(max_length=500, blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    cat = models.ForeignKey(Categories, models.DO_NOTHING, blank=True, null=True)
    sub_cat = models.ForeignKey(Categories, models.DO_NOTHING, related_name='exams_sub_cat_set', blank=True, null=True)
    sub_sub_cat = models.ForeignKey(Categories, models.DO_NOTHING, related_name='exams_sub_sub_cat_set', blank=True, null=True)
    attempts_allowed = models.IntegerField()
    certificate_available = models.BooleanField()
    difficulty_level = models.SmallIntegerField(blank=True, null=True)
    is_featured = models.BooleanField()
    exam_type = models.CharField(max_length=50, blank=True, null=True)
    has_auto_save = models.BooleanField()
    has_instant_result = models.BooleanField()
    has_progress_tracking = models.BooleanField()
    has_random_questions = models.BooleanField()
    has_timer = models.BooleanField()
    instructions = models.TextField(blank=True, null=True)
    instructor = models.ForeignKey('Instructors', models.DO_NOTHING, blank=True, null=True)
    language = models.CharField(max_length=50, blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    rules_policies = models.TextField(blank=True, null=True)
    skills_covered = models.TextField(blank=True, null=True)
    what_youll_be_tested_on = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'exams'


class Faqs(models.Model):
    id = models.BigAutoField(primary_key=True)
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField()
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'faqs'


class HyperpayResults(models.Model):
    id = models.BigAutoField(primary_key=True)
    type = models.CharField(max_length=20)
    payment_id = models.CharField(max_length=100)
    payment_brand = models.CharField(max_length=50, blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=19, decimal_places=2)
    currency = models.CharField(max_length=3)
    result_summary = models.JSONField()
    is_success = models.BooleanField()
    coupon = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    item = models.ForeignKey('Packages', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'hyperpay_results'


class Instructors(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    image = models.CharField(max_length=500, blank=True, null=True)
    specialization = models.CharField(max_length=255, blank=True, null=True)
    rate = models.DecimalField(max_digits=3, decimal_places=1)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    bio = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Categories, models.DO_NOTHING, blank=True, null=True)
    certificates_count = models.IntegerField()
    courses_count = models.IntegerField()
    facebook = models.CharField(max_length=500, blank=True, null=True)
    is_featured = models.BooleanField()
    linkedin = models.CharField(max_length=500, blank=True, null=True)
    order = models.IntegerField()
    status = models.IntegerField()
    students_count = models.IntegerField()
    title = models.CharField(max_length=255, blank=True, null=True)
    twitter = models.CharField(max_length=500, blank=True, null=True)
    years_of_experience = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'instructors'


class Invoices(models.Model):
    id = models.BigAutoField(primary_key=True)
    invoice_number = models.CharField(unique=True, max_length=255)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10)
    sent_to_accounting = models.BooleanField()
    sent_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    created_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='created_by', blank=True, null=True)
    sent_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='sent_by', related_name='invoices_sent_by_set', blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, related_name='invoices_user_set')
    user_package = models.ForeignKey('UserPackages', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'invoices'


class MoneyLogs(models.Model):
    id = models.BigAutoField(primary_key=True)
    platform = models.CharField(max_length=50)
    unique_id = models.CharField(max_length=50, blank=True, null=True)
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.IntegerField()
    coupon = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    item = models.ForeignKey('Packages', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'money_logs'


class NotificationReceipts(models.Model):
    id = models.BigAutoField(primary_key=True)
    is_read = models.BooleanField()
    read_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField()
    notification = models.ForeignKey('Notifications', models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'notification_receipts'
        unique_together = (('notification', 'user'),)


class Notifications(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notifications'


class OtpRequests(models.Model):
    id = models.BigAutoField(primary_key=True)
    phone = models.CharField(max_length=20)
    otp_hash = models.CharField(max_length=64)
    attempts = models.SmallIntegerField()
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    expires_at = models.DateTimeField()
    verified = models.BooleanField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'otp_requests'


class PackageExams(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    exam = models.ForeignKey(Exams, models.DO_NOTHING, blank=True, null=True)
    package = models.ForeignKey('Packages', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'package_exams'
        unique_together = (('package', 'exam'),)


class Packages(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.IntegerField()
    icon = models.CharField(max_length=500, blank=True, null=True)
    period_days = models.IntegerField(blank=True, null=True)
    number_of_questions = models.IntegerField(blank=True, null=True)
    trial_count = models.IntegerField()
    exam_count = models.IntegerField()
    is_trial = models.BooleanField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    category = models.ForeignKey(Categories, models.DO_NOTHING)
    daily_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_custom = models.BooleanField()
    code = models.CharField(unique=True, max_length=50, blank=True, null=True)
    duration_minutes = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    logo = models.CharField(max_length=500, blank=True, null=True)
    difficulty_level = models.SmallIntegerField(blank=True, null=True)
    discount_percentage = models.IntegerField()
    is_bestseller = models.BooleanField()
    is_new = models.BooleanField()
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    students_count = models.IntegerField()
    instructor = models.ForeignKey(Instructors, models.DO_NOTHING, blank=True, null=True)
    is_featured = models.BooleanField()
    language = models.CharField(max_length=50, blank=True, null=True)
    lessons_count = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'packages'


class PackagesSubCategories(models.Model):
    id = models.BigAutoField(primary_key=True)
    package = models.ForeignKey(Packages, models.DO_NOTHING)
    sub_category = models.ForeignKey(Categories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'packages_sub_categories'
        unique_together = (('sub_category', 'package'),)


class Partners(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    logo = models.CharField(max_length=500, blank=True, null=True)
    website_url = models.CharField(max_length=500, blank=True, null=True)
    order = models.IntegerField()
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partners'


class PasswordResetTokens(models.Model):
    id = models.BigAutoField(primary_key=True)
    token_hash = models.CharField(max_length=64)
    expires_at = models.DateTimeField()
    used = models.BooleanField()
    created_at = models.DateTimeField()
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'password_reset_tokens'


class PaymentTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'payment_types'


class QuestionTopics(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    question = models.ForeignKey('Questions', models.DO_NOTHING)
    topic = models.ForeignKey('QuestionsTopics', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'question_topics'
        unique_together = (('question', 'topic'),)


class Questions(models.Model):
    id = models.BigAutoField(primary_key=True)
    text_question = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField()
    question_type = models.IntegerField(blank=True, null=True)
    answer_type = models.IntegerField(blank=True, null=True)
    hint = models.TextField(blank=True, null=True)
    show_answer_explanation = models.BooleanField()
    show_hint = models.BooleanField()
    show_answer = models.BooleanField()
    show_video = models.BooleanField()
    video_link = models.CharField(max_length=500, blank=True, null=True)
    time_minutes = models.IntegerField(blank=True, null=True)
    question_has_image = models.BooleanField()
    question_image = models.CharField(max_length=500, blank=True, null=True)
    answer_has_image = models.BooleanField()
    answer_image = models.CharField(max_length=500, blank=True, null=True)
    sort_order = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    category = models.ForeignKey(Categories, models.DO_NOTHING, blank=True, null=True)
    correct_answer = models.ForeignKey('QuestionsAnswers', models.DO_NOTHING, blank=True, null=True)
    sub_category = models.ForeignKey(Categories, models.DO_NOTHING, related_name='questions_sub_category_set', blank=True, null=True)
    sub_subcategory = models.ForeignKey(Categories, models.DO_NOTHING, related_name='questions_sub_subcategory_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'questions'


class QuestionsAnswers(models.Model):
    id = models.BigAutoField(primary_key=True)
    answer_option = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    question = models.ForeignKey(Questions, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'questions_answers'


class QuestionsTopics(models.Model):
    id = models.BigAutoField(primary_key=True)
    topic = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    category = models.ForeignKey(Categories, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'questions_topics'


class Settings(models.Model):
    id = models.BigAutoField(primary_key=True)
    key = models.CharField(unique=True, max_length=255)
    value = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'settings'


class SubCategoriesExamTrails(models.Model):
    id = models.BigAutoField(primary_key=True)
    exam_trail = models.ForeignKey(ExamTrails, models.DO_NOTHING)
    sub_category = models.ForeignKey(Categories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'sub_categories_exam_trails'
        unique_together = (('exam_trail', 'sub_category'),)


class SubSubCategoriesExamTrails(models.Model):
    id = models.BigAutoField(primary_key=True)
    exam_trail = models.ForeignKey(ExamTrails, models.DO_NOTHING)
    sub_sub_category = models.ForeignKey(Categories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'sub_sub_categories_exam_trails'
        unique_together = (('exam_trail', 'sub_sub_category'),)


class SupportRequests(models.Model):
    id = models.BigAutoField(primary_key=True)
    question_text = models.TextField()
    message = models.TextField()
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    question = models.ForeignKey(Questions, models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'support_requests'


class Testimonials(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    rating = models.SmallIntegerField(blank=True, null=True)
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    is_verified = models.BooleanField()
    profile_image = models.CharField(max_length=500, blank=True, null=True)
    specialty = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'testimonials'


class UserExamQuestionsAnswers(models.Model):
    id = models.BigAutoField(primary_key=True)
    answer = models.CharField(max_length=255, blank=True, null=True)
    is_correct = models.BooleanField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    exam = models.ForeignKey(Exams, models.DO_NOTHING)
    question = models.ForeignKey(Questions, models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    user_exam = models.ForeignKey('UserExams', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_exam_questions_answers'


class UserExamTrials(models.Model):
    id = models.BigAutoField(primary_key=True)
    date = models.DateField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    exam = models.ForeignKey(Exams, models.DO_NOTHING)
    subscription = models.ForeignKey('UserPackages', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'user_exam_trials'


class UserExams(models.Model):
    id = models.BigAutoField(primary_key=True)
    score = models.IntegerField(blank=True, null=True)
    correct_answers = models.IntegerField()
    wrong_answers = models.IntegerField()
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    exam = models.ForeignKey(Exams, models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'user_exams'


class UserPackages(models.Model):
    id = models.BigAutoField(primary_key=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    price = models.DecimalField(max_digits=19, decimal_places=2)
    price_before_discount = models.DecimalField(max_digits=19, decimal_places=2, blank=True, null=True)
    discount = models.DecimalField(max_digits=19, decimal_places=2, blank=True, null=True)
    pay_id = models.IntegerField(blank=True, null=True)
    subscription_status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    package = models.ForeignKey(Packages, models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'user_packages'


class UserProfiles(models.Model):
    id = models.BigAutoField(primary_key=True)
    specialization = models.CharField(max_length=255, blank=True, null=True)
    governorate = models.CharField(max_length=255, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    profile_completed = models.BooleanField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    user = models.OneToOneField('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'user_profiles'


class Users(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(unique=True, max_length=255, blank=True, null=True)
    is_email_verified = models.BooleanField()
    phone = models.CharField(unique=True, max_length=20, blank=True, null=True)
    phone_country_code = models.CharField(max_length=10, blank=True, null=True)
    is_phone_verified = models.BooleanField()
    thumb = models.CharField(max_length=500, blank=True, null=True)
    device_id = models.CharField(max_length=255, blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    role_type = models.IntegerField()
    status = models.IntegerField()
    is_staff = models.BooleanField()
    is_superuser = models.BooleanField()
    date_joined = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class UsersCreditCards(models.Model):
    id = models.BigAutoField(primary_key=True)
    token = models.CharField(max_length=255)
    last4 = models.CharField(max_length=4)
    brand = models.CharField(max_length=50, blank=True, null=True)
    expiry_month = models.SmallIntegerField()
    expiry_year = models.SmallIntegerField()
    is_active = models.BooleanField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    user = models.ForeignKey(Users, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_credit_cards'


class UsersGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(Users, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_groups'
        unique_together = (('user', 'group'),)


class UsersUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(Users, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_user_permissions'
        unique_together = (('user', 'permission'),)
