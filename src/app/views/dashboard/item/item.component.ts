import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { MessageService } from 'primeng/api';
import { Item } from 'src/models/item.model';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Input() showItem: boolean;
  @Input() header: string;
  @Input() labels: string;


  @Output() itemEvent: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private itemService: ItemService, private uxService: UxService) {

  }

  ngOnInit(): void {
  }
  save() {
    if (this.item.CreateDate) {
      this.itemService.update(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.itemEvent.emit(data);
          this.uxService.showQuickMessage(`Item was updated successfully`);
        }

      });
    } else {
      this.itemService.add(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.itemEvent.emit(data);
          this.uxService.showQuickMessage(`Item was created successfully`);
        }


      });
    }
  }
  close() {
    this.closeEvent.emit(false);
  }
  onImageChangedEvent(url, index = 1) {
    if (index === 1)
      this.item.ImageUrl = url;

    if (index === 2)
      this.item.ImageUrl2 = url;

    if (index === 3)
      this.item.ImageUrl3 = url;

    if (index === 4)
      this.item.ImageUrl4 = url;

    if (index === 5)
      this.item.ImageUrl5 = url;

    if (index === 6)
      this.item.FooterImage = url;


  }
  onStyleEvent(e) {
    this.item.ItemStyle = e;
  }
  onImageStyleEvent(e) {
    this.item.ImageStyles = e;
  }
  onHeadingStyleEvent(e) {
    this.item.HeadingStyle = e;
  }
}
