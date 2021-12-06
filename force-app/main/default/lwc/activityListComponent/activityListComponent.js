import { api, LightningElement } from "lwc";
import selectList from "@salesforce/apex/ActivityListController.selectList";
import { tableColumns } from "./someUtils";

export default class ActivityListComponent extends LightningElement {
  /** テーブル表示データ */
  data;
  filteredData;

  /** テーブル設定 */
  columns = tableColumns;

  /** ソート用 */
  defaultSortDirection = "asc";
  sortDirection = "asc";
  sortedBy;

  /** フィルター */
  filter1;

  /** レコードID */
  @api recordId;

  /** フィルター操作 */
  onChangeFilter(event) {
    console.log("onChangeFilter start");
    console.log(event);
    console.log(event.target.value);

    this.filteredData = this.data.filter((d) => {
      return d.Subject.includes(event.target.value);
    });

    console.log(this.filteredData);
  }

  /** ソート処理詳細 */
  sortBy(field, reverse, primer) {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    return function (a, b) {
      a = key(a);
      b = key(b);
      return reverse * ((a > b) - (b > a));
    };
  }

  /** ソート処理 */
  onHandleSort(event) {
    const { fieldName: sortedBy, sortDirection } = event.detail;
    const cloneData = [...this.data];

    cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));
    this.data = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
  }

  /** 起動時処理 */
  connectedCallback() {
    console.log("connectedCallback");
    console.log("this.recordId = " + this.recordId);
    selectList({ recordId: this.recordId })
      .then((result) => {
        console.log(result);
        // データの加工
        result.forEach(function (obj) {
          obj["OwnerName"] = obj.Owner.Name; // 所有者名
          obj["LinkUrl"] = "/" + obj.Id; // リンクURL
        });
        this.data = result;
        this.filteredData = result;
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
  }
}