import React from "react";

import { CalendarRange, GraduationCap, Sparkle, User2 } from "lucide-react";

const StatisticalData = [
  {
    icon: <CalendarRange className="w-10 h-10" />,
    text: "10+",
    desc: "Năm kinh nghiệm"
  },
  {
    icon: <Sparkle className="w-10 h-10" />,
    text: "98%",
    desc: "Giáo viên hài lòng"
  },
  {
    icon: <GraduationCap className="w-10 h-10" />,
    text: "90K+",
    desc: "Giáo viên sử dụng"
  },
  {
    icon: <User2 className="w-10 h-10" />,
    text: "100+",
    desc: "Nhân sự tận tâm"
  }
];

function StatisticalSection() {
  return (
    <div className="container flex flex-col md:flex-row gap-5 justify-between my-10">
      {StatisticalData &&
        StatisticalData.map((item, index) => {
          return (
            <div
              key={index}
              className="border border-gray-200 shadow-md px-12 py-10 rounded-3xl hover:bg-green-500 hover:cursor-pointer hover:text-white"
            >
              <div className="flex gap-8 justify-between">
                {item.icon}
                <div className="flex flex-col justify-end items-end gap-2">
                  <p className="font-bold text-2xl">{item.text}</p>
                  <p>{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default StatisticalSection;
