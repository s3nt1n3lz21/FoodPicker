import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { Food } from 'src/app/model/IFood';

@Component({
  selector: 'app-ranking-renderer',
  templateUrl: './ranking-renderer.component.html',
  styleUrls: ['./ranking-renderer.component.scss']
})
export class RankingRendererComponent implements ICellRendererAngularComp {

  params: ICellRendererParams;
  
  refresh(params: ICellRendererParams): boolean {
      throw new Error("Method not implemented.");
  }

  agInit(params: ICellRendererParams): void {
      this.params = params;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {

  }

  // other parts of the component

  onClick(event) {
    const food: Food = this.params.node.data;
    window.open(food.url, '_blank');
    // this.params.context.componentParent.methodFromParent(this.params.node.data);
    // console.log(event);
    // handle the rest
  }

  increase = (event) => {}
  decrease = (event) => {}

}
