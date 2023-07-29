import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Itask } from '../model/Itask';
import { Location } from '@angular/common';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent{
  displayedColumns: string[] = [
    'title',
    'description',
    'due_date',
    'priority',
    'status',
    'modification'
  ];
  historyData: Itask [] = [];
  constructor(private apiService: ApiService,
              private location: Location,
              private papa: Papa) { }
  goBack(): void {
    this.location.back();
  }
  ngOnInit(): void {
    this.apiService.getSomeData().subscribe(
      (response) => {
        this.historyData = response[0].data.concat(response[1].data,response[2].data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  downloadCSV(): void {
    const csvData: Array<any[]>= this.historyData.map((task) => [
      task.title,
      task.description,
      task.due_date,
      task.priority,
      task.status,
      task.modification
    ]);
    const csvHeaders = ['Title', 'Description', 'Due Date', 'Priority', 'Status', 'Modification'];
    const csv = this.papa.unparse({ fields: csvHeaders, data: csvData });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'history_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
