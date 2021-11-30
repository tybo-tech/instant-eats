import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, User } from 'src/models';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService, CompanyCategoryService } from 'src/services';

@Component({
  selector: 'app-super-categories',
  templateUrl: './super-categories.component.html',
  styleUrls: ['./super-categories.component.scss']
})
export class SuperCategoriesComponent implements OnInit {
  categories: Category[] = [];
  category: Category;
  user: User;
  usersItems: SliderWidgetModel[]
  showFilter = true;
  primaryAction = 'Add category'
  constructor(
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.laod();

  }



  add() {
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }

  OnItemSelected(item: SliderWidgetModel) {
    const cat = this.categories.find(x => x.CategoryId === item.Id);
    if (cat) {
      this.category = cat;
      // this.update()
    }
  }
  save() {
    if(this.category.CreateDate && this.category.CategoryId.length > 1){
      this.companyCategoryService.update(this.category).subscribe(data => {
        console.log(data);
        this.category = null;
        this.laod();
      })
    }else{
      this.companyCategoryService.add(this.category).subscribe(data => {
        console.log(data);
        this.category = null;
        this.laod();
      })
    }
   
  }

  laod() {

    this.companyCategoryService.getSystemCategories('Foods', 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.categories = data;
        this.usersItems = [];
        data.forEach(item => {
          this.usersItems.push({
            Id: `${item.CategoryId}`,
            Name: `${item.Name}`,
            Description: ``,
            Link: `event`,
            Icon: item.ImageUrl
          })


        })
      }
    });
  }

  onImageChangedEvent(url) {
    if (this.category) {
      this.category.ImageUrl = url;
    }
  }
  onPrimaryActionEvent(event) {
    if (event) {
      this.category = {
        CategoryId: '',
        Name: '',
        ParentId: '',
        Description: '',
        DisplayOrder: 0,
        CategoryType: 'Child',
        CompanyType: 'Foods',
        ImageUrl: '',
        PhoneBanner: '',
        IsDeleted: false,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
        Children: []
      };
    }
  }
}
