from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('list/new/', views.tasklist_create, name='tasklist-create'),
    path('list/<int:list_id>/task/new/', views.task_create, name='task-create'),
    path('task/<int:pk>/edit/', views.task_update, name='task-update'),
    path('task/<int:pk>/delete/', views.task_delete, name='task-delete'),
    path('task/<int:pk>/toggle/', views.toggle_task_status, name='task-toggle'),
    path('tasks/reorder/', views.update_task_order, name='task-reorder'),
    path('list/<int:pk>/edit/', views.tasklist_update, name='tasklist-update'),
    path('list/<int:pk>/delete/', views.tasklist_delete, name='tasklist-delete'),
    path('edit_task/<int:task_id>/', views.edit_task, name='edit_task'),
]
