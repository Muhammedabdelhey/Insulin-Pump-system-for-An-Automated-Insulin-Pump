import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Patients } from '../Models/Patients';
import { DBService } from '../Services/db.service'; 
import { DocumentReference } from '@angular/fire/firestore';

let pa: Patients = new Patients();

@Component({
  selector: 'app-insulin-system',
  templateUrl: './insulin-system.component.html',
  styleUrls: ['./insulin-system.component.css']
})

export class InsulinSystemComponent  {
  patients_data: Patients[] = [];
  patients: Patients[] = [];
  p: Patients[] = [];
  p2: Patients[] = [];

  constructor(private db: DBService) {
    this.db.getPatientData().subscribe((data) => {
      this.patients_data = data;
    })

    this.db.getPatients().subscribe((data) => {
      this.patients = data;
    })

  }
  load = false;
  intervalID = 0;
  Index = -1;

  onSubmit(cForm: NgForm) {
    pa.name = cForm.value.name;
    pa.id = cForm.value.ID;
    pa.bloodsugar = cForm.value.BloodSugar;
    if (pa.bloodsugar <= 120) {
      pa.state = "Normal";
    }
    else {
      pa.state = "Abnormal";
    }
    pa.dose = this.calculat_Insulen_Dose(cForm.value.Wieght, cForm.value.ID);
    pa.date = new Date().getTime();
    var op = {
      name: pa.name,
      id: pa.id,
      bloodsugar: pa.bloodsugar,
      state: pa.state,
      dose: pa.dose,
      date: pa.date,
      ReservoirValue: pa.ReservoirValue,
      max_dose_day: pa.max_dose_day,
      total_doses_day: pa.total_doses_day
    }

    this.db.addPatients(op)
      .then((data: DocumentReference) => {
        this.p2.splice(0) ;
      })
      .catch((err) => {
        console.log(err);
      })
  }

  calculat_Insulen_Dose(p_Wieght: number, id: number): number {
    var max_Dose_Day: number = p_Wieght / 4;
    pa.max_dose_day = max_Dose_Day;
    var CF = 1800 / max_Dose_Day;
    var dose_Amount: number = 0;
    dose_Amount = ((pa.bloodsugar - 120) / CF);
    if (dose_Amount < 0) {
      dose_Amount = 0;
    }
    
    dose_Amount = this.check_Dose_Range(dose_Amount, max_Dose_Day, id);
    return dose_Amount;
  }

  check_Dose_Range(dose_Amount: number, max_Dose_Day: number, id: number): number {
    var max_Dose_Injection: number = 4;
    var total_Doses_Day=0;
    var rv=100;
   
    this.p2 = this.getpatient(id)
    if (this.p2.length> 0) {
      this.p2 = this.sort(this.p2);
      total_Doses_Day = this.p2[0].total_doses_day;
      rv = this.p2[0].ReservoirValue;
    }
    

    if ((dose_Amount + total_Doses_Day) > max_Dose_Day) {
      dose_Amount = dose_Amount - ((dose_Amount + total_Doses_Day) - max_Dose_Day);
    }

    if (dose_Amount > max_Dose_Injection) {
      dose_Amount = max_Dose_Injection;
    }

    total_Doses_Day = total_Doses_Day + dose_Amount;
    pa.total_doses_day = total_Doses_Day;
    pa.ReservoirValue = rv - dose_Amount;
    this.p2.splice(0)
    
    return dose_Amount;
  }

  load_Databtn() {
    this.load = !this.load;
    alert(this.load);
    if (this.load == true) {
      this.intervalID = window.setInterval(() => {
        ++this.Index;
        this.db.addPatients(this.patients_data[this.Index])
          .then((data: DocumentReference) => {
            console.log(data.id);
          })
          .catch((err) => {
            console.log(err);
          })
        if (this.Index == this.patients_data.length - 1) {
          this.load = false;
          alert("all data loaded")
        }
      }, 10000);

    }
    if (this.load == false) {
      clearInterval(this.intervalID);
    }

  }

  public sort(patients_data2: Patients[]): Patients[] {
    patients_data2.sort((a, b) => (a.date > b.date) ? -1 : 1)
    return patients_data2;
  }


  public getpatient(id: number): Patients[] {
    for (let i = 0; i < this.patients.length; i++) {
      if (this.patients[i].id === id) {
        this.p.push(this.patients[i])
      }
    }
    return this.p;
  }



}
