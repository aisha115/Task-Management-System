import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import { Itask } from '../model/Itask';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<Date>;
  taskForm !: FormGroup;
  tasks: Itask [] = [];
  inprogress: Itask [] = [];
  done: Itask [] = [];
  updateIndex: any;
  isEditEnabled: boolean = false;
  isHovered: boolean = false;
  minDate = new Date();
  constructor(private fb:FormBuilder){ }
  ngOnInit(): void{
    this.taskForm = this.fb.group({
      title : ['', Validators.required],
      description : ['',Validators.required],
      duedate : ['',Validators.required],
      priority : ['',Validators.required]
    }
    );
  }
  showTask(i:number) {
    this.tasks[i].isshow = true;
  }
  notShowTask(i:number) {
    this.tasks[i].isshow = false;
  }
  showInprogress(i:number) {
    this.inprogress[i].isshow = true;
  }
  notShowInprogress(i:number) {
    this.inprogress[i].isshow = false;
  }
  showDone(i:number) {
    this.done[i].isshow = true;
  }
  notShowDone(i:number) {
    this.done[i].isshow = false;
  }
  _to2digit(n: number) {
    return ('00' + n).slice(-2);
  } 
  changedate(date:Date){
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
  }
  addTask(){
    this.tasks.push({
      item_title: this.taskForm.value.title,
      item_description: this.taskForm.value.description,
      item_date: this.taskForm.value.duedate,
      item_duedate: this.changedate(this.taskForm.value.duedate),
      item_priority: this.taskForm.value.priority,
      done: false,
      isshow: false
    });
    this.taskForm.reset();
  }
  deleteTask(i: number){
    this.tasks.splice(i,1);
  }
  onEdit(item: Itask, i: number){
    this.taskForm.controls['title'].setValue(item.item_title);
    this.taskForm.controls['description'].setValue(item.item_description);
    this.taskForm.controls['duedate'].setValue(item.item_date);
    this.taskForm.controls['priority'].setValue(item.item_priority);
    this.updateIndex = i;
    this.isEditEnabled = true;
  }
  updateTask(){
    this.tasks[this.updateIndex].item_title = this.taskForm.value.title;
    this.tasks[this.updateIndex].item_description = this.taskForm.value.description;
    this.tasks[this.updateIndex].item_date = this.taskForm.value.duedate;
    this.tasks[this.updateIndex].item_duedate = this.changedate(this.taskForm.value.duedate);
    this.tasks[this.updateIndex].item_priority = this.taskForm.value.priority;    
    this.tasks[this.updateIndex].done = false;
    this.tasks[this.updateIndex].isshow = false;
    this.taskForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
  }
  deleteInprogressTask(i: number){
    this.inprogress.splice(i,1);
  }
  deleteDoneTask(i: number){
    this.done.splice(i,1);
  }
  drop(event: CdkDragDrop<Itask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  sortByTaskPriority() {
    this.tasks.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.item_priority] - priorityOrder[a.item_priority];
    });
  }
  sortByTaskDueDate() {
    this.tasks.sort((a, b) => {
      return a.item_date.getTime() - b.item_date.getTime();
    });
  }
  sortByInprogressPriority() {
    this.inprogress.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.item_priority] - priorityOrder[a.item_priority];
    });
  }
  sortByInprogressDueDate() {
    this.inprogress.sort((a, b) => {
      return a.item_date.getTime() - b.item_date.getTime();
    });
  }
  sortByDonePriority() {
    this.done.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.item_priority] - priorityOrder[a.item_priority];
    });
  }
  sortByDoneDueDate() {
    this.done.sort((a, b) => {
      return a.item_date.getTime() - b.item_date.getTime();
    });
  }
}