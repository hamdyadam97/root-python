"""
Tests for users app.
"""
from django.test import TestCase
from django.utils import timezone
from apps.users.models import User, UserProfile, OtpRequest
from apps.users.services import UserService, OtpService


class UserServiceTests(TestCase):
    def test_signup_creates_user_and_profile(self):
        user, otp = UserService.signup({
            'first_name': 'John',
            'last_name': 'Doe',
            'phone': '962791234567',
            'password': 'securepass123',
            'specialization': 'Medicine',
            'governorate': 'Amman',
            'birth_date': '1990-01-01',
        })
        self.assertEqual(user.phone, '962791234567')
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
        self.assertEqual(user.profile.specialization, 'Medicine')

    def test_login_with_valid_credentials(self):
        user, _ = UserService.signup({
            'first_name': 'John',
            'last_name': 'Doe',
            'phone': '962791234567',
            'password': 'securepass123',
        })
        logged_in, _ = UserService.login('962791234567', 'securepass123')
        self.assertEqual(logged_in, user)

    def test_login_with_invalid_password(self):
        UserService.signup({
            'first_name': 'John',
            'last_name': 'Doe',
            'phone': '962791234567',
            'password': 'securepass123',
        })
        logged_in, _ = UserService.login('962791234567', 'wrongpassword')
        self.assertIsNone(logged_in)


class OtpServiceTests(TestCase):
    def test_generate_and_verify_otp(self):
        otp = OtpService.generate('962791234567')
        ok, msg = OtpService.verify('962791234567', otp)
        self.assertTrue(ok)

    def test_verify_invalid_otp(self):
        OtpService.generate('962791234567')
        ok, msg = OtpService.verify('962791234567', '000000')
        self.assertFalse(ok)

    def test_expired_otp(self):
        otp = OtpService.generate('962791234567')
        OtpRequest.objects.update(expires_at=timezone.now() - timezone.timedelta(minutes=1))
        ok, msg = OtpService.verify('962791234567', otp)
        self.assertFalse(ok)
