import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Evaluation } from 'src/app/core/models/evaluation.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './evaluation-list.page.html',
  styleUrls: ['./evaluation-list.page.scss'],
})
export class EvaluationListPage implements OnInit {

  evaluations: Evaluation[] = [];
  courses: any[] = [];
  average: number = 0;
  studentId: string = '';
  
  // 1. SOLUCIÓN: Agregamos la propiedad 'loading' aquí
  loading: boolean = false; 

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    await this.loadStudentId();
    await this.loadData();
  }

  async loadStudentId() {
    const currentUser: any = this.authService.getCurrentUser();

    if (currentUser?.role === 'student') {
      this.studentId = currentUser.id;
    } else {
      this.studentId = this.route.snapshot.paramMap.get('id') || '';
    }
  }

  async loadData() {
    this.loading = true; 
    
    try {
      const [evalRes, courses] = await Promise.all([
        this.apiService.getStudentEvaluations(this.studentId),
        this.apiService.getCourses()
      ]);

      this.evaluations = evalRes.evaluations || [];
      this.average = evalRes.average || 0;
      this.courses = courses;

    } catch (error) {
      console.error(error);
    } finally {
  
      this.loading = false; 
    }
  }

  getCourseName(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.name || 'Curso';
  }

  scorePercent(ev: Evaluation): number {
    return Math.round((ev.score / ev.maxScore) * 100);
  }

  getEvaluationCardStyle(ev: any) {
    const percent = (ev.score / ev.maxScore) * 100;

    if (percent >= 80) {
      return { background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }; 
    }

    if (percent >= 60) {
      return { background: 'linear-gradient(135deg, #FF9800, #EF6C00)' }; 
    }

    return { background: 'linear-gradient(135deg, #F44336, #C62828)' };
  }
}