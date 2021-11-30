import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CompanyCategory } from 'src/models/company.category.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { SYSTEM } from 'src/shared/constants';


@Injectable({
  providedIn: 'root'
})
export class InteractionService {



  url: string;
  private interactionListBehaviorSubject: BehaviorSubject<Interaction[]>;
  public interactionListTabObservable: Observable<Interaction[]>;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
    this.interactionListBehaviorSubject = new BehaviorSubject<Interaction[]>([]);
    this.interactionListTabObservable = this.interactionListBehaviorSubject.asObservable();
  }

  getByOtherId(otherId: string) {
    return this.http.get<CompanyCategory>(`${this.url}/api/interaction/get-by-otherid.php?OtherId=${otherId}`)
  }

  update(image: Interaction) {
    return this.http.post<Interaction>(
      `${this.url}/api/interaction/update-interaction.php`, image
    );
  }

  add(company: Interaction) {
    return this.http.post<Interaction>(
      `${this.url}/api/interaction/add-interaction.php`, company
    );
  }

  delete(InteractionId: string) {
    return this.http.post<any>(
      `${this.url}/api/interaction/delete-interaction.php`, { InteractionId: InteractionId }
    );
  }
  getInteractions(interactionSearchModel: InteractionSearchModel) {
    return this.http.post<Interaction[]>(
      `${this.url}/api/interaction/get-interactions.php`, interactionSearchModel
    );
  }
  getInteractionsBySource(interactionSearchModel: InteractionSearchModel) {
    return this.http.post<Interaction[]>(
      `${this.url}/api/interaction/get-interactions-by-source.php`, interactionSearchModel
    );
  }
  getInteractionsBySourceSync(interactionSearchModel: InteractionSearchModel) {
    this.http.post<Interaction[]>(
      `${this.url}/api/interaction/get-interactions-by-source.php`, interactionSearchModel
    ).subscribe(data => {
      this.updateInteractionListState(data);
    });
  }

  updateInteractionListState(state: Interaction[]) {
    // if (state) {
    this.interactionListBehaviorSubject.next(state);
    // localStorage.setItem('InteractionList', JSON.stringify(state));
    // }
  }



  logCompanyPage(user: User, company: Company) {
    if(!environment.production){
      return  false;
    }
    const interaction = {
      InteractionId: "",
      InteractionType: "ViewCompany",
      InteractionSourceId: user?.UserId || '',
      InteractionTargetId: company.CompanyId,
      TraceId: '1',
      InteractionBody: "Follow",
      Color: '',
      Size: '',
      Price: 0,
      Name: company.Name,
      Description: company.Description,
      InteractionStatus: "Valid",
      ImageUrl: company.Dp,
      SourceType: "",
      SourceName: user?.Name || '',
      SourceDp: user?.Dp || '',
      TargetType: "",
      TargetName: "",
      TargetDp: "",
      CreateUserId: SYSTEM,
      ModifyUserId: SYSTEM,
      StatusId: 4
    }

    this.add(interaction).subscribe(data => {
      if (data && data.InteractionId) {
      }
    })

  }


  logProductPage(user: User, product: Product) {
    if(!environment.production){
      return  false;
    }
    const interaction = {
      InteractionId: "",
      InteractionType: "ViewProduct",
      InteractionSourceId: user?.UserId || '',
      InteractionTargetId: product.CompanyId,
      TraceId: '1',
      InteractionBody: "Follow",
      Color: '',
      Size: '',
      Price: 0,
      Name: product.Name,
      Description: product.Description,
      InteractionStatus: "Valid",
      ImageUrl: product.FeaturedImageUrl,
      SourceType: "",
      SourceName: user?.Name || '',
      SourceDp: user?.Dp || '',
      TargetType: "",
      TargetName: "",
      TargetDp: "",
      CreateUserId: SYSTEM,
      ModifyUserId: SYSTEM,
      StatusId: 4
    }

    this.add(interaction).subscribe(data => {
      if (data && data.InteractionId) {
      }
    })

  }


  
  logCategoryPage(user: User, category: Category) {
    if(!environment.production){
      return  false;
    }
    const interaction = {
      InteractionId: "",
      InteractionType: "ViewCategory",
      InteractionSourceId: user?.UserId || '',
      InteractionTargetId: category.CategoryId,
      TraceId: '1',
      InteractionBody: "Follow",
      Color: '',
      Size: '',
      Price: 0,
      Name: category.Name,
      Description: category.Description,
      InteractionStatus: "Valid",
      ImageUrl: category.ImageUrl ,
      SourceType: "",
      SourceName: user?.Name || '',
      SourceDp: user?.Dp || '',
      TargetType: "",
      TargetName: "",
      TargetDp: "",
      CreateUserId: SYSTEM,
      ModifyUserId: SYSTEM,
      StatusId: 4
    }

    this.add(interaction).subscribe(data => {
      if (data && data.InteractionId) {
      }
    })

  }



  logHomePage(user: User, pageName: string ,description: string = '',  interactionType:string = "ViewHomePage") {
    if(!environment.production){
      return  false;
    }
    const interaction = {
      InteractionId: "",
      InteractionType: interactionType,
      InteractionSourceId: user?.UserId || '',
      InteractionTargetId: pageName,
      TraceId: '1',
      InteractionBody: "Follow",
      Color: '',
      Size: '',
      Price: 0,
      Name: pageName,
      Description: description,
      InteractionStatus: "Valid",
      ImageUrl: '',
      SourceType: "",
      SourceName: user?.Name || '',
      SourceDp: user?.Dp || '',
      TargetType: "",
      TargetName: "",
      TargetDp: "",
      CreateUserId: SYSTEM,
      ModifyUserId: SYSTEM,
      StatusId: 4
    }

    this.add(interaction).subscribe(data => {
      if (data && data.InteractionId) {
      }
    })

  }

}
