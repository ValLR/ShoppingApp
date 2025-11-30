import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ShoppingListService } from '../services/shopping-list';
import { ShoppingList } from '../models/shopping.models';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ListViewPage implements OnInit {

  list: ShoppingList = { id: '', name: '', items: [] };
  listId: string | null = '';
  newItem: string = '';

  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private shoppingListService: ShoppingListService,
  ) {}

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    
    if (this.listId) {
      this.loadFromBackup(this.listId);

      this.shoppingListService.getList(this.listId).subscribe({
        next: (dataApi) => {
          this.list = this.mergeDataWithLocalImages(dataApi);
          
          this.updateLocalBackup(); 
        },
        error: () => {
          this.presentToast('Sin conexión: Usando copia local');
        }
      });
    }
  }

  mergeDataWithLocalImages(apiList: ShoppingList): ShoppingList {
    const backup = localStorage.getItem('backup_lists');
    if (backup) {
      const allLists: ShoppingList[] = JSON.parse(backup);
      const localList = allLists.find(l => l.id === apiList.id);
      
      if (localList && localList.items) {
        apiList.items.forEach((apiItem, index) => {
          if (localList.items[index] && localList.items[index].image) {
            apiItem.image = localList.items[index].image;
          }
        });
      }
    }
    return apiList;
  }

  async addPhotoToItem(item: any) {
    try {
      const image = await Camera.getPhoto({
        quality: 30,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });

      item.image = image.dataUrl;      
      this.autoSave();
    } catch (error) {
      console.log('No se tomó foto');
    }
  }

  loadFromBackup(id: string) {
    const backup = localStorage.getItem('backup_lists');
    if (backup) {
      const allLists: ShoppingList[] = JSON.parse(backup);
      const foundList = allLists.find(l => l.id === id);
      if (foundList) {
        this.list = foundList;
      }
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: 'warning' });
    toast.present();
  }

  addItem() {
    if (this.newItem.trim().length > 0) {
      if (!this.list.items) {
        this.list.items = [];
      }
      
      this.list.items.push({
        name: this.newItem,
        checked: false
      });
      this.newItem = '';
      this.autoSave();
    }
  }

  autoSave() {
    this.updateLocalBackup();

    if (this.listId && this.list) {
      const listaParaNube = JSON.parse(JSON.stringify(this.list));
      listaParaNube.items.forEach((i: any) => delete i.image);

      this.shoppingListService.updateList(this.listId, listaParaNube).subscribe({
        next: () => console.log('Texto sincronizado con API (Sin fotos)'),
        error: (err) => console.log('Error API (Posiblemente 413)', err)
      });
    }
  }

  updateLocalBackup() {
    const backup = localStorage.getItem('backup_lists');
    if (backup) {
      let allLists: ShoppingList[] = JSON.parse(backup);
      const index = allLists.findIndex(l => l.id === this.listId);
      if (index > -1) {
        allLists[index] = this.list;
        localStorage.setItem('backup_lists', JSON.stringify(allLists));
      }
    }
  }

  deleteItem(index: number) {
    this.list.items.splice(index, 1);
    this.autoSave();
  }

  onCheckboxChange() {
    this.autoSave();
  }

  async onSaveClick() {
    this.autoSave();
    const alert = await this.alertCtrl.create({
      header: 'Guardado ;)',
      message: 'Lista guardada correctamente.',
      buttons: ['OK']
    });
    this.presentSaveAlert();
  }

  async presentSaveAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Guardado ;)',
      message: 'Tu lista "' + this.list.name + '" ha sido guardada.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
