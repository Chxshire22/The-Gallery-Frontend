import { useNavigate } from "react-router-dom";

//TODO: MAP PROFILE AND LISTING UIDs FOR ONCLICKS
export default function MediumListingPreviewCard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full flex flex-col listing-card-preview box-border border-2 border-black shadow-[4px_4px_0px_0px_#1a202c] rounded-lg">
        <div className="h-8 border-b-2 border-black flex flex-row rounded-t-lg items-center">
          <img
            onClick={() => navigate("/profile")}
            className="w-8 rounded-full flex-initial cursor-pointer"
            src="https://pbs.twimg.com/profile_images/1009990947533348864/Smwp1Cia_400x400.jpg"
          ></img>
          <h2
            onClick={() => navigate("/profile")}
            className="font-bold ml-2 flex-1 cursor-pointer"
          >
            Reflem
          </h2>
        </div>
        <div className="flex flex-row w-full gap-2">
          <img
            className="w-40 aspect-[4/5] object-cover object-center border-black border-t-2 border-r-2 rounded-br-lg border-b-2 flex-shrink-0"
            src="https://acrotokyo.itembox.design/product/005/000000000595/000000000595-01-l.jpg?t=20240205132947"
            alt=""
          />
          <div className="flex flex-col p-4">
            <h3 className="font-bold">Description</h3>
            <p className="font-medium text-xs text-black/80">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint,
              inventore!
            </p>
          </div>
        </div>
        <div className="rounded-b-lg flex flex-row items-center h-full">
          <p className="font-bold flex-1 text-sm ml-1 align-middle ">
            Kuromi Hoodie
          </p>
          <div className="bg-black h-full ">
            <p className="text-white font-bold flex-initial align-middle mx-1">
              $230
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
