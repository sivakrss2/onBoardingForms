import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { WrongRouteComponent } from './wrong-route/wrong-route.component';


const routes: Routes = [
    {path: '404', component: WrongRouteComponent},
    {path:':id', component: PersonalInfoComponent},

    
    //Wild Card Route
  { path: '**', pathMatch   : 'full', redirectTo: '/404'},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
