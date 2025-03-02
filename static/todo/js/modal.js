function openTaskModal() {
    document.getElementById('task_id').value = '';
    document.getElementById('id_title').value = '';
    document.getElementById('id_description').value = '';
    document.getElementById('id_priority').value = 'M';
    document.getElementById('id_completed').checked = false;
    document.querySelector('.modal-header h2').textContent = 'Nova Tarefa';
    document.getElementById('taskModal').style.display = 'flex';
}

function openEditTaskModal(taskId, title, description, priority, completed) {
    document.getElementById('task_id').value = taskId;
    document.getElementById('id_title').value = title || '';
    document.getElementById('id_description').value = description || '';
    document.getElementById('id_priority').value = priority || 'M';
    document.getElementById('id_completed').checked = completed === true;
    document.querySelector('#taskModal .modal-header h2').textContent = 'Editar Tarefa';
    document.getElementById('taskModal').style.display = 'flex';
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function submitTaskForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const taskId = document.getElementById('task_id').value;
    const activeListId = document.querySelector('.tasks-panel').dataset.listId;

    // Configurar a URL correta baseada se é edição ou criação
    const url = taskId ? 
        `/task/${taskId}/edit/` : 
        `/list/${activeListId}/task/new/`;

    // Garantir que o checkbox seja enviado corretamente
    const completedValue = document.getElementById('id_completed').checked;
    formData.set('completed', completedValue);

    // Remover o campo task_id do FormData
    formData.delete('task_id');

    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            window.location.reload();
        } else {
            alert('Erro ao salvar a tarefa: ' + JSON.stringify(data.errors));
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao processar a requisição');
    })
    .finally(() => {
        closeTaskModal();
    });

    return false;
}

// Fechar modal quando clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('taskModal');
    if (event.target == modal) {
        closeTaskModal();
    }
}

document.querySelector('.close-modal').onclick = closeTaskModal;
