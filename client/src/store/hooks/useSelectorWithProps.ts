import { useSelector } from 'react-redux';
import { ParametricSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export function useSelectorWithProps<P, R>(selector: ParametricSelector<RootState, P, R>, props: P) {
    return useSelector((state: RootState) => selector(state, props));
}
