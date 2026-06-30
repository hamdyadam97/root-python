"""
Payment API views.
"""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from apps.core.utils import api_response, api_get, api_post


class BaseApiView(APIView):
    pass


class PaymentCallbackView(BaseApiView):
    permission_classes = [IsAuthenticated]

    @api_post('PaymentCallback')
    def post(self, request):
        # Placeholder for HyperPay callback
        return api_response(True, 'Payment callback received', {})


class PaymentStatusView(BaseApiView):
    permission_classes = [IsAuthenticated]

    @api_get('PaymentStatus')
    def get(self, request):
        # Placeholder for HyperPay status check
        return api_response(True, 'Payment status', {'status': 'pending'})
