import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import { Itask } from '../model/Itask';
import { MatDatepicker } from '@angular/material/datepicker';
import { ApiService } from '../api.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy{
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<Date>;
  private autoReloadSubscription!: Subscription;
  taskForm !: FormGroup;
  tasks: Itask [] = [];
  inprogress: Itask [] = [];
  done: Itask [] = [];
  updateIndex: any;
  isEditEnabled: boolean = false;
  isHovered: boolean = false;
  minDate = new Date();
  constructor(private fb:FormBuilder,
              private apiService: ApiService,
              private datePipe: DatePipe){ }
  ngOnInit(): void{
    this.apiService.getSomeData().subscribe(
      (response) => {
        console.log(response);
        this.tasks=response[0].data;
        this.inprogress=response[1].data;
        this.done=response[2].data;
      },
      (error) => {
        console.error(error);
      }
    );
    this.autoReloadSubscription = this.apiService.autoReload$.subscribe(() => {
      this.loadTasks();
    });
    this.taskForm = this.fb.group({
      title : ['', Validators.required],
      description : ['',Validators.required],
      duedate : ['',Validators.required],
      priority : ['',Validators.required]
    }
    );  
  }
  ngOnDestroy(): void {
    this.autoReloadSubscription.unsubscribe();
  }
  private loadTasks(): void {
    this.apiService.getSomeData().subscribe((response) => {
      this.tasks = response[0].data;
      this.inprogress = response[1].data;
      this.done = response[2].data;
    });
  }
  changedate(date:Date){
    return this.datePipe.transform(date, 'yyyy/MM/dd');
  }
  onDeleteResource(resourceId: any) {
    this.apiService.deleteResource(resourceId).subscribe(
      (response) => {
        console.log('Resource deleted successfully.', response);
        this.apiService.triggerAutoReload();
      },
      (error) => {
        console.error('Error deleting resource:', error);
      }
    );
  }
  onCreateResource(resourceData: any) {
    this.apiService.createResource(resourceData).subscribe(
      (response) => {
        console.log('Resource created successfully.', response);
        this.apiService.triggerAutoReload();
      },
      (error) => {
        console.error('Error creating resource:', error);
      }
    );
  }
  onChangeStatus(id: any,changeinstatus:string) {
    this.apiService.changeStatus(id,changeinstatus).subscribe(
      (response) => {
        console.log('Status changed successfully.', response);
        this.apiService.triggerAutoReload();
      },
      (error) => {
        console.error('Error changing status:', error);
      }
    );
  }
  onChangeShow(id: any) {
    this.apiService.changeShow(id).subscribe(
      (response) => {
        console.log('isshow changed successfully.', response.data.isshow);
        this.apiService.triggerAutoReload();
      },
      (error) => {
        console.error('Error changing isshow:', error);
      }
    );
  }
  addTask(){
    const resourceData = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        date: this.taskForm.value.duedate,
        due_date: this.changedate(this.taskForm.value.duedate),
        priority: this.taskForm.value.priority,
      }
    this.onCreateResource(resourceData);
    this.taskForm.reset();
  }
  updateTask(){
    const data = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        date: this.taskForm.value.duedate,
        due_date: this.changedate(this.taskForm.value.duedate),
        priority: this.taskForm.value.priority,
      }
    this.onModifyResource(data);
    this.taskForm.reset();
    this.isEditEnabled = false;
    this.updateIndex = undefined;
  }
  onEdit(item: Itask){
    this.taskForm.controls['title'].setValue(item.title);
    this.taskForm.controls['description'].setValue(item.description);
    this.taskForm.controls['duedate'].setValue(item.date);
    this.taskForm.controls['priority'].setValue(item.priority);
    this.updateIndex = item._id;
    this.isEditEnabled = true;
  }
  onModifyResource(data:any){
    this.apiService.modifyResource(this.updateIndex,data).subscribe(
      (response) => {
        console.log('Resource modify successfully.', response);
        this.apiService.triggerAutoReload();
      },
      (error) => {
        console.error('Error modify resource:', error);
      }
    );
  }
  drop(event: CdkDragDrop<Itask[]>,changeinstatus:string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      if (event.container.data[event.currentIndex]._id) {
        const taskId = event.container.data[event.currentIndex]._id;   
        this.onChangeStatus(taskId,changeinstatus);
      }
    }
  }
  sortByTaskPriority() {
    this.tasks.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  sortByTaskDueDate() {
    this.tasks.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime();
    });
  }
  sortByInprogressPriority() {
    this.inprogress.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  sortByInprogressDueDate() {
    this.inprogress.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime();
    });
  }
  sortByDonePriority() {
    this.done.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  sortByDoneDueDate() {
    this.done.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime();
    });
  }
}