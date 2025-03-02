document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.querySelector('.task-list');
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        draggedItem = null;
        updateTaskOrder();
    }

    function handleDragOver(e) {
        e.preventDefault();
        const taskItem = e.target.closest('.task-item');
        if (!taskItem || taskItem === draggedItem) return;

        const box = taskItem.getBoundingClientRect();
        const draggedBox = draggedItem.getBoundingClientRect();
        const dragY = e.clientY - box.top - (box.height / 2);

        if (dragY < 0 && taskItem.previousElementSibling !== draggedItem) {
            taskItem.parentNode.insertBefore(draggedItem, taskItem);
        } else if (dragY > 0 && taskItem.nextElementSibling !== draggedItem) {
            taskItem.parentNode.insertBefore(draggedItem, taskItem.nextElementSibling);
        }
    }

    function updateTaskOrder() {
        const tasks = document.querySelectorAll('.task-item');
        const orderData = Array.from(tasks).map((task, index) => ({
            id: task.dataset.taskId,
            order: index
        }));

        fetch('/tasks/reorder/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(orderData)
        });
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    document.querySelectorAll('.task-item').forEach(task => {
        task.setAttribute('draggable', true);
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
    });

    taskList.addEventListener('dragover', handleDragOver);
});
