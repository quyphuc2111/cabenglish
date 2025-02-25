"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import LessonItem from "@/components/lesson/lesson-item";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const UnitData = [
  {
    title: "Unit 1: Introduction",
    content: "Unit 1: Introduction to the shop and its environment.",
    image: "/lesson/1.png",
    link: "/unit1",
    point: "100/400",
    rate: 25,
    lessonInfo: {
      part: [
        {
          type: "video",
          score: "100"
        },
        {
          type: "normal",
          score: "100"
        }
      ]
    }
  },
  {
    title: "Unit 1: Introduction",
    content: "Unit 1: Introduction to the shop and its environment.",
    image: "/lesson/3.png",
    link: "/unit1",
    point: "0/500",
    rate: 0,
    lessonInfo: {
      part: [
        {
          type: "video",
          score: "100"
        },
        {
          type: "normal",
          score: "100"
        }
      ]
    }
  },
  {
    title: "Unit 1: Introduction",
    content: "Unit 1: Introduction to the shop and its environment.",
    image: "/lesson/2.png",
    link: "/unit1",
    point: "0/400",
    rate: 0,
    lessonInfo: {
      part: [
        {
          type: "video",
          score: "100"
        },
        {
          type: "normal",
          score: "100"
        }
      ]
    }
  },
  {
    title: "Unit 1: Introduction",
    content: "Unit 1: Introduction to the shop and its environment.",
    image: "/lesson/5.png",
    link: "/unit1",
    point: "0/600",
    rate: 0,
    lessonInfo: {
      part: [
        {
          type: "video",
          score: "100"
        },
        {
          type: "normal",
          score: "100"
        }
      ]
    }
  },
  {
    title: "Unit 1: Introduction",
    content: "Unit 1: Introduction to the shop and its environment.",
    image: "/lesson/11.png",
    link: "/unit1",
    point: null,
    rate: 0,
    lessonInfo: {
      part: [
        {
          type: "video",
          score: "100"
        },
        {
          type: "normal",
          score: "100"
        }
      ]
    }
  }
];

function UnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lessonParams = searchParams.get("lesson");
  const [isSliding, setIsSliding] = useState(false);
  const [initialSliding, setInitialSliding] = useState(false);

  console.log(lessonParams);

  const handleLessonClick = () => {
    if (!lessonParams) {
      setIsSliding(true);
    } else {
      router.push("/lop-hoc");
    }
  };

  const handleBackClick = () => {

    if(lessonParams) { 
      router.push("/lop-hoc")
    }
    
    if (!isSliding && !lessonParams) {
      router.push("/main/khoa-hoc/tieng-anh-lop-1");
    } else {
      setIsSliding(false);
    }
  };

  return (
    <div className="bg-[url('/player_background.png')] w-screen h-screen bg-repeat bg-[length:560px_560px]">
      <div className="px-2 md:px-0 md:container pt-6 pb-1">
        <div className="cursor-pointer w-fit" onClick={handleBackClick}>
          <Image src="/backic.png" width={64} height={64} alt="backic" />
        </div>
        <div
          className={`shadow-md  ${
            isSliding ? "p-0" : "py-5"
          } rounded-2xl bg-[#f5fcff] lg:w-5/6 mx-auto h-[800px] relative overflow-hidden`}
        >
          <div
            className={`w-full h-full ${
              isSliding ? "animate-slideLeft" : "animate-slideRight px-3"
            }`}
          >
            {!lessonParams && (
              <h2 className="text-2xl font-semibold text-zinc-700 mb-3 lg:mb-12 ml-7">
                Unit 9 : In the shop
              </h2>
            )}

            {UnitData.map((item, index) => {
              return (
                <Fragment key={index}>
                  <LessonItem
                    title={item.title}
                    image={item.image}
                    point={item.point}
                    rate={item.rate}
                    lessonInfo={item.lessonInfo}
                    onClick={handleLessonClick}
                    params={lessonParams}
                  />
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnitPage;
