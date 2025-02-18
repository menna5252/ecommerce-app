import fixed_1 from '../../src/assets/fixed-1.jpeg';
import fixed_2 from '../../src/assets/fixed-2.png';
import slider_1 from '../../src/assets/slider-1.jpeg';
import slider_2 from '../../src/assets/slider-2.jpeg';
import Slider from "react-slick";


export default function MainSlider() {


    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
}


return (
    <>
        <div className="w-10/12 grid grid-cols-12 mx-auto">
            <div className="col-span-12 sm:col-span-7">
                <Slider {...settings}>
                    <img className="object-cover object-center h-[300px]" src={slider_1} alt="redVeleit" />
                    <img className="object-cover object-center h-[300px]" src={slider_2} alt="cookies" />
                </Slider>
            </div>
            <div className="col-span-12 sm:col-span-5">
                <img className="object-cover object-center w-full h-[150px]" src={fixed_1} alt="food" />
                <img className="object-cover object-center w-full h-[150px]" src={fixed_2} alt="food" />
            </div>
        </div>


    </>
)
}