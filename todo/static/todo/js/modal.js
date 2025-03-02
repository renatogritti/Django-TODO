function openEditTaskModal(taskId, title, description, priority, completed) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    
    // Atualizar o título do modal
    modal.querySelector('.modal-header h2').textContent = 'Editar Tarefa';
    
    // Preencher os campos do formulário
    document.getElementById('task_id').value = taskId;
    document.getElementById('id_title').value = title;
    document.getElementById('id_description').value = description;
    document.getElementById('id_priority').value = priority;
    document.getElementById('id_completed').checked = completed;
    
    modal.style.display = 'block';
}

function submitTaskForm(event) {
    event.preventDefault();
    const form = document.getElementById('taskForm');
    const taskId = document.getElementById('task_id').value;
    const formData = new FormData(form);
    
    const url = taskId ? `/todo/edit_task/${taskId}/` : '/todo/add_task/';
    
    fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': formData.get('csrfmiddlewaretoken')
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Erro ao salvar tarefa');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar tarefa');
    });

    return false;
}