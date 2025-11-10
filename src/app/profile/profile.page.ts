import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { ShoppingListService } from '../services/shopping-list';
import { ShoppingList } from '../models/shopping.models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})

export class ProfilePage implements OnInit {
  user: string = '';
  totalLists = 0;
  lastListId = '—';
  totalItems = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.user = params['user'];
      }
    });

    const lists: ShoppingList[] = this.shoppingListService.getLists();
    this.totalLists = lists.length;

    if (lists.length > 0) {
      const last = lists[lists.length - 1];
      this.lastListId = last.id;
      this.totalItems = lists.reduce((acc, list) => acc + list.items.length, 0);
    } else {
      this.lastListId = 'No hay listas';
      this.totalItems = 0;
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }
}