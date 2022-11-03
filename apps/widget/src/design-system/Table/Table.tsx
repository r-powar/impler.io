import { Table as MantineTable } from '@mantine/core';
import useStyles from './Table.style';
import { getErrorObject } from '../../util/helpers';
import { InvalidWarning } from '../InvalidWarning';

interface IHeadingItem {
  title: string;
  key: string;
  width?: number | string;
}

interface ITableProps {
  emptyDataText?: string;
  headings?: IHeadingItem[];
  data?: Record<string, any>[];
}

export function Table(props: ITableProps) {
  const { classes } = useStyles();
  const { data, headings, emptyDataText = 'No Data Found!' } = props;

  const isHeadingsEmpty = !headings || !Array.isArray(headings) || !headings.length;
  const isDataEmpty = !data || !Array.isArray(data) || !data.length;

  const THead = () => {
    if (isHeadingsEmpty) return <thead />;

    return (
      <thead className={classes.heading}>
        <tr>
          {headings.map((heading: IHeadingItem, index: number) => (
            <th style={{ textAlign: 'center', width: heading.width || '' }} key={index}>
              {heading.title}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const TBody = () => {
    let errorObject: Record<string, string>;
    if (isHeadingsEmpty) return <tbody />;

    if (isDataEmpty)
      return (
        <tbody>
          <tr>
            <td colSpan={headings?.length || 1}>{emptyDataText}</td>
          </tr>
        </tbody>
      );

    return (
      <tbody>
        {data.map((item: Record<string, string>, i: number) => {
          errorObject = getErrorObject(item.error);

          return (
            <tr key={item.id || i}>
              {headings.map((heading: IHeadingItem, fieldIndex: number) =>
                errorObject[heading.key] ? (
                  // if error exist for column
                  <td key={fieldIndex} className={classes.invalidColumn}>
                    {item[heading.key]}
                    <InvalidWarning label={errorObject[heading.key]} />
                  </td>
                ) : (
                  // normal column
                  <td key={fieldIndex}>{item[heading.key]}</td>
                )
              )}
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <MantineTable withBorder withColumnBorders className={classes.table}>
      <THead />
      <TBody />
    </MantineTable>
  );
}