export default function Record() {
    return (
        <div className="MobileWheely w-[390px] h-[538px] bg-gray-100 flex-col justify-start items-center gap-[180px] inline-flex">
            <div className="Frame2 flex-col justify-start items-center gap-[25px] flex">
                <div className="RecordButton w-[81px] h-[81px] relative">
                <div className="Ellipse1 w-[81px] h-[81px] left-0 top-0 absolute bg-zinc-300 rounded-full" />
                <div className="Ellipse2 w-[51.03px] h-[51.03px] left-[14.58px] top-[14.58px] absolute rounded-full border border-black" />
                <div className="Ellipse3 w-[43.74px] h-[43.74px] left-[18px] top-[18px] absolute bg-red-600 rounded-full" />
                </div>
                <div className="VoiceControl w-[138px] h-7 text-center text-black text-xl font-bold leading-none">Voice Control</div>
            </div>
            <div className="Frame3 w-[391px] px-7 py-3 bg-stone-300 rounded-tl-[29px] rounded-tr-[29px] border-l border-r border-t border-black flex-col justify-center items-center gap-3 flex">
                <div className="SavedLocations w-[171px] h-5 text-black text-xl font-bold leading-none">Saved Locations</div>
                <img className="Image1 w-[335px] h-[118px] blur-[1px]" src="https://via.placeholder.com/335x118" />
                <div className="Engineering w-[185px] h-[21px] text-center text-black text-lg font-semibold leading-none">Engineering</div>
                <div className="PaginationLines w-32 h-0.5 relative">
                <div className="Rectangle1442 w-[26px] h-0.5 left-0 top-0 absolute bg-slate-600 rounded" />
                <div className="Rectangle1443 w-[26px] h-0.5 left-[34px] top-0 absolute bg-gray-100 rounded" />
                <div className="Rectangle1444 w-[26px] h-0.5 left-[68px] top-0 absolute bg-gray-100 rounded" />
                <div className="Rectangle1445 w-[26px] h-0.5 left-[102px] top-0 absolute bg-gray-100 rounded" />
                </div>
            </div>
        </div>
    );
}