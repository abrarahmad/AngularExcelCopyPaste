import { Component } from '@angular/core';
import { AdditionalField } from './additionalFieldModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'excel-copy-paste-App';
  afItems: AdditionalField[] = [];
  columnIndexMapper: Map<number, string> = new Map([
    [0, 'name'],
    [1, 'englishTranslation']
  ]); // using tuples to define values: [string, number][]
  addAdditionField() {
    const item = new AdditionalField();
    this.afItems.push(item);
  }
  paste(inputIndex: number, columnIndex: number, event: ClipboardEvent) {
    event.preventDefault(); // to avoid paste content in text box
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    const rowData = pastedText.split('\n');
    const columns = Array.from(Array(rowData[0].split('\t').length).keys());
    rowData.forEach((item, rowIndex) => {
      if (item && item.trim()) {
        columns.forEach(
          (col, colIndex) => {
            const value = item.split('\t')[colIndex];
            const propName = this.columnIndexMapper.get(columnIndex + colIndex);
            if (propName && value) {
              if (this.afItems[inputIndex + rowIndex]) {
                const af = this.afItems[inputIndex + rowIndex];
                af[propName] = value;
              } else {
                const af = new AdditionalField();
                af[propName] = value;
                this.afItems.push(af);
              }
            }
          });
      }
    });
  }
}
