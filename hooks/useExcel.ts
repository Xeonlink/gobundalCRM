import * as XlSX from "xlsx";

export function useExcel() {
  const download = <T>(data: T[], fileName: string) => {
    if (data === undefined) return;

    const sheet = XlSX.utils.json_to_sheet(data);
    const book = XlSX.utils.book_new();
    XlSX.utils.book_append_sheet(book, sheet, "Sheet1");
    XlSX.writeFile(book, fileName + ".xlsx");
  };

  return { download };
}
