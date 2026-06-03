import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Evaluation } from '../models/evaluation.model';
import { collection as getCollection } from 'firebase/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private collectionName = 'evaluations';

  constructor(private firestore: Firestore) {}

  create(evaluation: Evaluation) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, evaluation);
  }
  getStudents(): Observable<any[]> {
    const ref = collection(this.firestore, 'students');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }
  getCourses(): Observable<any[]> {
    const ref = collection(this.firestore, 'courses');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }
}

