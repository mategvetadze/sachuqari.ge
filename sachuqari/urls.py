from django.urls import path
from . import views
urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.admin_login, name='admin_login'),
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('delete-order/<int:order_id>/', views.delete_order, name='delete_order'),
]