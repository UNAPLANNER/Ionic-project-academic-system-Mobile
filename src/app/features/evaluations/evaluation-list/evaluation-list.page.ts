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
  currentUser: any;
  
  loading: boolean = false; 
  //Dictionary for mapping database types to Spanish and uppercase letters
  typeTranslations: { [key: string]: string } = {
    'exam': 'EXAMEN',
    'assignment': 'TAREA',
    'quiz': 'QUIZ',
    'project': 'PROYECTO'
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    await this.setStudentId();
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
  //Method that assigns the student ID
  setStudentId() {
    const role = this.currentUser?.role;
    const routeId = this.route.snapshot.paramMap.get('id');

    if (role === 'student') {
      //Students can ONLY view their own information
      this.studentId = this.currentUser.id;
    } else {
      // A teacher can see any student
      this.studentId = routeId || '';
    }
  }
  //retrieves data from the backend
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
  getEvaluationType(type: string): string {
    if (!type) return 'EVALUACIÓN';
    return this.typeTranslations[type.toLowerCase()] || type.toUpperCase();
  }
  //Helper that cleans up and converts the evaluation type for HTML
  getCourseName(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.name || 'Curso';
  }

  scorePercent(ev: Evaluation): number {
    return Math.round((ev.score / ev.maxScore) * 100);
  }
  
  //The method evaluates that percentage using if statements to determine which color to display
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