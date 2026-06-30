from django import forms
from apps.users.models import User
from apps.dashboard.arabic import to_arabic


class BaseDashboardForm(forms.ModelForm):
    """Base form that adds Tailwind classes and Arabic labels to every widget."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            field.label = to_arabic(field.label)
            if field.help_text:
                field.help_text = to_arabic(field.help_text)

            # Translate simple choice labels
            if hasattr(field, 'choices') and field.choices:
                new_choices = []
                for value, label in field.choices:
                    new_choices.append((value, to_arabic(label)))
                field.choices = new_choices

            widget = field.widget
            if isinstance(widget, forms.CheckboxInput):
                widget.attrs.setdefault('class', 'w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500')
            elif isinstance(widget, (forms.Select, forms.SelectMultiple)):
                widget.attrs.setdefault('class', 'w-full rounded-lg border-slate-300 focus:border-brand-500 focus:ring-brand-500')
            elif isinstance(widget, forms.Textarea):
                widget.attrs.setdefault('class', 'w-full rounded-lg border-slate-300 focus:border-brand-500 focus:ring-brand-500 min-h-[120px]')
            elif isinstance(widget, forms.DateInput):
                widget.attrs.setdefault('type', 'date')
                widget.attrs.setdefault('class', 'w-full rounded-lg border-slate-300 focus:border-brand-500 focus:ring-brand-500')
            elif isinstance(widget, forms.DateTimeInput):
                widget.attrs.setdefault('class', 'w-full rounded-lg border-slate-300 focus:border-brand-500 focus:ring-brand-500')
            else:
                widget.attrs.setdefault('class', 'w-full rounded-lg border-slate-300 focus:border-brand-500 focus:ring-brand-500')


class UserDashboardForm(BaseDashboardForm):
    """User form that works for both create and update."""

    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput,
        required=False,
    )
    password2 = forms.CharField(
        label='Confirm password',
        widget=forms.PasswordInput,
        required=False,
    )

    class Meta:
        model = User
        fields = [
            'phone', 'first_name', 'last_name', 'email',
            'role_type', 'status', 'is_staff', 'is_superuser',
            'is_phone_verified', 'is_email_verified',
        ]

    def clean(self):
        cleaned = super().clean()
        p1 = cleaned.get('password1')
        p2 = cleaned.get('password2')
        if p1 or p2:
            if p1 != p2:
                self.add_error('password2', 'كلمتا المرور غير متطابقتين.')
        return cleaned

    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password1')
        if password:
            user.set_password(password)
        if commit:
            user.save()
            self.save_m2m()
        return user
