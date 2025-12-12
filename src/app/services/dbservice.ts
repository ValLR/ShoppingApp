import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingList, ShoppingItem } from '../models/shopping.models';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  public database: SQLiteObject | null = null;
  
  tableList: string = "CREATE TABLE IF NOT EXISTS listas_compra(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, items TEXT NOT NULL);";
  tableUser: string = "CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, image TEXT);";

  shoppingList = new BehaviorSubject<ShoppingList[]>([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite, 
    private platform: Platform, 
    public toastController: ToastController
  ) {
    this.createDB();
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchShoppingLists(): Observable<ShoppingList[]> {
    return this.shoppingList.asObservable();
  }

  // Crear DB y tablas
  createDB() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'shopping.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.createTables();
      }).catch(e => {
        console.error("Error creando BD", e);
        this.presentToast("Error creando BD: " + e);
      });
    });
  }

  async createTables() {
    try {
      if (!this.database) return;
      await this.database.executeSql(this.tableList, []);
      await this.database.executeSql(this.tableUser, []);
      
      this.searchLists();
      this.isDbReady.next(true);
    } catch (e) {
      console.error("Error creando tablas", e);
      this.presentToast("Error creando tablas: " + e);
    }
  }

  // CRUD
  searchLists() {
    if (!this.database) return;
    
    return this.database.executeSql('SELECT * FROM listas_compra', []).then(res => {
      let items: ShoppingList[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          let itemsArray: ShoppingItem[] = [];
          try {
             itemsArray = JSON.parse(res.rows.item(i).items);
          } catch(e) {
             console.log("Error parseando items", e);
          }

          items.push({
            id: res.rows.item(i).id.toString(),
            name: res.rows.item(i).name,
            items: itemsArray
          });
        }
      }
      this.shoppingList.next(items);
    });
  }

  addList(nombre: string, items: ShoppingItem[]) {
    if (!this.database) {
      return Promise.reject("Base de datos no inicializada");
    };
    let data = [nombre, JSON.stringify(items)];
    
    return this.database.executeSql('INSERT INTO listas_compra(name, items) VALUES(?,?)', data)
      .then(res => {
        this.searchLists();
        this.presentToast("Lista guardada exitosamente");
      })
      .catch(e => {
        this.presentToast("Error al guardar: " + e);
        return Promise.reject(e);
      });
  }

  updateList(id: string, nombre: string, items: ShoppingItem[]) {
    if (!this.database) {
      return Promise.reject('Base de datos no inicializada');
    };
    let data = [nombre, JSON.stringify(items), id];
    
    return this.database.executeSql('UPDATE listas_compra SET name = ?, items = ? WHERE id = ?', data)
      .then(data2 => {
        this.searchLists();
      })
      .catch(e => {
        this.presentToast("Error al actualizar: " + e);
        return Promise.reject(e);
      });
  }

  deleteList(id: string) {
    if (!this.database) {
      return Promise.reject('Base de datos no inicializada');
    };
    return this.database.executeSql('DELETE FROM listas_compra WHERE id = ?', [id])
      .then(a => {
        this.searchLists();
        this.presentToast("Lista eliminada");
      })
      .catch(e => {
        this.presentToast("Error al eliminar: " + e);
        return Promise.reject(e);
      });
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  // Registro
  registerUser(username: string, pass: string) {
    if (!this.database) return Promise.reject("BD no lista");
    
    return this.database.executeSql('INSERT INTO usuarios(username, password, image) VALUES(?,?, "")', [username, pass])
      .then(() => {
        this.presentToast("Usuario registrado");
        return true;
      })
      .catch(e => {
        this.presentToast("Error al registrar: " + e);
        return false;
      });
  }

  // Login
  loginUser(username: string, pass: string) {
    if (!this.database) return Promise.reject("BD no lista");
    return this.database.executeSql('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, pass])
      .then(res => {
        return res.rows.length > 0;
      });
  }

  getUser(username: string) {
    if (!this.database) return Promise.reject("BD no lista");
    return this.database.executeSql('SELECT * FROM usuarios WHERE username = ?', [username])
      .then(res => {
        if (res.rows.length > 0) {
          return {
            id: res.rows.item(0).id,
            username: res.rows.item(0).username,
            image: res.rows.item(0).image
          }
        }
        return null;
      });
  }

  updateUserImage(username: string, image: string) {
    if (!this.database) return Promise.reject("BD no lista");
    return this.database.executeSql('UPDATE usuarios SET image = ? WHERE username = ?', [image, username])
      .then(() => {
        this.presentToast("Foto de perfil actualizada");
        return true;
      })
      .catch(e => {
        this.presentToast("Error actualizando foto: " + e);
        return false;
      });
  }

}
