import dayjs from "dayjs";
import * as XlSX from "xlsx";

export function useExcelDownload<T>(data: T[], fileName: string) {
  const downalod = () => {
    if (data === undefined) return;

    const fullFileName = `${dayjs().format("YYYY-MM-DD")} ${fileName}.xlsx`;
    const sheet = XlSX.utils.json_to_sheet(data);
    const book = XlSX.utils.book_new();
    XlSX.utils.book_append_sheet(book, sheet, "Sheet1");
    XlSX.writeFile(book, fullFileName);
  };

  return { downalod };
}
