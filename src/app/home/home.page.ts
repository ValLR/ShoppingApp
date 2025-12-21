import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, AlertController, ToastController, Platform } from '@ionic/angular';
import { ShoppingList } from '../models/shopping.models';
import { DbserviceService } from '../services/dbservice';
import { ApiService } from '../services/api.service';

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
  categories: any[] = [];isModalOpen = false;
  mealsList: any[] = [];
  selectedCategory: string = '';

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private dbService: DbserviceService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private toastCtrl: ToastController,
    private apiService: ApiService
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
        this.loadCaterories(); 
      } else {
        this.loadCaterories();
      }
    });
  }

  loadCaterories() {
    this.apiService.getCategories().subscribe(data => {
      this.categories = data;
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

  async addListToDB(name: string) {
    const capitalizedName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    
    if (!this.platform.is('hybrid')) {
        console.warn('Web mode: Creando lista');        
        this.shoppingLists.push({
            id: Date.now().toString(),
            name: capitalizedName,
            items: []
        });
        
        this.presentToast('Lista creada (Web)');
        return;
    }

    try {
        await this.dbService.addList(capitalizedName, []);
        this.presentToast('Lista creada exitosamente');
    } catch (e) {
        this.presentToast('Error al crear lista: ' + e);
    }
  }

  deleteList(index: number) {
    if (!this.platform.is('hybrid')) {
        this.shoppingLists.splice(index, 1);
        this.presentToast('Lista eliminada (Simulación)');
        return;
    }
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

  async addFromAPI(category: any) {
    if (this.shoppingLists.length === 0) {
      this.presentToast('Primero crea una lista de compras.');
      return;
    }

    const inputs = this.shoppingLists.map(lista => ({
      type: 'radio' as const,
      label: lista.name,
      value: lista,
    }));

    const alert = await this.alertCtrl.create({
      header: 'Agregar ' + category.strCategory,
      subHeader: '¿A qué lista quieres agregar este ítem?',
      inputs: inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (selectedList) => {
            if (selectedList) {
              this.saveItemInList(selectedList, category.strCategory);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async saveItemInList(destinyList: any, itemList: string) {
    if (!destinyList.items) {
      destinyList.items = [];
    }

    const newItem = {
      name: itemList,
      checked: false,
      image: '' 
    };

    destinyList.items.push(newItem);

    if (this.platform.is('hybrid')) {
      try {
        console.log('Intentando guardar en BD:', destinyList);
        
        await this.dbService.updateList(destinyList.id, destinyList.name, destinyList.items);        
        this.presentToast(`Agregado a ${destinyList.name}`);
      } catch (e) {
        console.error('Error guardando en SQLite', e);
        this.presentToast('Error al guardar en base de datos');
      }
    } else {
      this.presentToast(`Agregado a ${destinyList.name} (Modo Web)`);
    }
  }

  seeMealsByCategory(category: any) {
    this.selectedCategory = category.strCategory;
    this.mealsList = [];
    this.setOpen(true);

    this.apiService.getMealsByCategory(this.selectedCategory).subscribe(meals => {
      this.mealsList = meals;
    });    
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  chooseMeal(meal: any) {
    this.setOpen(false);

    this.apiService.getMealDetails(meal.idMeal).subscribe(fullMeal => {
      if (fullMeal) {
        const ingredientes = this.extractIngredients(fullMeal);
        
        this.addIngredientsToList(fullMeal.strMeal, ingredientes);
      } else {
        this.presentToast('Error al obtener los ingredientes.');
      }
    });
  }

  extractIngredients(meal: any): string[] {
    let ingredients: string[] = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredientName = meal[`strIngredient${i}`];
      if (ingredientName && ingredientName.trim() !== "") {
        ingredients.push(ingredientName);
      }
    }
    return ingredients;
  }

  async addIngredientsToList(mealName: string, ingredients: string[]) {
    if (this.shoppingLists.length === 0) {
      this.presentToast('Primero crea una lista de compras.');
      return;
    }

    const inputs = this.shoppingLists.map(lista => ({
      type: 'radio' as const,
      label: lista.name,
      value: lista,
    }));

    const alert = await this.alertCtrl.create({
      header: 'Ingredientes de ' + mealName,
      subHeader: `Se agregarán ${ingredients.length} ingredientes a tu lista.`,
      inputs: inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (selectedList) => {
            if (selectedList) {
              this.addMultipleItems(selectedList, ingredients);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async addMultipleItems(destinyList: any, ingredients: string[]) {
    if (!destinyList.items) destinyList.items = [];

    const nuevosItems = ingredients.map(nombre => ({
      name: nombre,
      checked: false,
      image: '' 
    }));

    destinyList.items.push(...nuevosItems);
    if (this.platform.is('hybrid')) {
      try {
        await this.dbService.updateList(destinyList.id, destinyList.name, destinyList.items);
        this.presentToast(`${ingredients.length} ingredientes agregados a ${destinyList.name}`);
      } catch (e) {
        console.error(e);
        this.presentToast('Error guardando en BD');
      }
    } else {
      localStorage.setItem('backup_lists', JSON.stringify(this.shoppingLists));
      this.presentToast(`${ingredients.length} ingredientes agregados (Web)`);
    }
  }

  async addToList(mealName: string) {
    if (this.shoppingLists.length === 0) {
      this.presentToast('Primero crea una lista de compras.');
      return;
    }

    const inputs = this.shoppingLists.map(lista => ({
      type: 'radio' as const,
      label: lista.name,
      value: lista,
    }));

    const alert = await this.alertCtrl.create({
      header: 'Agregar Plato',
      subHeader: `¿A qué lista quieres agregar "${mealName}"?`, // Mostramos el nombre del plato
      inputs: inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (selectedList) => {
            if (selectedList) {
              this.saveItemInList(selectedList, mealName);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
