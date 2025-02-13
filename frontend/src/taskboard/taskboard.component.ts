import { Component } from '@angular/core';
import { TaskBoardComponent } from "./components/task-board/task-board.component";

@Component({
  selector: 'taskboard-root',
  imports: [
    TaskBoardComponent
  ],
  templateUrl: './taskboard.component.html',
  styleUrl: './taskboard.component.css'
})
export class TaskboardComponent {
  title = 'TaskBoard Frontend';
}