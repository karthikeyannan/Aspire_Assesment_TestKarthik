import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponentComponent } from './user-management-component/user-management-component.component';

const routes: Routes = [
  {
    path:"",
    component:UserManagementComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
