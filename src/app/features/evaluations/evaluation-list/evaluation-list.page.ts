import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Evaluation } from 'src/app/core/models/evaluation.model';
import { IonHeader, IonContent, IonToolbar, IonCard, IonList } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonicModule
} from '@ionic/angular';


@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  templateUrl: './evaluation-list.page.html',
  styleUrls: ['./evaluation-list.page.scss'],
})
export class EvaluationListPage implements OnInit {

  evaluations: Evaluation[] = [];
  average: number = 0;
  studentId: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    await this.loadStudentId();
    await this.loadEvaluations();
  }

  async loadStudentId() {

    const currentUser: any = this.authService.getCurrentUser();

    if (currentUser?.role === 'student') {
      this.studentId = currentUser.id;
    } else {
      this.studentId =
        this.route.snapshot.paramMap.get('id') || '';
    }

  }

  async loadEvaluations() {

    try {

      const response =
        await this.apiService.getStudentEvaluations(
          this.studentId
        );

      this.evaluations =
        response.evaluations || [];

      this.average =
        response.average || 0;

    } catch (error) {
      console.error(
        'Error loading evaluations:',
        error
      );
    }

  }

}