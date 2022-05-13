import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toyMachineImg from '../assets/images/toy-machine.png'
import Marks from './CustomInput/Marks'

import { connect } from '../redux/blockchain/blockchainActions'
import { fetchData } from '../redux/data/dataActions'

export default function Minting() {
    const dispatch = useDispatch()
    const blockchain = useSelector((state) => state.blockchain)
    const data = useSelector((state) => state.data)

    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: '',
        SCAN_LINK: '',
        NETWORK: {
            NAME: '',
            SYMBOL: '',
            ID: 0,
        },
        NFT_NAME: '',
        SYMBOL: '',
        MAX_SUPPLY: 0,
        GAS_LIMIT: 0,
    })

    const getConfig = async () => {
        const configResponse = await fetch('/config/config.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        const config = await configResponse.json()
        SET_CONFIG(config)
    }

    const getData = () => {
        if (blockchain.account !== '' && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account))
        }
    }

    const isWalletConnected = () => {
        return blockchain.account
    }

    const isContractReady = () => {
        return blockchain.smartContract
    }

    const isLoading = () => {
        return data.loading
    }

    useEffect(() => {
        getConfig()
    }, [])

    useEffect(() => {
        getData()
    }, [blockchain.account])

    return (
        <div className="flex justify-between items-center">
            <div className="w-[55%]">
                <div className="text-lg font-medium uppercase">
                    <span className="text-primary">{isWalletConnected() && isContractReady() && !isLoading() ? data.totalSupply : 'XXX'}</span>
                    <span className="text-black/60"> / {CONFIG.MAX_SUPPLY} Zukiblowon Remaining</span>
                </div>
                <hr className="my-4" />
                <>
                    <h1 className="text-5xl font-bold uppercase leading-tight">
                        {isWalletConnected() && isContractReady() && !isLoading() ? 'Get Your Zukiblowon' : 'Connect To Ethereum Network'}
                        <span className="text-black/10"> //</span>
                    </h1>
                    <div className="mt-6">
                        {isWalletConnected() && isContractReady() && !isLoading() ? (
                            <Marks />
                        ) : (
                            <>
                                {isLoading() ? (
                                    <button className="px-12 py-4 rounded-md bg-primary hover:bg-red-800 transition-all duration-300 ease-in-out text-white font-bold text-2xl">Loading ...</button>
                                ) : (
                                    <button
                                        className="px-12 py-4 rounded-md bg-primary hover:bg-red-800 transition-all duration-300 ease-in-out text-white font-bold text-2xl"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            dispatch(connect())
                                            getData()
                                        }}
                                    >
                                        Connect Wallet
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </>
            </div>
            <img className="w-[45%] h-[45%]" src={toyMachineImg} alt="" />
        </div>
    )
}
