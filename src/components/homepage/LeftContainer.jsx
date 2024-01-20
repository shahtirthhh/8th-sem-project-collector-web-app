import React, { useState } from "react";
// import img1 from "../static/slideshow/img1.png";
// import img2 from "../static/slideshow/img2.png";
// import img3 from "../static/slideshow/img3.png";
import img4 from "../static/slideshow/img4.png";
// import img6 from "../static/slideshow/img6.jpg";
// import img7 from "../static/slideshow/img7.jpg";
// const images = [
//   {
//     src: img1,
//     alt: "Image 1",
//   },
//   {
//     src: img2,
//     alt: "Image 2",
//   },
//   {
//     src: img3,
//     alt: "Image 3",
//   },
//   {
//     src: img4,
//     alt: "Image 4",
//   },
//   {
//     src: img6,
//     alt: "Image 6",
//   },
//   {
//     src: img7,
//     alt: "Image 7",
//   },
// ];

export default function LeftContainer() {
  // const [current, setCurrent] = useState(0);

  // const previous = () => {
  //   setCurrent(current === 0 ? images.length - 1 : current - 1);
  // };

  // const next = () => {
  //   setCurrent(current === images.length - 1 ? 0 : current + 1);
  // };

  return (
    <img
      className="w-full h-full object-cover rounded-3xl"
      src={img4}
      alt="background image"
    />

    // <div className="w-full h-full">
    //   <img className="object-cover rounded-3xl" src={img4} alt="image" />
    // </div>
  );
}
/* <div className="absolute inset-0 flex items-center justify-center"></div>

        <button
          className="absolute text-2xl left-0 top-1/2 p-4 transition-transform hover:scale-125 text-white hover:text-amber-500 cursor-pointer"
          onClick={previous}
        >
          ⏮
        </button>
        <button
          className="absolute text-2xl right-0 top-1/2 p-4 transition-transform hover:scale-125 text-white hover:text-amber-500 cursor-pointer"
          onClick={next}
        >
          ⏭
        </button>
      </div>
      <div className="absolute bottom-4 w-[10rem] rounded-full p-1 bg-black/70  text-center text-white">
        {images.map((image, index) => (
          <button
            key={index}
            className={`${
              index === current ? "bg-white" : "bg-black/30"
            } w-3 h-3 rounded-full mx-1 transition-all duration-300`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div> */
