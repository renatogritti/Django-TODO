function openListModal() {
    document.getElementById('list_id').value = '';
    document.getElementById('id_list_title').value = '';
    document.querySelector('#listModal .modal-header h2').textContent = 'Nova Lista';
    document.getElementById('listModal').style.display = 'flex';
}

function openEditListModal(listId, title) {
    document.getElementById('list_id').value = listId;
    document.getElementById('id_list_title').value = title;
    document.querySelector('#listModal .modal-header h2').textContent = 'Editar Lista';
    document.getElementById('listModal').style.display = 'flex';
}

function closeListModal() {
    document.getElementById('listModal').style.display = 'none';
}

function submitListForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const listId = document.getElementById('list_id').value;

    let url = listId ? 
        `/list/${listId}/edit/` : 
        `/list/new/`;

    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            closeListModal();
            location.reload();  // Simples reload para listas
        } else {
            console.error('Erro:', data.errors);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    return false;
}

// Fechar modal quando clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('listModal');
    if (event.target == modal) {
        closeListModal();
    }
}
