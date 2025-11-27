import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { DBService } from './Services/db.service';
import { InsulinSystemComponent } from './insulin-system/insulin-system.component';



@NgModule({
  declarations: [
    AppComponent,
    InsulinSystemComponent,

  ],
  imports: [
 
BrowserModule,
  FormsModule,
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore())

  ],
  providers: [DBService],
  bootstrap: [AppComponent]
})
export class AppModule { }
