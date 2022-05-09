import * as React from 'react'
import { Range, getTrackBackground } from 'react-range'
import { useDispatch, useSelector } from 'react-redux'
import { changeMintAmount } from '../../redux/minting/mintingActions'

const STEP = 1
const MIN = 0
const MAX = 10

export default function Marks() {
    const dispatch = useDispatch()
    const minting = useSelector((state) => state.minting)

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
            }}
        >
            <Range
                values={minting.mintAmount}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={(mintAmount) => dispatch(changeMintAmount({ mintAmount }))}
                renderMark={({ props, index }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '16px',
                            width: '5px',
                            backgroundColor: index * STEP < minting.mintAmount ? '#C13540' : '#ccc',
                        }}
                    />
                )}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%',
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: '5px',
                                width: '100%',
                                borderRadius: '4px',
                                background: getTrackBackground({
                                    values: minting.mintAmount,
                                    colors: ['#C13540', '#ccc'],
                                    min: MIN,
                                    max: MAX,
                                }),
                                alignSelf: 'center',
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props, isDragged }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '42px',
                            width: '42px',
                            borderRadius: '4px',
                            backgroundColor: '#FFF',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px #AAA',
                        }}
                    >
                        <div
                            style={{
                                height: '16px',
                                width: '5px',
                                backgroundColor: isDragged ? '#C13540' : '#CCC',
                            }}
                        />
                    </div>
                )}
            />
            <output className="mt-[30px] text-2xl font-bold">{minting.mintAmount[0]}</output>
        </div>
    )
}
