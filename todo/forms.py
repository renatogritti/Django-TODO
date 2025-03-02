from django import forms
from .models import Task, TaskList

class TaskListForm(forms.ModelForm):
    class Meta:
        model = TaskList
        fields = ['title']

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'priority', 'completed']
