import { appleImg, bagImg, searchImg } from '../utils';
import { navLists } from '../constants';

const Navbar = () => {
  return (
    /*左邊Apple圖標*/ 
    <header className="w-full py-5 sm:px-10 px-5 flex 
    justify-between items-center">
      <nav className='flex w-full screen-max-width'>
        <img src={appleImg} alt="Apple" width={14} height={18} />
      </nav>
    {/*中間的導航項目*/}
      <div className="flex flex-1 justify-center items-center">
        {navLists.map((nav) =>(
            <div key={nav} className='px-10 text-sm cursor-pointer 
            text-gray hover:text-white transition-all '>
              {nav}
            </div>
          ))}
      </div>
    {/*右邊的搜尋和購物袋圖標*/}
      <div className='flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1'>
        <img src={searchImg} alt="search" width={18} height={18} />
        <img src={bagImg} alt="bag" width={18} height={18} />
      </div>
    </header>
  )
}

export default Navbar