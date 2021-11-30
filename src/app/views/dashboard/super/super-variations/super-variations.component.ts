import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Variation, VariationOption } from 'src/models';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService, CompanyVariationService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { COMPANY_TYPE, VARIATION_PRICE_MODES, VARIATION_SELECTION_MODES } from 'src/shared/constants';

@Component({
  selector: 'app-super-variations',
  templateUrl: './super-variations.component.html',
  styleUrls: ['./super-variations.component.scss']
})
export class SuperVariationsComponent implements OnInit {

  variations: Variation[] = [];
  variation: Variation;
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  index = 0;
  modalHeading;
  showModal;
  newOption: VariationOption;
  usersItems: SliderWidgetModel[]
  showFilter = true;
  primaryAction = 'Add variation'
  newOptionName;
  VARIATION_SELECTION_MODES = VARIATION_SELECTION_MODES;
  VARIATION_PRICE_MODES = VARIATION_PRICE_MODES;
  constructor(
    private accountService: AccountService,
    private companyVariationService: CompanyVariationService,
    private router: Router,
    private uxService: UxService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.load()
  }

  load() {
    this.companyVariationService.getAllVariations(COMPANY_TYPE).subscribe(data => {
      if (data) {
        this.variations = data;
        this.loadListItems();
        // this.variations.map(x => x.IsSelected = false);
        // this.variations[this.index].IsSelected = true;
        // this.heading = `All variations (${this.variations.length})`;
        // this.loadNewOption(this.variations[this.index]);
      }
    });
  }

  loadListItems() {
    if (this.variations) {
      this.usersItems = [];
      this.variations.forEach(item => {
        this.usersItems.push({
          Id: `${item.VariationId}`,
          Name: `${item.Name}`,
          Description: `-${item.SelectionType}`,
          Description2: `-${item.PriceMode}`,
          Link: `event`,
          Icon: 'assets/images/icons/variations.svg'
        })


      })
    }
  }
  saveOption(option: VariationOption = null) {
    if (this.variations) {
      if (option && Number(option.VariationOptionId) > 0 && option.CreateDate) {
        this.companyVariationService.updateVariationOption(option).subscribe(data => {
          this.uxService.showQuickMessage('Option updated.');

        })
      } else {
        this.companyVariationService.addVariationOption(
          {
            VariationOptionId: '',
            VariationId: this.variation.VariationId,
            Name: this.newOptionName,
            Description: '#ffffff',
            ImageUrl: '',
            CreateUserId: this.user.UserId,
            ModifyUserId: this.user.UserId,
            StatusId: 1
          }
        ).subscribe(data => {
          if (data && data.VariationOptionId) {
            this.uxService.showQuickMessage('Option created.');
            this.variation.VariationsOptions.push(data);
            this.newOptionName = '';
          }
        })
      }
    }
  }
  back() {
    this.router.navigate(['/admin/dashboard']);
  }


  view(variation: Variation, index) {
    if (variation && variation.VariationId) {
      this.index = index;
      this.variations.map(x => x.IsSelected = false);
      this.variations[this.index].IsSelected = true;
      this.loadNewOption(this.variations[this.index]);
    }

  }
  add(variation?: Variation) {
    this.router.navigate(['admin/dashboard/super-variation-options', variation && variation.VariationId || 'add']);
  }
  edit(item: VariationOption) {

  }

  saveVariation() {
    if (this.variation.VariationId.length > 0 && this.variation.CreateDate) {
      this.companyVariationService.update(this.variation).subscribe(data => {
        this.uxService.showQuickMessage('Variation updated.');
        this.variation = data;
      })
    } else {
      this.companyVariationService.add(this.variation).subscribe(data => {
        this.uxService.showQuickMessage('Variation created.');
        this.variation = data;
        this.load();
      })
    }

  }
  closeModal() { }
  updateOption(option: VariationOption) {
    this.companyVariationService.updateVariationOption(option).subscribe(data => {

    });
  }
  addVariationOption() {
    if (!this.newOption.Name) {
      return false;
    }
    this.companyVariationService.addVariationOption(this.newOption).subscribe(data => {
      if (data && data.VariationId && this.variations[this.index] && this.variations[this.index].VariationsOptions) {
        this.variations[this.index].VariationsOptions.push(data);
        this.loadNewOption(this.variations[this.index]);
      }

    });
  }

  OnItemSelected(item: SliderWidgetModel) {
    const variation = this.variations.find(x => `${x.VariationId}` === item.Id);
    if (variation) {
      this.variation = variation;
      this.heading = 'View or edit variation'
    }
  }

  loadNewOption(variation: Variation) {
    this.newOption = {
      VariationOptionId: '',
      VariationId: variation.VariationId,
      Name: undefined,
      Description: '#ffffff',
      ImageUrl: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
  }

  onPrimaryActionEvent(event) {
    if (event) {
      this.heading = 'Add new food item'
      this.variation = {
        CompanyVariationId: '',
        CompanyId: '',
        VariationId: '',
        Name: '',
        SelectionType: VARIATION_SELECTION_MODES[0].Name,
        CompanyType: COMPANY_TYPE,
        Description: '',
        IsDeleted: false,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      };
    }
  }
  deleteOption(option: VariationOption, index: number) {
    this.companyVariationService.deleteVariationOption(option.VariationOptionId).subscribe(data => {
      if (data && Number(data) === 1) {
        this.variation.VariationsOptions.splice(index, 1);
        this.uxService.showQuickMessage('Option deleted.');
      }
    })
  }
  deleteVariation() {
    this.companyVariationService.deleteVariation(this.variation.VariationId).subscribe(data => {
      if (data && Number(data) === 1) {
        this.uxService.showQuickMessage('Variation deleted.');
        this.load();
        this.variation = null;
      }
    })
  }
}
