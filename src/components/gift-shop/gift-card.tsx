import Image from "next/image";
import Link from "next/link";
import React from "react";
import CoinHistory from "../modal/coin-history";

function GiftCard({ title, content, footer, backgroundImage, image, ...props }: any) {
  return (
    <div
      {...props}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex flex-col gap-3">
        <h5 className="font-semibold text-2xl uppercase">{title}</h5>
        <span className="flex gap-2">
          <Image src={content.image} alt="icon" width={28} height={28} />
          <p className="text-4xl font-semibold">{content.value}</p>
        </span>
      </div>
      {
        !footer.link ? (
          <CoinHistory>
          <Link href={""} className="flex gap-2">
            <Image src={footer.image} alt="icon" width={24} height={24} />
            <p className="font-semibold text-md">{footer.text}</p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 4.5L15.5 11.5L8.5 18.5"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </Link>
    
          </CoinHistory>
        ) : (
          <Link href={footer.link.toString()} className="flex gap-2">
          <Image src={footer.image} alt="icon" width={24} height={24} />
          <p className="font-semibold text-md">{footer.text}</p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 4.5L15.5 11.5L8.5 18.5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Link>
        )
      }
     
     
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <Image src={image} alt="icon-image" width={86} height={86} />
      </div>
    </div>
  );
}

export default GiftCard;
