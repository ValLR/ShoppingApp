import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, AlertController, ToastController } from '@ionic/angular';
import { ShoppingList } from '../models/shopping.models';
import { DbserviceService } from '../services/dbservice';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage implements OnInit {
  @ViewChild('animatedMainTitle', { read: ElementRef }) animatedMainTitle!: ElementRef;
  @ViewChild('animatedMenu', { read: ElementRef }) animatedMenu!: ElementRef;
  @ViewChild('emptyIcon', { read: ElementRef }) emptyIcon!: ElementRef;
  @ViewChild('emptyText', { read: ElementRef }) emptyText!: ElementRef;

  user: string = '';
  shoppingLists: ShoppingList[] = [];

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private dbService: DbserviceService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('usuario');
    this.user = storedUser ? storedUser : '';

    if (storedUser) {
      this.user = storedUser.charAt(0).toUpperCase() + storedUser.slice(1);
    } else {
      this.user = '';
    }

    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchShoppingLists().subscribe(item => {
          this.shoppingLists = item;
        });
      }
    });
  }

  async createNewList() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Lista',
      inputs: [{ name: 'nombre', type: 'text', placeholder: 'Ej: Compra Mensual' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (data.nombre && data.nombre.trim().length > 0) {
              this.addListToDB(data.nombre.trim());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  addListToDB(name: string) {
    const capitalizedName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    
    this.dbService.addList(capitalizedName, [])
      .then(() => {
        this.presentToast('Lista creada exitosamente');
      })
      .catch((e) => {
        this.presentToast('Error al crear lista: ' + e);
      });
  }

  deleteList(index: number) {
    // Obtenemos el ID de la lista que queremos borrar
    const listToDelete = this.shoppingLists[index];
    
    this.dbService.deleteList(listToDelete.id)
      .then(() => {
        this.presentToast('Lista eliminada');
      })
      .catch(e => {
        this.presentToast('Error al eliminar: ' + e);
      });
  }

  goToList(listId: string) {
    this.router.navigate(['/list-view', listId]);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }

  ionViewDidEnter() {
    if (this.animatedMainTitle) {
      const titleAnimation = this.animationCtrl.create()
        .addElement(this.animatedMainTitle.nativeElement)
        .duration(1000)
        .fromTo('transform', 'translateY(100px)', 'translateY(0px)')
        .fromTo('opacity', '0', '1');
      titleAnimation.play();
    }

    if (this.animatedMenu) {
      const menuAnimation = this.animationCtrl.create()
        .addElement(this.animatedMenu.nativeElement)
        .duration(1500)
        .fromTo('opacity', '0', '1');
      menuAnimation.play();
    }

    if (this.emptyIcon && this.emptyText) {      
      const iconAnimation = this.animationCtrl.create()
        .addElement(this.emptyIcon.nativeElement)
        .duration(1000)
        .keyframes([
          { offset: 0, transform: 'scale(1) rotate(0deg)' },
          { offset: 0.3, transform: 'scale(1.2) rotate(10deg)' },
          { offset: 0.6, transform: 'scale(1.2) rotate(-10deg)' },
          { offset: 1, transform: 'scale(1) rotate(0deg)' }
        ]);
        
      const textAnimation = this.animationCtrl.create()
        .addElement(this.emptyText.nativeElement)
        .duration(1000)
        .fromTo('opacity', '0', '1');

      iconAnimation.play();
      textAnimation.play();
    }
  }
}
