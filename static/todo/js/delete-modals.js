let deleteTaskId = null;
let deleteListId = null;

// Funções para o modal de deletar tarefa
function openDeleteTaskModal(taskId, taskTitle) {
    deleteTaskId = taskId;
    document.getElementById('deleteTaskName').textContent = taskTitle;
    document.getElementById('deleteTaskModal').style.display = 'flex';
}

function closeDeleteTaskModal() {
    deleteTaskId = null;
    document.getElementById('deleteTaskModal').style.display = 'none';
}

function confirmDeleteTask() {
    if (!deleteTaskId) return;

    fetch(`/task/${deleteTaskId}/delete/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        }
    });
}

// Funções para o modal de deletar lista
function openDeleteListModal(listId, listTitle) {
    deleteListId = listId;
    document.getElementById('deleteListName').textContent = listTitle;
    document.getElementById('deleteListModal').style.display = 'flex';
}

function closeDeleteListModal() {
    deleteListId = null;
    document.getElementById('deleteListModal').style.display = 'none';
}

function confirmDeleteList() {
    if (!deleteListId) return;

    fetch(`/list/${deleteListId}/delete/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        }
    });
}

// Fechar modais quando clicar fora
window.onclick = function(event) {
    if (event.target == document.getElementById('deleteTaskModal')) {
        closeDeleteTaskModal();
    }
    if (event.target == document.getElementById('deleteListModal')) {
        closeDeleteListModal();
    }
}
