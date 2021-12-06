export const tableColumns = [
  {
    label: "件名",
    fieldName: "LinkUrl",
    type: "url",
    typeAttributes: { label: { fieldName: "Subject" }, target: "_self" },
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
  { label: "担当者", fieldName: "OwnerName", type: String, sortable: true }
];