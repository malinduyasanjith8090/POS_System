import React from 'react';
import { useLoading } from '../../hooks/useLoading';
import classes from './loading.module.css';

export default function Loading() {
    const { isLoading } = useLoading();
    if (!isLoading) return null; // Prevent rendering when not loading

    return (
        <div className={classes.container}>
            <div className={classes.items}>
                <div className={classes.loader}></div>
                <h1>Loading...</h1>
            </div>
        </div>
    );
}
