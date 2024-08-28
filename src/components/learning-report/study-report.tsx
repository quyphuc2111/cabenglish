"use client"
import React from "react";
import Image from "next/image";
import { CalendarComponent } from "../ui/calendar";
import { useDialog } from "@/hooks/useDialog";

const ClassData = [
  {
    title: "Lớp 1"
  },
  {
    title: "Lớp 2"
  },
  {
    title: "Lớp 3"
  },
  {
    title: "Lớp 4"
  },
  {
    title: "Lớp 5",
    active: true
  }
];

const HistoryData = [
  {
    title: "Tiến độ học",
    content: "1%",
    icon: "https://static.edupia.vn/uploads/v3/assets/images/learning-report/chart.png"
  },
  {
    title: "Điểm trung bình",
    content: "3.33",
    icon: "https://static.edupia.vn/uploads/v3/assets/images/learning-report/chart-2.png"
  },
  {
    title: "Số xu tích lũy",
    content: "128",
    icon: "https://static.edupia.vn/uploads/v3/assets/images/learning-report/coin.png"
  }
];

function StudyReport() {
  const {isOpen, setData, onClose, onOpen} = useDialog()
  const handleSetDialogData = () => {
    isOpen ? onClose() : onOpen()
    setData({index: "1"})
  }
  return (
    <div className="bg-white shadow-course-inset rounded-2xl p-1 md:p-4 lg:grid grid-cols-12 ">
      <div className="col-span-4 flex flex-col md:flex-row md:items-center md:gap-12  md:gap-5">
        <div className="relative w-1/4 lg:w-1/3 cursor-pointer" onClick={handleSetDialogData}>
          <div className="rounded-full">
            <Image
              src="https://static.edupia.vn/images/avata_system/55.png"
              alt="avatar"
              width={168}
              height={168}
            />
          </div>
          <span className="absolute bottom-0 right-0 bg-[#e9f8f9] p-1 rounded-full">
            <Image
              src="https://static.edupia.vn/uploads/v3/assets/images/icons/pencil-line.svg"
              alt="pencil"
              width={16}
              height={16}
            />
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">phongnh</h2>
          <p className="text-sm font-semibold">Lớp 5C187</p>

          <div className="flex items-center gap-2">
            <span>
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/icons/champion.png"
                alt="champion"
                width={20}
                height={18}
              />
            </span>
            <p className="text-sm">Thành viên mới</p>
          </div>
        </div>
      </div>
      <div className="col-span-8 mt-2 lg:mt-0">
        <div className="flex flex-col h-full justify-center">
          <div className="bg-[#e9f8f9] rounded-2xl border grid grid-cols-2 md:grid-cols-5 cursor-pointer">
            {ClassData.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`text-center p-2 font-semibold ${
                    item.active ? "bg-[#13caef] text-white rounded-xl" : ""
                  } `}
                >
                  {item.title}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mt-4 ">
            {HistoryData.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`bg-[#e9f8f9] p-4 rounded-2xl flex flex-col gap-2 border ${(index + 1) % 3 === 0 ? "col-span-2 lg:col-span-1" : ""}`}
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={24}
                    height={25}
                  />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-4xl mt-2 font-semibold">{item.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default StudyReport;
