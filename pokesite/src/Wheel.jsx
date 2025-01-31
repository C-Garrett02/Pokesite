import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import VisibleEntries from './VisibleEntries';


//THIS REALLY NEEDS REWORKING. TEMPTED TO NOT USE IT AT ALL.

const forwardArr = [];
const backwardsArr = [];

function debounce(callback, wait) {
    let timeout = null;
    return (() => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(callback, wait);
    })
}


function Wheel({ pokemon, incrementDex, decrementDex, items }) {
    let animationStep = 1;
    const totalAnimationSteps = 30;
    const intervalRef = useRef(null);
    let isScrolling = false;
    const refArray = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    //These are just used for my wheel. If the wheel is taken out, these need to be commented out. Not awesome but it's how I'm doing it for the moment.
    const windowSizeRef = useWindowSize();
    useLayoutEffect(calculateTransformations, []);

    function calculateTransformations() {  //Find difference between relative top value, left margin, brightness. Do this every time the window resizes, optimally, so the logic doesn't have to rerun every rerender
        forwardArr.length = 0;
        backwardsArr.length = 0;
        const matchStr = /\((\d*\.*\d*)\)/;
    
        for (let i = 0; i < refArray.length - 1; i++) { //For decrements
            const curElement = refArray[i].current;
            const nextElement = refArray[i + 1].current;
            const curElementStyle = window.getComputedStyle(curElement);
            const nextElementStyle = window.getComputedStyle(nextElement);
    
            const transformation = { //Values we'll have to add on to current values, gradually, to create a slide effect. Everything but top will need a starting and ending reference.
                top: (nextElement.offsetTop - curElement.offsetTop),
                marginLeft: {
                    start: parseInt(curElementStyle.marginLeft),
                    increment: parseInt(nextElementStyle.marginLeft) - parseInt(curElementStyle.marginLeft),
                    end: parseInt(nextElementStyle.marginLeft)
                },
                brightness: {
                    start: curElementStyle.filter.match(matchStr)[1],
                    increment: nextElementStyle.filter.match(matchStr)[1] - curElementStyle.filter.match(matchStr)[1],
                    end: nextElementStyle.filter.match(matchStr)[1]
                }
            };
            forwardArr.push(transformation)
        }
    
        for (let i = 1; i < refArray.length; i++) { //For increments
            const curElement = refArray[i].current;
            const nextElement = refArray[i - 1].current;
            const curElementStyle = window.getComputedStyle(curElement);
            const nextElementStyle = window.getComputedStyle(nextElement);
    
            const transformation = { //Values we'll have to add on to current values, gradually, to create a slide effect. Everything but top will need a starting and ending reference.
                top: (nextElement.offsetTop - curElement.offsetTop),
                marginLeft: {
                    start: parseInt(curElementStyle.marginLeft),
                    increment: parseInt(nextElementStyle.marginLeft) - parseInt(curElementStyle.marginLeft),
                    end: parseInt(nextElementStyle.marginLeft)
                },
                brightness: {
                    start: curElementStyle.filter.match(matchStr)[1],
                    increment: nextElementStyle.filter.match(matchStr)[1] - curElementStyle.filter.match(matchStr)[1],
                    end: nextElementStyle.filter.match(matchStr)[1]
                }
            };
            backwardsArr.push(transformation)
        }
    }

    function slideEntriesUp(totalAnimationSteps = 30) {
        const multiplyBy = animationStep / totalAnimationSteps

        for (let i = 0; i < refArray.length - 1; i++) { //loop through 
            refArray[i].current.style.top = (+forwardArr[i].top) * multiplyBy + 'px';
            refArray[i].current.style.marginLeft = +forwardArr[i].marginLeft.start + (+forwardArr[i].marginLeft.increment) * multiplyBy + 'px'; //offload the addition here to the calculation function in the future, perhaps.
            refArray[i].current.style.filter = 'brightness(' + +(+forwardArr[i].brightness.start + (+forwardArr[i].brightness.increment) * multiplyBy) + ')';
        }

        animationStep++;
        if (animationStep > totalAnimationSteps) { //last frame will be rendered
            animationStep = 1;
            clearInterval(intervalRef.current);
            decrementDex();
            isScrolling = true;
        }
    }

    function slideEntriesDown(totalAnimationSteps = 30) {
        const multiplyBy = animationStep / totalAnimationSteps
        for (let i = 1; i < refArray.length; i++) { //loop through 
            refArray[i].current.style.top = (+backwardsArr[i - 1].top) * multiplyBy + 'px';
            refArray[i].current.style.marginLeft = +backwardsArr[i - 1].marginLeft.start + (+backwardsArr[i - 1].marginLeft.increment) * multiplyBy + 'px'; //offload the addition here to the calculation function in the future, perhaps.
            refArray[i].current.style.filter = 'brightness(' + +(+backwardsArr[i - 1].brightness.start + (+backwardsArr[i - 1].brightness.increment) * multiplyBy) + ')';
        }

        animationStep++;
        if (animationStep > totalAnimationSteps) { //last frame will be rendered
            animationStep = 1;
            clearInterval(intervalRef.current);
            incrementDex();
            console.log(pokemon.dexnum)
            isScrolling = false;
        }
    }

    function useWindowSize() { //custom Hook that listens to window size, though its purpose currently is to rerender certain things on resize.
        console.log("updating size");
        const windowSizeRef = useRef([0, 0]);
        useLayoutEffect(() => {
            const updateSize = debounce(() => {
                windowSizeRef.current = [window.innerWidth, window.innerHeight];
                calculateTransformations();
            }, 100)
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, []);
        return windowSizeRef;
    }

    return (
        <div className={'wheel'}>
            <div className='pulloutBar'>
                <img id='leftArrow' src='/triangle.svg' />
            </div>
            <div className='directionButtons'>
                <div className="decrementButton">
                    <button onClick={() => {
                        if (pokemon.dexnum != 0 && isScrolling == false) {
                            isScrolling = true;
                            intervalRef.current = setInterval(slideEntriesUp, 10);
                        }
                    }}></button>
                </div>
                <div className="incrementButton">
                    <button onClick={() => {
                        if (pokemon.dexnum < items.length - 1 && isScrolling == false) {
                            isScrolling = true;
                            intervalRef.current = setInterval(slideEntriesDown, 10);
                        }
                    }}></button>
                </div>
            </div>
            <VisibleEntries num={pokemon.dexnum} pokemon={pokemon} refArray={refArray} items={items} />
        </div>
    )
}

export default Wheel;