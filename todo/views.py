from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView
from .models import Task, TaskList
from .forms import TaskForm, TaskListForm
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
import json

class TaskListView(ListView):
    model = Task
    template_name = 'todo/task_list.html'
    context_object_name = 'tasks'

def home_view(request):
    lists = TaskList.objects.all()
    active_list = None
    tasks = []
    
    if lists.exists():
        active_list = lists.first()
        list_id = request.GET.get('list', active_list.id)
        active_list = get_object_or_404(TaskList, id=list_id)
        tasks = active_list.tasks.all()
    
    return render(request, 'todo/home.html', {
        'lists': lists,
        'active_list': active_list,
        'tasks': tasks,
        'list_id': active_list.id if active_list else None
    })

def task_create(request, list_id):
    task_list = get_object_or_404(TaskList, id=list_id)
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.task_list = task_list
            task.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return render(request, 'todo/task_form.html', {'form': form, 'task_list': task_list})

def task_update(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'POST':
        # Criar uma cópia do POST para modificar
        post_data = request.POST.copy()
        
        # Converter o valor do checkbox completed
        post_data['completed'] = post_data.get('completed', 'false').lower() == 'true'
        
        form = TaskForm(post_data, instance=task)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error', 'errors': form.errors})
    return render(request, 'todo/task_form.html', {'form': form})

def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'POST':
        task.delete()
        return JsonResponse({'status': 'success'})
    return render(request, 'todo/task_confirm_delete.html', {
        'task': task,
        'task_list': task.task_list
    })

def tasklist_update(request, pk):
    task_list = get_object_or_404(TaskList, pk=pk)
    if request.method == 'POST':
        form = TaskListForm(request.POST, instance=task_list)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error', 'errors': form.errors})
    return render(request, 'todo/tasklist_form.html', {'form': form})

def tasklist_delete(request, pk):
    task_list = get_object_or_404(TaskList, pk=pk)
    if request.method == 'POST':
        task_list.delete()
        return JsonResponse({'status': 'success'})
    return render(request, 'todo/tasklist_confirm_delete.html', {'tasklist': task_list})

@require_POST
def update_task_order(request):
    order_data = json.loads(request.body)
    for task_data in order_data:
        Task.objects.filter(id=task_data['id']).update(order=task_data['order'])
    return JsonResponse({'status': 'success'})

@require_POST
def toggle_task_status(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.completed = not task.completed
    task.save()
    return JsonResponse({'status': 'success', 'completed': task.completed})

def tasklist_create(request):
    if request.method == 'POST':
        form = TaskListForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error', 'errors': form.errors})
    return render(request, 'todo/tasklist_form.html', {'form': form})

@require_http_methods(["POST"])
def edit_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task.title = request.POST.get('title')
        task.description = request.POST.get('description')
        task.priority = request.POST.get('priority')
        task.completed = request.POST.get('completed') == 'on'
        task.save()
        return JsonResponse({'status': 'success'})
    except Task.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Tarefa não encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
