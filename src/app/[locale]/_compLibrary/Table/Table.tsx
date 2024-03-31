import React, { ReactNode, useState } from "react";

// custom styles 
import styles from './Table.module.scss';


interface TableProps<T> {
  headData?: Array<string>
  bodyData: Array<T>
  renderHead: (data: string, index: number) => ReactNode
  renderBody: (data: T, index: number) => ReactNode
  className?: string
}

function Table<T>(props: TableProps<T>) {

  const {
    headData,
    bodyData,
    renderHead,
    renderBody,
    className = '',
  } = props;

  return (
    <div className={`${className} ${styles.table_wrapper}`}>
      <table className={styles.table} >
        {headData && renderHead ? (
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              {headData.map((item, index) =>
                renderHead(item, index)
              )}
            </tr>
          </thead>
        ) : null}
        {bodyData && renderBody ? (
          <tbody className={styles.tbody}>
            {bodyData.map((item, index) =>
              renderBody(item, index)
            )}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};

export default Table;
