import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ShoppingListService } from '../services/shopping-list';
import { ShoppingList } from '../models/shopping.models';

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
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    
    if (this.listId) {
      this.shoppingListService.getList(this.listId).subscribe(data => {
        this.list = data;
      });
    }
  }

  addItem() {
    if (this.newItem.trim().length > 0) {
      if (!this.list.items) { this.list.items = []; }
      
      this.list.items.push({
        name: this.newItem,
        checked: false
      });
      this.newItem = '';
      this.autoSave();
    }
  }

  autoSave() {
    if (this.listId && this.list) {
      this.shoppingListService.updateList(this.listId, this.list).subscribe(() => {
        console.log('Persistido en API');
      });
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
