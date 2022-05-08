import React from 'react'

export default function Footer() {
    return (
        <div className="fixed inset-x-0 bottom-0 bg-primary w-full h-24 text-white">
            {/* Image goes here */}
            <div className="px-12 py-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h5 className="uppercase text-white/40 text-xs font-semibold">Connected To</h5>
                        <p>0x10BaF39D5AeDD454B74B3FD910F6a32785D2F83f</p>
                    </div>
                    <div className="flex items-center divide-x divide-white/20">
                        <div className="pr-10">
                            <span className="uppercase text-white/40 text-xs font-semibold">Price</span>
                            <p className="font-medium">1.0 ETH</p>
                        </div>
                        <div className="px-10">
                            <span className="uppercase text-white/40 text-xs font-semibold">Amount</span>
                            <p className="font-medium">1x</p>
                        </div>
                        <div className="px-10">
                            <span className="uppercase text-white/40 text-xs font-semibold">Total</span>
                            <p className="font-medium">1.0 ETH</p>
                        </div>
                        <button className="py-3 px-10 rounded-sm font-bold text-lg uppercase bg-white text-primary">Mint</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
