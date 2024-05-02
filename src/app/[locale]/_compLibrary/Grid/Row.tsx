// @ts-nocheck
import React from 'react';
import styles from './Grid.module.scss';
import { Children, CSSProperties, ReactNode, isValidElement, cloneElement, forwardRef } from 'react';

type RowProps = {
	style?: CSSProperties
	className?: string
	children?: ReactNode
	/** @default 0 */
	rowGutter?: number | string
	/** @default 0 */
	colGutter?: number | string
}


const Row = forwardRef<HTMLDivElement, RowProps>((props, ref): JSX.Element => {
	const {
		style,
		className = '',
		children,
		rowGutter = 0,
		colGutter = 0,
	} = props;

	const childrenWithProps = Children.map(children, (child, index) => {
		if (isValidElement(child)) {
			return cloneElement(child, { rowgutter: rowGutter, colgutter: colGutter });
		}
		return child;
	});


	return (
		<div ref={ref} className={`${className} ${styles.row}`} style={{
			...style,
			marginRight: -rowGutter,
			marginLeft: -rowGutter,
			marginTop: -colGutter,
			marginBottom: -colGutter,
		}}>
			{childrenWithProps}
		</div>
	)
})

export default Row;