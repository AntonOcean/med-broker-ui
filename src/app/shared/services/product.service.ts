import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {Product} from '../models/product';
import {AuthService} from './auth.service';
import {ToastrService} from './toastr.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Category} from '../models/category';
import {Servs} from '../models/servs';

@Injectable()
export class ProductService {
  products: AngularFireList<Product>;
  product: AngularFireObject<Product>;

  // favouriteProducts
  favouriteProducts: AngularFireList<FavouriteProduct>;
  cartProducts: AngularFireList<FavouriteProduct>;

  // NavbarCounts
  navbarCartCount = 0;
  navbarFavProdCount = 0;

  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.calculateLocalFavProdCounts();
    this.calculateLocalCartProdCounts();
  }

  getProducts(query = ''): Observable<Product[]> {
    if (query) {
      return this.http.get<Product[]>(`/v1/ui/servs?q=${query}`);
    }
    return this.http.get<Product[]>('/v1/ui/servs');
  }

  getCategories(): Observable<Category> {
    return this.http.get<Category>('/v1/ui/category');
  }

  createProduct(data: Product) {
    this.products.push(data);
  }

  getProductById(key: string) {
    return this.http.get<Product>(`/v1/ui/servs/${key}`);
  }

  getSuggest(data) {
    return this.http.post<Servs>('/v1/suggest', {
      patient: {
        patient_id: +data.client_id,
        sex: 1,
        birthday: 1996
      },
      selected_servs: data.servs
    });
  }

  createOrder(data) {
    return this.http.post('/v1/confirm', {
      patient: {
        patient_id: +data.client_id,
        sex: 1,
        birthday: 1996
      },
      order_info: {
        order_id: Date.now(),
        depart_id: 5,
        order_date: Math.round(Date.now() / 1000)
      },
      final_servs: data.servs
    });
  }

  updateProduct(data: Product) {
    this.products.update(data.$key, data);
  }

  deleteProduct(key: string) {
    this.products.remove(key);
  }

  /*
   ----------  Favourite Product Function  ----------
  */

  // Get Favourite Product based on userId
  getUsersFavouriteProduct() {
    const user = this.authService.getLoggedInUser();
    this.favouriteProducts = this.db.list('favouriteProducts', (ref) =>
      ref.orderByChild('userId').equalTo(user.$key)
    );
    return this.favouriteProducts;
  }

  // Adding New product to favourite if logged else to localStorage
  addFavouriteProduct(data: Product): void {
    let a: Product[];
    a = JSON.parse(localStorage.getItem('avf_item')) || [];
    a.push(data);
    this.toastrService.wait('Добавлен', 'Анализ добавлен в избранное');
    setTimeout(() => {
      localStorage.setItem('avf_item', JSON.stringify(a));
      this.calculateLocalFavProdCounts();
    }, 1500);
  }

  // Fetching unsigned users favourite proucts
  getLocalFavouriteProducts(): Product[] {
    const products: Product[] = JSON.parse(localStorage.getItem('avf_item')) || [];

    return products;
  }

  // Removing Favourite Product from Database
  removeFavourite(key: string) {
    this.favouriteProducts.remove(key);
  }

  // Removing Favourite Product from localStorage
  removeLocalFavourite(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem('avf_item'));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem('avf_item', JSON.stringify(products));

    this.calculateLocalFavProdCounts();
  }

  // Returning Local Products Count
  calculateLocalFavProdCounts() {
    this.navbarFavProdCount = this.getLocalFavouriteProducts().length;
  }

  /*
   ----------  Cart Product Function  ----------
  */

  // Adding new Product to cart db if logged in else localStorage
  addToCart(data: Product): void {
    let a: Product[];

    a = JSON.parse(localStorage.getItem('avct_item')) || [];

    a.push(data);
    this.toastrService.wait('Добавлен', 'Анализ добавлен в корзину');
    setTimeout(() => {
      localStorage.setItem('avct_item', JSON.stringify(a));
      this.calculateLocalCartProdCounts();
    }, 500);
  }

  // Removing cart from local
  removeLocalCartProduct(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem('avct_item'));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem('avct_item', JSON.stringify(products));

    this.calculateLocalCartProdCounts();
  }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): Product[] {
    const products: Product[] = JSON.parse(localStorage.getItem('avct_item')) || [];

    return products;
  }

  // returning LocalCarts Product Count
  calculateLocalCartProdCounts() {
    this.navbarCartCount = this.getLocalCartProducts().length;
  }

  // Removing carts from local
  removeAllLocalCartProduct() {
    localStorage.setItem('avct_item', JSON.stringify([]));
    this.calculateLocalCartProdCounts();
  }
}

export class FavouriteProduct {
  product: Product;
  productId: string;
  userId: string;
}
