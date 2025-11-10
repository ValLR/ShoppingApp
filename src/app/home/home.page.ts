import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../models/shopping.models';
import { ShoppingListService } from '../services/shopping-list';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
})

export class HomePage implements OnInit {
  @ViewChild('animatedMainTitle', { read: ElementRef }) animatedMainTitle!: ElementRef;
  @ViewChild('animatedMenu', { read: ElementRef }) animatedMenu!: ElementRef;
  @ViewChild('emptyIcon', { read: ElementRef }) emptyIcon!: ElementRef;
  @ViewChild('emptyText', { read: ElementRef }) emptyText!: ElementRef;

  user: string = '';
  shoppingLists: ShoppingList[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animationCtrl: AnimationController,
    private shoppingListService : ShoppingListService,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.user = params['user'];
      }
    });
  }

  ionViewWillEnter() {
    this.shoppingLists = this.shoppingListService.getLists();
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

  goToList(listId: string) {
    this.router.navigate(['/list-view'], {
      queryParams: { 'id': listId }
    });
  }

  goToProfile() {
    this.router.navigate(['/profile'], {
      queryParams: { user: this.user }
    });
  }

  async createNewList() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Lista',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Ej: Compra Mensual'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: (data) => {
            if (data.nombre && data.nombre.trim().length > 0) {
              this.goToList(data.nombre.trim());
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
