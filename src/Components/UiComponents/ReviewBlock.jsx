function ReviewBlock({ comment, rating, name, profileImg }) {
  return (
    <div className="flex flex-row gap-3 w-full m-2 ">
      <img
        src={profileImg}
        className="size-12 rounded-full object-cover object-center flex-shrink-0 flex-initial"
        alt=""
      />
      <div className="flex flex-col gap-2 w-full flex-1">
        <div className="flex flex-row gap-2 items-center">
          <h3 className="font-medium">{name}</h3>
          <p className="text-black/50 text-xs">{rating}/5 ⭐</p>
        </div>
        {comment && <p className="text-sm">{comment} </p>}
      </div>
    </div>
  );
}

export default ReviewBlock;
