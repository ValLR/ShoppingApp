import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ShoppingList } from '../models/shopping.models';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DbserviceService } from '../services/dbservice';

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
    private dbService: DbserviceService,
  ) {}

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    
    if (this.listId) {
      this.dbService.dbState().subscribe((isReady) => {
        if (isReady) {
          this.dbService.fetchShoppingLists().subscribe((lists) => {
            const found = lists.find(l => l.id === this.listId);

            if (found) {
              this.list = found;
            }
          });
        }
      });
    }
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
      this.saveToDB();
    } catch (error) {
      console.log('No se tomó foto', error);
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
      this.saveToDB();
    }
  }

  // autoSave() {
  //   this.updateLocalBackup();

  //   if (this.listId && this.list) {
  //     const listaParaNube = JSON.parse(JSON.stringify(this.list));
  //     listaParaNube.items.forEach((i: any) => delete i.image);

  //     this.shoppingListService.updateList(this.listId, listaParaNube).subscribe({
  //       next: () => console.log('Texto sincronizado con API (Sin fotos)'),
  //       error: (err) => console.log('Error API (Posiblemente 413)', err)
  //     });
  //   }
  // }

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
    this.saveToDB();
  }

  onCheckboxChange() {
    this.saveToDB();
  }

  async onSaveClick() {
    this.saveToDB();
    const alert = await this.alertCtrl.create({
      header: 'Guardado ;)',
      message: 'Lista guardada correctamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  saveToDB() {
    if (this.listId && this.list) {
      this.dbService.updateList(this.list.id, this.list.name, this.list.items)
        .then(() => {
          console.log('Sincronizado con SQLite');
        })
        .catch(e => {
          console.error('Error al guardar en BBDD', e);
          this.presentToast('Error al guardar cambios');
        });
    }
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
