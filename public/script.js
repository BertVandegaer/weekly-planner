document.addEventListener('DOMContentLoaded', () => {
  // Initialize the planner
  initPlanner();
  
  // Load saved tasks
  loadTasks();
});

function initPlanner() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekContainer = document.querySelector('.week-container');
  
  // Create day columns
  days.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    dayElement.id = day.toLowerCase();
    
    dayElement.innerHTML = `
      <h2>${day}</h2>
      <div class="time-slots">
        ${generateTimeSlots()}
      </div>
    `;
    
    weekContainer.appendChild(dayElement);
    
    // Set up drop zone
    dayElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      dayElement.classList.add('drag-over');
    });
    
    dayElement.addEventListener('dragleave', () => {
      dayElement.classList.remove('drag-over');
    });
    
    dayElement.addEventListener('drop', (e) => {
      e.preventDefault();
      dayElement.classList.remove('drag-over');
      
      const taskId = e.dataTransfer.getData('text/plain');
      const task = document.getElementById(taskId);
      const timeSlots = dayElement.querySelector('.time-slots');
      
      // Calculate position based on drop coordinates
      const rect = timeSlots.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const slotHeight = 60; // 60px per hour
      const hours = Math.max(8, Math.min(18, Math.floor(y / slotHeight) + 8));
      
      task.style.top = `${(hours - 8) * slotHeight}px`;
      timeSlots.appendChild(task);
      
      saveTasks();
    });
  });
  
  // Add task button
  document.getElementById('add-task').addEventListener('click', addNewTask);
  
  // Clear all button
  document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tasks?')) {
      document.querySelectorAll('.task').forEach(task => task.remove());
      localStorage.removeItem('weeklyPlannerTasks');
    }
  });
}

function generateTimeSlots() {
  let slots = '';
  for (let hour = 8; hour <= 18; hour++) {
    const time = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
    slots += `<div class="time-marker" data-time="${time}"></div>`;
  }
  return slots;
}

function addNewTask() {
  const taskName = prompt('Enter task name:');
  if (!taskName) return;
  
  const duration = prompt('Duration in minutes (30, 60, 90):', '60');
  if (!duration) return;
  
  const taskId = 'task-' + Date.now();
  const task = document.createElement('div');
  task.className = 'task';
  task.id = taskId;
  task.draggable = true;
  task.style.height = `${parseInt(duration) / 60 * 60}px`;
  task.style.backgroundColor = getRandomTaskColor();
  
  task.innerHTML = `
    ${taskName} (${duration}m)
    <div class="task-actions">
      <button class="delete-task">×</button>
    </div>
  `;
  
  // Set up drag and delete
  task.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', taskId);
  });
  
  task.querySelector('.delete-task').addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Delete this task?')) {
      task.remove();
      saveTasks();
    }
  });
  
  // Add to Monday by default
  const monday = document.getElementById('monday');
  if (monday) {
    monday.querySelector('.time-slots').appendChild(task);
    saveTasks();
  }
}

function getRandomTaskColor() {
  const colors = getComputedStyle(document.documentElement)
    .getPropertyValue('--task-colors')
    .split(',')
    .map(c => c.trim());
  return colors[Math.floor(Math.random() * colors.length)];
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task').forEach(task => {
    const day = task.closest('.day');
    if (day) {
      tasks.push({
        id: task.id,
        html: task.outerHTML,
        day: day.id,
        top: task.style.top,
        height: task.style.height,
        bgColor: task.style.backgroundColor
      });
    }
  });
  localStorage.setItem('weeklyPlannerTasks', JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('weeklyPlannerTasks'));
  if (savedTasks && savedTasks.length > 0) {
    savedTasks.forEach(taskData => {
      const day = document.getElementById(taskData.day);
      if (day) {
        const temp = document.createElement('div');
        temp.innerHTML = taskData.html;
        const task = temp.firstChild;
        
        // Restore position and styles
        task.style.top = taskData.top;
        task.style.height = taskData.height;
        task.style.backgroundColor = taskData.bgColor;
        
        // Reattach event listeners
        task.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', task.id);
        });
        
        task.querySelector('.delete-task').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Delete this task?')) {
            task.remove();
            saveTasks();
          }
        });
        
        day.querySelector('.time-slots').appendChild(task);
      }
    });
  }
}
