from django.db import models

class TaskList(models.Model):
    title = models.CharField(max_length=200)
    created_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('B', 'Baixa'),
        ('M', 'Média'),
        ('A', 'Alta'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='M')
    order = models.IntegerField(default=0)
    task_list = models.ForeignKey(TaskList, related_name='tasks', on_delete=models.CASCADE)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
