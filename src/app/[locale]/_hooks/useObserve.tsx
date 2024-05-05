import {useCallback} from 'react'

interface UseObserveProps {
    observer: any
    fetchNextPage: () => void
    hasNextPage: boolean | undefined
    isFetching: boolean
    isLoading: boolean
}
const useObserve = (props: UseObserveProps) => {
    const {
        observer,
        fetchNextPage, 
        hasNextPage, 
        isFetching, 
        isLoading
    } = props
    
    const lastElementRef = useCallback(
        (node: HTMLDivElement) => {
        if (isLoading) return;
    
        if (observer.current) observer.current.disconnect();
    
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetching) {
                fetchNextPage();
            }
        });
    
        if (node) observer.current.observe(node);
        },
        [observer, fetchNextPage, hasNextPage, isFetching, isLoading]
    );

    return lastElementRef
}

export default useObserve
