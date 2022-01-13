import { api, LightningElement } from "lwc";
import selectList from "@salesforce/apex/ActivityListController.selectList";

export default class ActivityListComponent extends LightningElement {
    /** テーブル表示データ */
    data;
    filteredData;

    /** テーブル設定 */
    columns = [
        {
            label: "件名",
            fieldName: "LinkUrl",
            type: "url",
            typeAttributes: {
                label: { fieldName: "Subject" },
                target: "_self"
            },
            sortable: true
        },
        {
            label: "開始日時",
            fieldName: "StartDateTime",
            type: "date",
            typeAttributes: {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            },
            sortable: true
        },
        {
            label: "終了日時",
            fieldName: "EndDateTime",
            type: "date",
            typeAttributes: {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            },
            sortable: true
        },
        {
            label: "最終更新日時",
            fieldName: "LastModifiedDate",
            type: "date",
            typeAttributes: {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            },
            sortable: true
        },
        {
            label: "担当者",
            fieldName: "OwnerName",
            type: String,
            sortable: true
        }
    ];

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
        this.filteredData = this.data.filter((d) => {
            return d.Subject.includes(event.target.value);
        });
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
        selectList({ recordId: this.recordId })
            .then((result) => {
                // データの加工
                result.forEach(function (obj) {
                    obj.OwnerName = obj.Owner.Name; // 所有者名
                    obj.LinkUrl = "/" + obj.Id; // リンクURL
                });
                this.data = result;
                this.filteredData = result;
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                }
                if (error.body) {
                    console.log(
                        error.body.message + "\n" + error.body.stackTrace
                    );
                }
            });
    }
}
