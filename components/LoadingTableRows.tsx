export function LoadingTableRows(props: { rowCount: number; colCount: number }) {
  const { rowCount = 10, colCount } = props;

  return new Array(rowCount).fill(0).map((_, index) => (
    <tr key={index} className='contents'>
      {new Array(colCount).fill(0).map((_, index) => (
        <td key={index} className='bg-white animate-pulse'></td>
      ))}
    </tr>
  ));
}
