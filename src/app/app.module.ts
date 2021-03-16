import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';

import { MapaComponent } from './components/mapa/mapa.component';
import { MapaEditarComponent } from './components/mapa/mapa-editar.component';
import { environment} from "../environments/environment"


@NgModule({
 /*  ja no es neceasri
 entryComponents: [
    MapaEditarComponent
  ], */
  declarations: [
    AppComponent,
    MapaComponent,
    MapaEditarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    AgmCoreModule.forRoot({
      apiKey:
      `${environment.APIKEYGOOGLEMAPS}`,
    }),
    AppRoutingModule
 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
