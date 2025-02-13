import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { TaskDto } from '../../client/model/taskDto';
import { UserDto } from '../../client/model/userDto';
import { UsersService } from '../../services/users.service'; // Service to fetch users
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'taskboard-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {
  tasks: TaskDto[] = [];
  users: UserDto[] = [];
  searchQuery: string = '';

  todoTasks: TaskDto[] = [];
  doingTasks: TaskDto[] = [];
  doneTasks: TaskDto[] = [];

  constructor(private tasksService: TasksService, private usersService: UsersService) { }

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
  }

  async loadTasks() {
    this.tasks = await this.tasksService.getTasks();
    this.filterTasks();
  }

  async loadUsers() {
    this.users = await this.usersService.getUsers();
    console.log('Fetched Users:', this.users);
  }

  filterTasks() {
    const query = this.searchQuery.toLowerCase();

    this.todoTasks = this.tasks.filter(task =>
      task.status === 'TODO' && this.matchesSearch(task, query)
    );

    this.doingTasks = this.tasks.filter(task =>
      task.status === 'DOING' && this.matchesSearch(task, query)
    );

    this.doneTasks = this.tasks.filter(task =>
      task.status === 'DONE' && this.matchesSearch(task, query)
    );
  }

  matchesSearch(task: TaskDto, query: string): boolean {
    query = query.toLowerCase(); // Convert query to lowercase for case-insensitive search

    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      (task.assignee?.name?.toLowerCase().includes(query) ?? false) ||
      ("unassigned".includes(query) && !task.assignee) // ✅ Partial match for "unassigned"
    );
  }


  async onTaskDrop(event: DragEvent, newStatus: TaskDto.StatusEnum) {
    event.preventDefault();

    const taskId = event.dataTransfer?.getData('text');
    if (!taskId) return;

    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status !== newStatus) {
      try {
        const updatedTask: TaskDto = {
          ...task,
          status: newStatus,
        };

        await this.tasksService.updateTask(task.id!, updatedTask);

        task.status = newStatus;
        this.filterTasks();
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  }


  onDragStart(event: DragEvent, taskId: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', taskId);
    }
  }

  async updateAssignee(task: TaskDto, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const assigneeId = selectElement.value;

    const fetchedUser = this.users.find(user => user.id === assigneeId);

    try {
      const updatedTask: TaskDto = {
        ...task,
        assignee: fetchedUser
      };

      await this.tasksService.updateTask(task.id!, updatedTask);

      task.assignee = fetchedUser;
      this.filterTasks();
    } catch (error) {
      console.error('Failed to update assignee:', error);
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

}