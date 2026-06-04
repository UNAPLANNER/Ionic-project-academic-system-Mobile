import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from '../../../core/services/api.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

type EvaluationType = 'exam' | 'assignment' | 'project';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.page.html',
  styleUrls: ['./evaluation-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class EvaluationFormPage implements OnInit {

  @Input() student: any;

  courses: any[] = [];

  form = this.fb.group({
    courseId: ['', Validators.required],
    type: ['exam' as EvaluationType, Validators.required],
    score: [null, Validators.required],
    maxScore: [null, Validators.required],
    date: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.courses = await this.api.getCourses();
  }

// Method that runs when the user clicks
// the “Save Evaluation” button.
// Checks that the form is complete and
// displays a confirmation window before saving.

 async save() {

  if (this.form.invalid) {

    const toast = await this.toastCtrl.create({
      message: 'Complete todos los campos.',
      duration: 2500,
      color: 'warning',
      position: 'bottom'
    });

    await toast.present();
    return;
  }

  const confirm = await this.alertCtrl.create({
    header: 'Confirmar registro',
    message: '¿Desea registrar esta evaluación?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Registrar',
        handler: async () => {
          await this.registerEvaluation();
        }
      }
    ]
  });

  await confirm.present();
}
// Method responsible for creating the grading object,
// verifying that the score does not exceed the maximum score,
// sending it to the API, and displaying success or error messages.
async registerEvaluation() {

  try {

    const data = this.form.value;

    const score = Number(data.score);
    const maxScore = Number(data.maxScore);

    if (score > maxScore) {

      const toast = await this.toastCtrl.create({
        message: 'La nota no puede ser mayor que la nota máxima.',
        duration: 2500,
        color: 'danger',
        position: 'bottom'
      });

      await toast.present();
      return;
    }

    const evaluation = {
      studentId: this.student.id,
      courseId: data.courseId!,
      type: data.type as 'exam' | 'assignment' | 'project',
      score,
      maxScore,
      date: new Date(data.date!),
      description: data.description!
    };

    await this.api.createEvaluation(evaluation);

    const successToast = await this.toastCtrl.create({
      message: 'Evaluación registrada correctamente.',
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });

    await successToast.present();

    this.modalCtrl.dismiss({
      created: true
    });

  } catch (error) {

    const errorToast = await this.toastCtrl.create({
      message: 'Ocurrió un error al registrar la evaluación.',
      duration: 2500,
      color: 'danger',
      position: 'bottom'
    });

    await errorToast.present();
  }
}

  close() {
    this.modalCtrl.dismiss();
  }
}