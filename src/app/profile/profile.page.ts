import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { ShoppingListService } from '../services/shopping-list';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  profileImage: string | undefined;

  constructor(
    private router: Router,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('usuario');
    this.user = storedUser ? storedUser : '';

    const savedPhoto = localStorage.getItem('profile_photo');
    if (savedPhoto) {
      this.profileImage = savedPhoto;
    }

    this.shoppingListService.getLists().subscribe(lists => {
      this.totalLists = lists.length;

      if (lists.length > 0) {
        const last: any = lists[lists.length - 1];
        this.lastListId = last.name || 'Lista #' + last.id;

        this.totalItems = lists.reduce(
          (acc: number, list: any) => acc + (list.items ? list.items.length : 0),
          0
        );
      }
    });
  }

async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });

      this.profileImage = image.dataUrl;
      
      if (this.profileImage) {
        localStorage.setItem('profile_photo', this.profileImage);
      }
      
    } catch (error) {
      console.log('El usuario canceló o hubo error', error);
    }
  }

  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('backup_lists');
    this.router.navigate(['/login']);
  }
}
