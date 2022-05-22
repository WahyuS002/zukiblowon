import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useModal from '../hooks/useModal'
import { fetchData } from '../redux/data/dataActions'

import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'

import Web3 from 'web3'

import loadingVideo from '../assets/videos/loading.mp4'
import mintedVideo from '../assets/videos/minted.mp4'

const web3 = new Web3()

export default function Footer() {
    const dispatch = useDispatch()
    const blockchain = useSelector((state) => state.blockchain)
    const data = useSelector((state) => state.data)
    const minting = useSelector((state) => state.minting)

    const { mintedModalOpen, closeMintedModal, openMintedModal } = useModal()

    const [claimingNft, setClaimingNft] = useState(false)

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

    const claimNFTs = () => {
        let cost = data.cost
        let gasLimit = CONFIG.GAS_LIMIT
        let totalCostWei = String(cost * minting.mintAmount[0])

        if (data.paused) {
            toast.info('Minting will open soon.')
        } else {
            console.log('Current Wallet Supply : ', data.currentWalletSupply)
            if (parseInt(minting.mintAmount[0]) + parseInt(data.totalSupply) > parseInt(data.maxSupply)) {
                toast.warning('You have exceeded the max limit of minting.')
            } else {
                if (data.isFreeMintOpen) {
                    return freeMintTokens(gasLimit)
                } else {
                    return mintTokens(gasLimit, totalCostWei)
                }
            }
        }
    }

    const freeMintTokens = (gasLimit) => {
        if (parseInt(data.currentWalletSupply) + minting.mintAmount[0] > parseInt(data.maxFreeMintAmountPerAddr)) {
            toast.warning('Exceeds max free mint per wallet!')
        } else if (parseInt(data.totalSupply) + minting.mintAmount[0] > parseInt(data.maxFreeMintSupply)) {
            toast.warning('Exceeds max free mint supply!')
        } else {
            toast.info(`Minting your free ${CONFIG.NFT_NAME}...`)
            setClaimingNft(true)
            return blockchain.smartContract.methods
                .freeMint(minting.mintAmount[0])
                .send({
                    gasLimit: gasLimit,
                    to: CONFIG.CONTRACT_ADDRESS,
                    from: blockchain.account,
                })
                .once('error', () => {
                    toast.error('Sorry, something went wrong please try again later.')
                    setClaimingNft(false)
                })
                .then(() => {
                    toast.success(`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`)
                    setClaimingNft(false)
                    dispatch(fetchData(blockchain.account))
                    openMintedModal()
                })
        }
    }

    const mintTokens = (gasLimit, totalCostWei) => {
        if (minting.mintAmount[0] > parseInt(data.maxMintAmountPerTx)) {
            toast.warning('Exceeds max mint amount per tx!')
        } else if (parseInt(data.totalSupply) + minting.mintAmount[0] > parseInt(data.maxSupply)) {
            toast.warning('Max supply exceeded!')
        } else if (parseInt(data.currentWalletSupply) + minting.mintAmount[0] > 20) {
            toast.warning('Exceeds max mint per wallet!')
        } else {
            toast.info(`Minting your ${CONFIG.NFT_NAME}...`)
            setClaimingNft(true)
            return blockchain.smartContract.methods
                .mint(minting.mintAmount[0])
                .send({
                    gasLimit: gasLimit,
                    to: CONFIG.CONTRACT_ADDRESS,
                    from: blockchain.account,
                    value: totalCostWei,
                })
                .once('error', (err) => {
                    console.log(err)
                    toast.error('Sorry, something went wrong please try again later.')
                    setClaimingNft(false)
                })
                .then((receipt) => {
                    console.log(receipt)
                    toast.success(`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`)
                    setClaimingNft(false)
                    dispatch(fetchData(blockchain.account))
                    openMintedModal()
                })
        }
    }

    useEffect(() => {
        getConfig()
    }, [])

    useEffect(() => {
        getData()
    }, [blockchain.account])

    return (
        <>
            <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
                {mintedModalOpen && (
                    <motion.div
                        className="h-screen flex justify-center items-center fixed z-30 bg-black"
                        initial={{ scale: 0 }}
                        animate={{ rotate: 360, scale: [0, 1.1, 1] }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 25,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                            transition: {
                                duration: 0.15,
                                ease: 'easeOut',
                            },
                        }}
                    >
                        <div className="px-4 md:px-0 md:w-1/3">
                            <h4 className="text-white md:text-3xl text-center">
                                Yeay!!! Already Minted. <br /> Check your NFT on Opensea!
                            </h4>
                            <div className="rounded-3xl overflow-hidden my-5">
                                <video autoPlay muted loop>
                                    <source src={mintedVideo} type="video/mp4" />
                                </video>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    className="px-12 py-3 bg-primary hover:bg-red-700 transition-all duration-300 ease-in-out text-white uppercase font-semibold rounded-md"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        closeMintedModal()
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
                {claimingNft && (
                    <motion.div
                        className="fixed bg-black backdrop-filter backdrop-blur-xl h-screen w-full z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, type: 'tween' }}
                    >
                        <video className="absolute top-1/2 md:block md:top-0" autoPlay muted loop>
                            <source src={loadingVideo} type="video/mp4" />
                        </video>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
                {blockchain.account && blockchain.smartContract && !data.loading ? (
                    <motion.div
                        className="fixed inset-x-0 bottom-0 bg-primary w-full text-white z-10"
                        initial={{ y: 300, opacity: 0 }}
                        animate={{ y: 1, opacity: 1 }}
                        exit={{ y: 300, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="px-12 py-5">
                            <div className="flex justify-center md:justify-between items-center">
                                <div className="hidden md:block">
                                    <h5 className="uppercase text-white/40 text-xs font-semibold">Connected To</h5>
                                    <p>{blockchain.account}</p>
                                </div>
                                <div className="flex items-center divide-x divide-white/20">
                                    <div className="pr-10">
                                        <span className="uppercase text-white/40 text-xs font-semibold">Price</span>
                                        <p className="font-medium">{data.isFreeMintOpen ? 'Free' : web3.utils.fromWei(web3.utils.toBN(data.cost), 'ether') * minting.mintAmount[0]}</p>
                                    </div>
                                    <div className="px-10">
                                        <span className="uppercase text-white/40 text-xs font-semibold">Amount</span>
                                        <p className="font-medium">{minting.mintAmount[0]}x</p>
                                    </div>
                                    <div className="pl-10 md:px-10">
                                        <span className="uppercase text-white/40 text-xs font-semibold">Total</span>
                                        <p className="font-medium">{data.isFreeMintOpen ? 'Free' : web3.utils.fromWei(web3.utils.toBN(data.cost), 'ether') * minting.mintAmount[0]}</p>
                                    </div>
                                    <button
                                        className="py-3 px-10 rounded-sm font-bold text-lg uppercase bg-white text-primary hidden md:block"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            claimNFTs()
                                            getData()
                                        }}
                                    >
                                        Mint
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="px-12 pb-3 block md:hidden">
                            <div className="flex justify-center">
                                <button
                                    className="py-3 px-10 rounded-sm font-bold text-lg uppercase bg-white text-primary"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        claimNFTs()
                                        getData()
                                    }}
                                >
                                    Mint
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    )
}
