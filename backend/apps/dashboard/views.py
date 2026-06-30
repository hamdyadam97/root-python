from datetime import timedelta
from django.db.models import Count, Sum, Q
from django.db.models.functions import TruncDate
from django import forms
from django.forms import modelform_factory
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView, ListView, CreateView, UpdateView, DeleteView
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.mixins import UserPassesTestMixin

from apps.users.models import User
from apps.content.models import Category, Blog, Testimonial, SupportRequest
from apps.exams.models import Question, Exam, ExamTrail
from apps.packages.models import Package, UserPackage
from apps.payments.models import PaymentTransaction, Invoice

from apps.dashboard.registry import get_config
from apps.dashboard.forms import BaseDashboardForm, UserDashboardForm
from apps.dashboard.exam_forms import QuestionForm, AnswerFormSet


class StaffRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_active and self.request.user.is_staff


@method_decorator(staff_member_required, name='dispatch')
class DashboardView(TemplateView):
    template_name = 'dashboard/index.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        today = timezone.now()
        last_30 = today - timedelta(days=30)

        ctx['stats'] = {
            'users': User.objects.filter(deleted_at__isnull=True).count(),
            'users_last_30': User.objects.filter(date_joined__gte=last_30).count(),
            'questions': Question.objects.count(),
            'exams': Exam.objects.count(),
            'exam_trails': ExamTrail.objects.count(),
            'categories': Category.objects.count(),
            'blogs': Blog.objects.count(),
            'packages': Package.objects.count(),
            'subscriptions': UserPackage.objects.count(),
            'active_subscriptions': UserPackage.objects.filter(
                subscription_status=UserPackage.ACTIVE,
                end_date__gte=today.date(),
            ).count(),
            'transactions': PaymentTransaction.objects.filter(is_success=True).count(),
            'revenue': PaymentTransaction.objects.filter(is_success=True).aggregate(
                total=Sum('amount')
            )['total'] or 0,
            'invoices': Invoice.objects.count(),
            'pending_testimonials': Testimonial.objects.filter(status=Testimonial.PENDING).count(),
            'open_support': SupportRequest.objects.filter(status=SupportRequest.STATUS_OPEN).count(),
        }

        ctx['recent_users'] = User.objects.filter(deleted_at__isnull=True).order_by('-date_joined')[:8]
        ctx['recent_transactions'] = PaymentTransaction.objects.select_related('user', 'package').order_by('-created_at')[:8]
        ctx['recent_subscriptions'] = UserPackage.objects.select_related('user', 'package').order_by('-created_at')[:8]
        ctx['recent_trails'] = ExamTrail.objects.select_related('user').order_by('-created_at')[:8]

        ctx['chart_labels'] = [(last_30 + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(31)]

        def to_daily_map(qs):
            return {str(item['date']): item['count'] for item in qs}

        users_daily = to_daily_map(
            User.objects.filter(date_joined__date__gte=last_30.date())
            .annotate(date=TruncDate('date_joined'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        transactions_daily = to_daily_map(
            PaymentTransaction.objects.filter(created_at__date__gte=last_30.date(), is_success=True)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        trails_daily = to_daily_map(
            ExamTrail.objects.filter(created_at__date__gte=last_30.date())
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        ctx['users_chart'] = [users_daily.get(d, 0) for d in ctx['chart_labels']]
        ctx['transactions_chart'] = [transactions_daily.get(d, 0) for d in ctx['chart_labels']]
        ctx['trails_chart'] = [trails_daily.get(d, 0) for d in ctx['chart_labels']]

        return ctx


class ModelCRUDMixin(StaffRequiredMixin):
    """Shared logic for model-based CRUD views."""

    required_permission = None

    def dispatch(self, request, *args, **kwargs):
        self.section = self.kwargs.get('section')
        self.config = get_config(self.section)
        if not self.config:
            raise Http404('Section not found')
        self.model = self.config['model']
        self.model_meta = self.model._meta

        if self.required_permission and not self._check_permission(self.required_permission):
            raise Http404('Permission denied')

        return super().dispatch(request, *args, **kwargs)

    def get_form_class(self):
        if self.model == User:
            return UserDashboardForm
        exclude = self.config.get('exclude', ['created_at', 'updated_at', 'deleted_at'])
        return modelform_factory(self.model, form=BaseDashboardForm, exclude=exclude)

    def get_queryset(self):
        return self.model.objects.all()

    def get_success_url(self):
        return reverse_lazy('dashboard:list', kwargs={'section': self.section})

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['config'] = self.config
        ctx['section'] = self.section
        ctx['model_meta'] = self.model_meta
        return ctx

    def _check_permission(self, codename):
        perm = f"{self.model_meta.app_label}.{codename}_{self.model_meta.model_name}"
        return self.request.user.has_perm(perm) or self.request.user.is_superuser


class ModelListView(ModelCRUDMixin, ListView):
    template_name = 'dashboard/crud/list.html'
    paginate_by = 25
    context_object_name = 'object_list'

    def get_queryset(self):
        qs = super().get_queryset()
        if hasattr(self.model, 'deleted_at'):
            qs = qs.filter(deleted_at__isnull=True)
        if not self.model._meta.ordering:
            qs = qs.order_by('-pk')
        search_fields = self.config.get('search_fields', [])
        q = self.request.GET.get('q')
        if q and search_fields:
            query = Q()
            for field in search_fields:
                query |= Q(**{f'{field}__icontains': q})
            qs = qs.filter(query)

        list_filter = self.config.get('list_filter', [])
        for field_name in list_filter:
            value = self.request.GET.get(f'f_{field_name}')
            if value:
                field = self.model._meta.get_field(field_name)
                if field.is_relation:
                    qs = qs.filter(**{f'{field_name}__id': value})
                elif field.get_internal_type() == 'BooleanField':
                    qs = qs.filter(**{field_name: value == '1'})
                else:
                    qs = qs.filter(**{field_name: value})
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['search_query'] = self.request.GET.get('q', '')
        ctx['list_display'] = self.config.get('list_display', ['__str__'])
        ctx['filters'] = self._build_filters()
        return ctx

    def _build_filters(self):
        filters = []
        list_filter = self.config.get('list_filter', [])
        for field_name in list_filter:
            field = self.model._meta.get_field(field_name)
            options = []
            if field.choices:
                for value, label in field.choices:
                    options.append({'value': str(value), 'label': label})
            elif field.get_internal_type() == 'BooleanField':
                options = [{'value': '1', 'label': 'Yes'}, {'value': '0', 'label': 'No'}]
            elif field.is_relation and field.related_model:
                related = field.related_model.objects.all()[:50]
                for obj in related:
                    options.append({'value': str(obj.pk), 'label': str(obj)})
            else:
                values = self.model.objects.values_list(field_name, flat=True).distinct()[:50]
                for value in values:
                    if value:
                        options.append({'value': str(value), 'label': str(value)})
            filters.append({
                'name': f'f_{field_name}',
                'label': field.verbose_name,
                'options': options,
                'current': self.request.GET.get(f'f_{field_name}', ''),
            })
        return filters


class ModelCreateView(ModelCRUDMixin, CreateView):
    template_name = 'dashboard/crud/form.html'
    required_permission = 'add'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['action'] = 'create'
        ctx['object'] = None
        return ctx


class ModelUpdateView(ModelCRUDMixin, UpdateView):
    template_name = 'dashboard/crud/form.html'
    required_permission = 'change'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['action'] = 'update'
        return ctx


class ModelDeleteView(ModelCRUDMixin, DeleteView):
    template_name = 'dashboard/crud/delete.html'
    required_permission = 'delete'

    def get_form_class(self):
        return forms.Form

    def get_object(self, queryset=None):
        return get_object_or_404(self.model, pk=self.kwargs.get('pk'))

    def form_valid(self, form):
        if hasattr(self.object, 'deleted_at'):
            self.object.deleted_at = timezone.now()
            self.object.save(update_fields=['deleted_at'])
        else:
            self.object.delete()
        return HttpResponseRedirect(self.get_success_url())


class QuestionBaseView(StaffRequiredMixin):
    """Base for the custom question create/update views."""

    model = Question
    form_class = QuestionForm
    template_name = 'dashboard/questions/form.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['section'] = 'questions'
        ctx['config'] = get_config('questions')
        ctx['answer_formset'] = ctx.get('answer_formset') or self.get_answer_formset()
        return ctx

    def get_answer_formset(self):
        raise NotImplementedError

    def _save_correct_answer(self, question, formset):
        """Set question.correct_answer based on the selected correct answer row."""
        for form in formset.forms:
            if form.cleaned_data.get('DELETE'):
                continue
            if form.cleaned_data.get('is_correct'):
                question.correct_answer = form.instance
                question.save(update_fields=['correct_answer'])
                return


class QuestionCreateView(QuestionBaseView, CreateView):
    """Custom create view for questions with inline answers."""

    def get_answer_formset(self):
        return AnswerFormSet(prefix='answers')

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        if self.request.method == 'GET':
            ctx['answer_formset'] = self.get_answer_formset()
        return ctx

    def post(self, request, *args, **kwargs):
        self.object = None
        form = self.get_form()
        formset = AnswerFormSet(request.POST, prefix='answers')
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form, formset)
        return self.form_invalid(form, formset)

    def form_valid(self, form, formset):
        self.object = form.save()
        formset.instance = self.object
        formset.save()
        self._save_correct_answer(self.object, formset)
        return HttpResponseRedirect(self.get_success_url())

    def form_invalid(self, form, formset):
        return self.render_to_response(self.get_context_data(form=form, answer_formset=formset))

    def get_success_url(self):
        return reverse_lazy('dashboard:list', kwargs={'section': 'questions'})


class QuestionUpdateView(QuestionBaseView, UpdateView):
    """Custom update view for questions with inline answers."""

    def get_answer_formset(self):
        kwargs = {'instance': self.object, 'prefix': 'answers'}
        formset = AnswerFormSet(**kwargs)
        for form in formset.forms:
            form.initial['is_correct'] = (self.object.correct_answer_id == form.instance.pk)
        return formset

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        if self.request.method == 'GET':
            ctx['answer_formset'] = self.get_answer_formset()
        return ctx

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = self.get_form()
        formset = AnswerFormSet(request.POST, instance=self.object, prefix='answers')
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form, formset)
        return self.form_invalid(form, formset)

    def form_valid(self, form, formset):
        self.object = form.save()
        formset.save()
        self._save_correct_answer(self.object, formset)
        return HttpResponseRedirect(self.get_success_url())

    def form_invalid(self, form, formset):
        return self.render_to_response(self.get_context_data(form=form, answer_formset=formset))

    def get_success_url(self):
        return reverse_lazy('dashboard:list', kwargs={'section': 'questions'})
