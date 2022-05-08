import React, { useState } from 'react'
import toyMachineImg from '../assets/images/toy-machine.png'
import { Range } from 'react-range'
import Marks from './CustomInput/Marks'

export default function Minting() {
    const [mintAmount, setMintAmount] = useState([0])

    return (
        <div className="flex justify-between items-center">
            <div>
                <div className="text-lg font-medium uppercase">
                    <span className="text-primary">7639</span>
                    <span className="text-black/60"> / 8888 Zukiblowon Remaining (Phase 1)</span>
                </div>
                <hr className="my-4" />
                <h1 className="text-5xl font-bold uppercase leading-tight">
                    How Many Zukiblowon <br /> For You?
                    <span className="text-black/10"> //</span>
                </h1>
                <div className="mt-16">
                    <Marks />
                </div>
            </div>
            <img className="w-[45%] h-[45%]" src={toyMachineImg} alt="" />
        </div>
    )
}
