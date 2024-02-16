function Carousel(props) {
  let { imgArr } = props;

  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div className="w-[20rem] lg:w-[30rem] aspect-[4/5]  carousel rounded-box">
        {imgArr.map((img) => (
          <div key={img} className="carousel-item w-full bg-slate-200/50">
            <img
              src={img}
              className="w-full object-cover"
              alt="Tailwind CSS Carousel component"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
