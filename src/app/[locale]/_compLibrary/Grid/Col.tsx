import React, { CSSProperties, ReactNode, forwardRef } from 'react';
import styles from './Grid.module.scss';
import classNames from 'classnames/bind';
import { toRem } from '@utils/helpers';

const cx = classNames.bind(styles);

type ColType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface CommonGrid {
	xs?: ColType
	sm?: ColType
	md?: ColType
	lg?: ColType
	xlg?: ColType
	xxlg?: ColType
}

interface Grid extends CommonGrid {
	/** @description default or without responsive value */
	span?: ColType
}

interface Offset extends CommonGrid {
	/** @description default or without responsive value */
	span?: ColType
}

interface Order extends CommonGrid {
	/** @description default or without responsive value */
	span?: ColType
}

type ColProps = {
	style?: CSSProperties
	className?: string
	children?: ReactNode
	grid?: Grid
	offset?: Offset
	order?: Order
	/** @description Give it to Row. Not to Col */
	rowgutter?: ColType
	/** @description Give it to Row. Not to Col */
	colgutter?: ColType
}

const Col = forwardRef<HTMLDivElement, ColProps>((props, ref): JSX.Element => {
	const {
		style,
		className = '',
		children,
		grid,
		offset,
		order,
		rowgutter,
		colgutter,
	} = props

	return (
		<div ref={ref} className={`${className} ${cx({
			[`col-${grid?.span}`]: !!grid?.span,
			[`col-xs-${grid?.xs}`]: !!grid?.xs,
			[`col-sm-${grid?.sm}`]: !!grid?.sm,
			[`col-md-${grid?.md}`]: !!grid?.md,
			[`col-lg-${grid?.lg}`]: !!grid?.lg,
			[`col-xlg-${grid?.xlg}`]: !!grid?.xlg,
			[`col-xxlg-${grid?.xxlg}`]: !!grid?.xxlg,

			[`offset-${offset?.span}`]: !!offset?.span,
			[`offset-xs-${offset?.xs}`]: !!offset?.xs,
			[`offset-sm-${offset?.sm}`]: !!offset?.sm,
			[`offset-md-${offset?.md}`]: !!offset?.md,
			[`offset-lg-${offset?.lg}`]: !!offset?.lg,
			[`offset-xlg-${offset?.xlg}`]: !!offset?.xlg,
			[`offset-xxlg-${offset?.xxlg}`]: !!offset?.xxlg,

			[`order-${order?.span}`]: !!order?.span,
			[`order-xs-${order?.xs}`]: !!order?.xs,
			[`order-sm-${order?.sm}`]: !!order?.sm,
			[`order-md-${order?.md}`]: !!order?.md,
			[`order-lg-${order?.lg}`]: !!order?.lg,
			[`order-xlg-${order?.xlg}`]: !!order?.xlg,
			[`order-xxlg-${order?.xxlg}`]: !!order?.xxlg,
		})
			}`} style={{
				...style,
				paddingLeft: toRem(rowgutter as number),
				paddingRight: toRem(rowgutter as number),
				paddingTop: toRem(colgutter as number),
				paddingBottom: toRem(colgutter as number),
			}}>
			{children}
		</div>
	)
})

export default Col;