import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyCategory } from 'src/models/company.category.model';
import { Category } from 'src/models/category.model';
import { Company } from 'src/models/company.model';
import { AdminStatModel } from 'src/models/UxModel.model';
import { Product, User } from 'src/models';
import { OPEN_CLOSE, YOUR_API_KEY } from 'src/shared/constants';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {


  private companyCategoryListBehaviorSubject: BehaviorSubject<CompanyCategory[]>;
  public companyCategoryListObservable: Observable<CompanyCategory[]>;

  private systemCategoryListBehaviorSubject: BehaviorSubject<Category[]>;
  public systemCategoryListObservable: Observable<Category[]>;



  private systemCategoryBehaviorSubject: BehaviorSubject<Category>;
  public systemCategoryObservable: Observable<Category>;

  private systemChilndrenCategoryListBehaviorSubject: BehaviorSubject<Category[]>;
  public systemChilndrenCategoryListObservable: Observable<Category[]>;

  private parentCategoryListBehaviorSubject: BehaviorSubject<CompanyCategory[]>;
  public parentCategoryListObservable: Observable<CompanyCategory[]>;

  private companyCategoryBehaviorSubject: BehaviorSubject<CompanyCategory>;
  public companyCategoryObservable: Observable<CompanyCategory>;

  private companyListBehaviorSubject: BehaviorSubject<Company[]>;
  public companyListObservable: Observable<Company[]>;
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.companyCategoryListBehaviorSubject =
      new BehaviorSubject<CompanyCategory[]>(JSON.parse(localStorage.getItem('companyCategorysList')) || []);

    this.systemCategoryListBehaviorSubject =
      new BehaviorSubject<Category[]>(JSON.parse(localStorage.getItem('systemsCategorysList')));
    this.systemCategoryListObservable = this.systemCategoryListBehaviorSubject.asObservable();

    this.systemCategoryBehaviorSubject =
      new BehaviorSubject<Category>(JSON.parse(localStorage.getItem('systemCategoryBehaviorSubject')));
    this.systemCategoryObservable = this.systemCategoryBehaviorSubject.asObservable();

    this.systemChilndrenCategoryListBehaviorSubject =
      new BehaviorSubject<Category[]>(JSON.parse(localStorage.getItem('systemsChilndrenCategorysList')));
    this.systemChilndrenCategoryListObservable = this.systemChilndrenCategoryListBehaviorSubject.asObservable();

    this.parentCategoryListBehaviorSubject =
      new BehaviorSubject<CompanyCategory[]>(JSON.parse(localStorage.getItem('parentCategorysList')));
    this.parentCategoryListObservable = this.parentCategoryListBehaviorSubject.asObservable();

    this.companyCategoryBehaviorSubject = new BehaviorSubject<CompanyCategory>(JSON.parse(localStorage.getItem('currentcompanyCategory')));
    this.companyCategoryListObservable = this.companyCategoryListBehaviorSubject.asObservable();
    this.companyCategoryObservable = this.companyCategoryBehaviorSubject.asObservable();

    this.companyListBehaviorSubject =
      new BehaviorSubject<Company[]>(JSON.parse(localStorage.getItem('companyList')));
    this.companyListObservable = this.companyListBehaviorSubject.asObservable();

    this.url = environment.API_URL;
  }

  public get currentcompanyCategoryValue(): CompanyCategory {
    return this.companyCategoryBehaviorSubject.value;
  }

  public get currentCategoryValue(): Category {
    return this.systemCategoryBehaviorSubject.value;
  }

  updateCategoryState(category: Category) {
    this.systemCategoryBehaviorSubject.next(category);
    localStorage.setItem('systemCategoryBehaviorSubject', JSON.stringify(category));
  }
  updateCompanyListState(companyList: Company[]) {
    this.companyListBehaviorSubject.next(companyList);
    localStorage.setItem('companyList', JSON.stringify(companyList));
  }



  public get geteCompanyListState(): Company[] {
    return this.companyListBehaviorSubject.value;
  }

  updatecompanyCategoryListState(grades: CompanyCategory[]) {
    this.companyCategoryListBehaviorSubject.next(grades);
    localStorage.setItem('companyCategorysList', JSON.stringify(grades));
  }
  updateSystemCategoryListState(categories: Category[]) {
    this.systemCategoryListBehaviorSubject.next(categories);
    localStorage.setItem('systemsCategorysList', JSON.stringify(categories));
  }
  updateSystemChilndrenCategoryListState(categories: Category[]) {
    this.systemChilndrenCategoryListBehaviorSubject.next(categories);
    localStorage.setItem('systemsChilndrenCategorysList', JSON.stringify(categories));
  }
  updateParentCategoryListState(categories: CompanyCategory[]) {
    this.parentCategoryListBehaviorSubject.next(categories);
    localStorage.setItem('parentCategorysList', JSON.stringify(categories));
  }


  updatecompanyCategoryState(companyCategory: CompanyCategory) {
    this.companyCategoryBehaviorSubject.next(companyCategory);
    localStorage.setItem('currentcompanyCategory', JSON.stringify(companyCategory));
  }

  addCompanyCategoriesRange(categories: CompanyCategory[]) {
    return this.http.post<CompanyCategory[]>(
      `${this.url}/api/companycategories/add-company-categories-range.php`, categories
    );
  }

  getcompanyCategories(companyId: string) {
    this.http.get<CompanyCategory[]>(
      `${this.url}/api/companycategories/list-company-categories.php?CompanyId=${companyId}`
    ).subscribe(data => {
      if (data) {
        this.updatecompanyCategoryListState(data);
      }
    });
  }
  getSuperCompanies() {
    return this.http.get<Company[]>(
      `${this.url}/api/company/get-companies.php`
    );
  }
  getLocations() {
    return this.http.get<Company[]>(
      `${this.url}/api/company/get-company-locations.php`
    );
  }
  getSuperCompaniesAySync() {
    this.http.get<Company[]>(
      `${this.url}/api/company/get-companies.php`
    ).subscribe(data => {
      const companyList = this.geteCompanyListState;
      if (companyList && JSON.stringify(companyList) === JSON.stringify(data)) {
        // alert("Sale list");
        return;
      }
      else {
        this.updateCompanyListState(data);
      }
    });
  }
  getCompanyById(companyId) {
    return this.http.get<Company>(
      `${this.url}/api/company/get-by-id.php?CompanyId=${companyId}`
    );
  }

  getCategory(categoryId: string) {
    const params = `CategoryId=${categoryId}`;
    return this.http.get<Category>(
      `${this.url}/api/categories/get-by-id.php?${params}`
    );
  }

  getSystemChildrenCategories(parentId: string = '') {
    const params = `ParentId=${parentId}`;
    this.http.get<Category[]>(
      `${this.url}/api/companycategories/list-system-chilndren-categories.php?${params}`
    ).subscribe(data => {
      if (data) {
        this.updateSystemChilndrenCategoryListState(data);
      }
    });
  }

  getcompanyCategory(companyCategoryId: string) {
    this.http.get<CompanyCategory>(`${this.url}/$ ?companyCategoryId=${companyCategoryId}`).subscribe(data => {
      this.updatecompanyCategoryState(data);
    });
  }

  update(company: Company) {
    return this.http.post<Company>(
      `${this.url}/api/company/update-company.php`, company
    );
  }
  add(company: Company) {
    return this.http.post<Company>(
      `${this.url}/api/company/add-company.php`, company
    );
  }
  QueryDelete(q: string) {
    return this.http.post<Company>(
      `${this.url}/api/company/delete-by-query.php`, {Query: q}
    );
  }

  getNearBy(shopNearBy: string[]) {
    return this.http.post<Company[]>(
      `${this.url}/api/company/get-shops-range.php`, shopNearBy
    );
  }
  getProductsNearBy(shopNearBy: string[]) {
    return this.http.post<Product[]>(
      `${this.url}/api/company/get-products-range.php`, shopNearBy
    );
  }
  getCategoriesNearBy(shopNearBy: string[]) {
    return this.http.post<Category[]>(
      `${this.url}/api/company/get-categories-range.php`, shopNearBy
    );
  }

  getCompaniesNearBy(latitude: string, longitude: string, radius: string) {
    return this.http.get<Company[]>(
      `${this.url}/api/company/get-near-by-loactions.php?Radius=${radius}&Latitude=${latitude}&Longitude=${longitude}`
    );
  }



  getUsersNearBy(latitude: number, longitude: number, radius: number, userType: string, OrdersId) {
    return this.http.get<User[]>(
      `${this.url}/api/company/get-near-by-users.php?Radius=${radius}&Latitude=${latitude}&Longitude=${longitude}&UserType=${userType}&OrdersId=${OrdersId}`
    );
  }

  getAddress(latitude: number, longitude: number) {
    return this.http.get<any>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${YOUR_API_KEY}`
    );
  }



  getAdminStat() {
    return this.http.get<AdminStatModel>(`${this.url}/api/company/get-admin-stat.php`);
  }

  getAdminStatByCompanyId(companyId: string) {
    return this.http.get<AdminStatModel>(`${this.url}/api/company/get-admin-stat-by-company-id.php?CompanyId=${companyId}`);
  }

  hexToRgbA(hex) {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
    }
    throw new Error('Bad Hex');
  }
  rgb2hex(rgb) {
    rgb = `rgb(${rgb})`;
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? '#' +
      ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
  }

  getWarning(company: Company) {
    if (company && company.OperatingHours && company.OperatingHours.length) {
      if (company.OperatingHours[0].OperatingStatus === OPEN_CLOSE[1].Name) {
        return 'Currently not taking orders';
      }
      const today = new Date();
      const date1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), Number(company.OperatingHours[0].StartTime.split(":")[0]), Number(company.OperatingHours[0].StartTime.split(":")[1]), 0);
      const date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), Number(company.OperatingHours[0].FinishTime.split(":")[0]), Number(company.OperatingHours[0].FinishTime.split(":")[1]), 0);
      console.log(date1, date2);
      const resultOpen = date1 <= (new Date());
      const resultClosed = date2 <= (new Date());
      if (!resultOpen || resultClosed) {
        return 'Currently not taking orders';
      }
    }
  }
}
