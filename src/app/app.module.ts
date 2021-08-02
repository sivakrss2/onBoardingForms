import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

import { AngularMaterialModule } from './angular-material.module';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { JoineeService } from './services/joinee.service';

import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { WrongRouteComponent } from './wrong-route/wrong-route.component';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './services/loader.services';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    PersonalInfoComponent,
    WrongRouteComponent,
    WrongRouteComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    AppRoutingModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ],
  providers: [JoineeService, LoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
