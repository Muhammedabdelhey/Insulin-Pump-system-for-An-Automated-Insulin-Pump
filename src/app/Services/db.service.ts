import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Patients } from '../Models/Patients';


@Injectable({
  providedIn: 'root'
})
export  class DBService {
    constructor(private firestore: Firestore) {

  }
  addPatients(patient: Patients) {
    let $patientRef = collection(this.firestore, "Patients");
    return addDoc($patientRef, patient);
  }

  getPatientData()
  {
    let $patientRef=collection(this.firestore,"Patients_Data");
    return collectionData($patientRef,{idField:"Id"}) as Observable<Patients[]>;
  }

  getPatients()
  {
    let $patientRef=collection(this.firestore,"Patients");
    return collectionData($patientRef,{idField:"Id"}) as Observable<Patients[]>;
  }

}
