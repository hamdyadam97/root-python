from django.urls import path
from apps.dashboard import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.DashboardView.as_view(), name='index'),
    path('questions/create/', views.QuestionCreateView.as_view(), name='question_create'),
    path('questions/<int:pk>/edit/', views.QuestionUpdateView.as_view(), name='question_update'),
    path('<str:section>/', views.ModelListView.as_view(), name='list'),
    path('<str:section>/create/', views.ModelCreateView.as_view(), name='create'),
    path('<str:section>/<int:pk>/edit/', views.ModelUpdateView.as_view(), name='update'),
    path('<str:section>/<int:pk>/delete/', views.ModelDeleteView.as_view(), name='delete'),
]
