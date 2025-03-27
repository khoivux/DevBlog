import { Link} from "react-router-dom"
// import Image from "./Image";

const FeaturedPosts = () => {
  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-4">
        {/* First */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 shadow-custom rounded-[40px] p-3 bg-white">
            {/* image */}
            <img src="featured1.jpeg" className="rounded-[40px] object-cover border-2 border-gray-200" />
            
            {/* details */}
            <div className='flex items-center gap-4 px-4'>
            <Link className='text-white small-text rounded-[40px] p-3 py-1 bg-[#44D6FF] hover:scale-105'>Thiết kế Web</Link>
                <span className='text-gray-500'>2 ngày trước</span>
            </div>
            
            {/* title */}
            <Link to='/test' className='px-4 pb-1 text-xl lg:text-2xl font-semibold lg:font-bold'>
            Cộng đồng chia sẻ và thảo luận kiến thức lậ
            </Link>
        </div>

        {/* Others */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Second */}
            <div className='h-1/3 flex justify-between gap-4 shadow-custom rounded-[40px] p-3 bg-white'>
                <img src="featured2.jpeg"className="rounded-[40px] object-cover w-1/3 aspect-video border-2 border-gray-200"/>
                {/* details and title */}
                <div className='w-2/3'>
                    {/* details */}
                    <div className='flex items-center gap-4 text-xl lg:text-base mb-4'>
                        <Link className='text-white small-text hover:scale-105 rounded-[40px] p-3 py-1 bg-[#44D6FF]'>Thiết kế Web</Link>
                        <span className='text-gray-500 text-sm'>2 ngày trước</span>
                    </div>
                    {/* title */}
                    <Link className="text-sm sm:text-base md:text-xl lg:text-lg xl:text-xl font-medium">
                        Thiết kế giao diện Web
                    </Link>
                </div>
            </div>
            {/* Third */}
            <div className='h-1/3 flex justify-between gap-4 shadow-custom rounded-[40px] p-3 bg-white'>
                <img src="featured3.jpeg"className="rounded-[40px] object-cover w-1/3 aspect-video border-2 border-gray-200"/>
                {/* <Image src="featured3.jpeg" className="rounded-[40px] object-cover w-1/3 aspect-video"/> */}
                {/* details and title */}
                <div className='w-2/3'>
                    {/* details */}
                    <div className='flex items-center gap-4 text-sm lg:text-base mb-4'>
                        <Link className='text-white small-text lg:small-text rounded-[40px] p-3 py-1 bg-[#44D6FF] hover:scale-105'>Thiết kế Web</Link>
                        <span className='text-gray-500 text-sm'>2 ngày trước</span>
                    </div>
                    {/* title */}
                    <Link className="text-sm sm:text-base md:text-xl lg:text-lg xl:text-xl font-medium"> Thiết kế giao diện Web</Link>
                </div>
            </div>
            {/* Fourth */}
            <div className='h-1/3 flex justify-between gap-4 shadow-custom rounded-[40px] p-3 bg-white'>
                <img src="featured4.jpeg"className="rounded-[40px] object-cover w-1/3 aspect-video border-2 border-gray-200"/>
                {/* details and title */}
                <div className='w-2/3'>
                    {/* details */}
                    <div className='flex items-center gap-4 text-sm lg:text-base mb-4'>
                    <Link className='text-white small-text lg:small-text rounded-[40px] p-3 py-1 bg-[#44D6FF] hover:scale-105'>Thiết kế Web</Link>
                        <span className='text-gray-500 text-sm'>2 ngày trước</span>
                    </div>
                    {/* title */}
                    <Link className="text-sm sm:text-base md:text-xl lg:text-lg xl:text-xl font-medium"> 
                        Các thuộc tính trong lập trình hướng đối tượng
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FeaturedPosts