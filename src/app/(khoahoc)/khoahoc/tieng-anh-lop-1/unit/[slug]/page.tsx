"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import LessonItem from "@/components/lesson/lesson-item";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ClassRoomBackground from "@/components/background/backgroundClass";
import SectionItem from "@/components/section/section-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tạo interface cho dữ liệu
interface SectionContent {
  sc_id: number;
  order: number;
  icon_url: string;
  iframe_url: string;
  description: string;
  title: string;
}

interface Section {
  section_id: number;
  section_name: string;
  estimate_time: number;
  icon_url: string;
  section_contents: SectionContent[];
  progress: number;
  is_locked: boolean;
}

interface LessonData {
  lesson_id: number;
  lesson_name: string;
  imageurl: string;
  numliked: number;
  order: number;
  sections: Section[];
}

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

// const mockLessonData = [
//   {
//     lesson_id: 1,
//     lesson_name: "Unit 1: Từ vựng cơ bản",
//     imageurl: "/lessons/unit1.png",
//     numliked: 245,
//     order: 1,
//     sections: [
//       {
//         section_id: 1,
//         section_name: "Phần 1: Giới thiệu",
//         order: 1,
//         section_contents: [
//           {
//             sc_id: 1,
//             order: 1,
//             icon_url: "",
//             iframe_url: "",
//             description: "",
//             title: "Title"
//           },
//           {
//             sc_id: 2,
//             order: 2,
//             icon_url: "",
//             iframe_url: "",
//             description: "",
//             title: "Title"
//           }
//         ]
//       },
//       {
//         section_id: 2,
//         section_name: "Phần 2: Từ vựng chủ đề gia đình",
//         order: 2,
//         section_contents: [
//           {
//             sc_id: 1,
//             content_type: "audio",
//             content: "https://example.com/audio1.mp3",
//             order: 1
//           },
//           {
//             sc_id: 2,
//             content_type: "exercise",
//             content: "Bài tập điền từ vào chỗ trống",
//             order: 2
//           }
//         ]
//       }
//     ]
//   }
//   // {
//   //   lesson_id: 2,
//   //   lesson_name: "Unit 2: Ngữ pháp cơ bản",
//   //   imageurl: "/lessons/unit2.png",
//   //   numliked: 189,
//   //   order: 2,
//   //   sections: [
//   //     {
//   //       section_id: 3,
//   //       section_name: "Phần 1: Thì hiện tại đơn",
//   //       description: "Cấu trúc và cách sử dụng thì hiện tại đơn",
//   //       order: 1,
//   //       section_contents: [
//   //         {
//   //           sc_id: 5,
//   //           content_type: "video",
//   //           content: "https://example.com/video2.mp4",
//   //           order: 1,
//   //           duration: 450
//   //         },
//   //         {
//   //           sc_id: 6,
//   //           content_type: "practice",
//   //           content: "Bài tập thực hành thì hiện tại đơn",
//   //           order: 2,
//   //           duration: 1200
//   //         }
//   //       ]
//   //     },
//   //     {
//   //       section_id: 4,
//   //       section_name: "Phần 2: Thì hiện tại tiếp diễn",
//   //       description: "Học về thì hiện tại tiếp diễn",
//   //       order: 2,
//   //       section_contents: [
//   //         {
//   //           sc_id: 7,
//   //           content_type: "presentation",
//   //           content: "https://example.com/slides1.pdf",
//   //           order: 1,
//   //           duration: 600
//   //         },
//   //         {
//   //           sc_id: 8,
//   //           content_type: "quiz",
//   //           content: "Kiểm tra kiến thức về thì hiện tại tiếp diễn",
//   //           order: 2,
//   //           duration: 900
//   //         }
//   //       ]
//   //     }
//   //   ]
//   // }
// ];

const mockLessonData = {
  lesson_id: 1,
  lesson_name: "Unit 1: Từ vựng cơ bản",
  imageurl: "/lessons/unit1.png",
  numliked: 245,
  order: 1,
  sections: [
    {
      section_id: 1,
      section_name: "Intro",
      estimate_time: 10,
      icon_url: "/assets/gif/section1.gif",
      section_contents: [
        {
          sc_id: 1,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url:
            "https://h5p.org/sites/default/files/h5p/content/621/phet.html",
          description:
            " Cùng Pea học Tiếng Anh qua bài giảng thú vị sau đây nhé. Nếu chưa hiểu bài, em có thể xem lại để hiểu rõ hơn nội dung bài học.",
          title: "Title1123"
        },
        {
          sc_id: 2,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url:
            "https://h5p.org/sites/default/files/h5p/content/621/phet.html",
          description:
            " Cùng Pea học Tiếng Anh qua bài giảng thú vị sau đây nhé. Nếu chưa hiểu bài, em có thể xem lại để hiểu rõ hơn nội dung bài học.",
          title: "Title321"
        },
        {
          sc_id: 3,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description:
            " Cùng Pea học Tiếng Anh qua bài giảng thú vị sau đây nhé. Nếu chưa hiểu bài, em có thể xem lại để hiểu rõ hơn nội dung bài học.",
          title: "Title"
        },
        {
          sc_id: 4,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 5,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 6,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        }
      ],
      progress: 50,
      is_locked: false
    },
    {
      section_id: 2,
      section_name: "Presentation",
      estimate_time: 0,
      icon_url: "/assets/gif/section2.gif",
      section_contents: [
        {
          sc_id: 7,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 8,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        }
      ],
      progress: 80,
      is_locked: true
    },
    {
      section_id: 3,
      section_name: "Practice",
      estimate_time: 0,
      icon_url: "/assets/gif/section3.gif",
      section_contents: [
        {
          sc_id: 9,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 10,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        }
      ],
      progress: 80,
      is_locked: true
    },
    {
      section_id: 4,
      section_name: "Production",
      estimate_time: 0,
      icon_url: "/assets/gif/section4.gif",
      section_contents: [
        {
          sc_id: 11,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 12,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        }
      ],
      progress: 80,
      is_locked: true
    },
    {
      section_id: 5,
      section_name: "Wrap up",
      estimate_time: 0,
      icon_url: "/assets/gif/section5.gif",
      section_contents: [
        {
          sc_id: 13,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 14,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 15,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 16,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 17,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 18,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 19,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 20,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 21,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 22,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 23,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        },
        {
          sc_id: 24,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title"
        }
      ],
      progress: 80,
      is_locked: true
    }
  ]
};

const SectionContentView = ({
  content,
  isActive
}: {
  content: SectionContent;
  isActive: boolean;
}) => {
  return (
    <div
      className={`transition-all duration-500 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    >
      {content.iframe_url && (
        <div className="aspect-video rounded-lg overflow-hidden">
          <iframe
            src={content.iframe_url}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}
      <div className="flex items-start gap-7 mt-8">
        <Image src="/ga_con_lesson.png" width={173} height={174} alt="ga-con" />
        {content.description && (
          <p className="bg-[#f5f5f5] p-6 rounded-3xl border relative text-gray-700">
            {content.description}
          </p>
        )}
      </div>
    </div>
  );
};

const TabsContainer = ({
  section,
  isVisible
}: {
  section: Section;
  isVisible: boolean;
}) => {
  const [activeTabId, setActiveTabId] = useState(
    section.section_contents[0]?.sc_id.toString()
  );

  return (
    <Tabs
      value={activeTabId}
      onValueChange={setActiveTabId}
      className={`transition-all duration-500 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <TabsList className="flex gap-2 flex-wrap h-auto p-4 bg-muted">
        {section.section_contents.map((content) => (
          <TabsTrigger
            key={content.sc_id}
            value={content.sc_id.toString()}
            className="flex items-center gap-2 py-5"
          >
            <Image
              src={content.icon_url}
              alt={content.title}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span>{content.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {section.section_contents.map((content) => (
        <TabsContent key={content.sc_id} value={content.sc_id.toString()}>
          <SectionContentView
            content={content}
            isActive={activeTabId === content.sc_id.toString()}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

function UnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lessonParams = searchParams.get("lesson");
  const [animationState, setAnimationState] = useState({
    isSliding: false,
    direction: "right",
    selectedSection: null as number | null
  });

  console.log(lessonParams);

  const handleLessonClick = () => {
    if (!lessonParams) {
      setAnimationState({
        isSliding: true,
        direction: "left",
        selectedSection: null
      });
    } else {
      router.push("/lop-hoc");
    }
  };

  const handleBackClick = () => {
    if (lessonParams) {
      router.push("/lop-hoc");
    }

    if (!animationState.isSliding && !lessonParams) {
      router.push("/main/khoa-hoc/tieng-anh-lop-1");
    } else {
      setAnimationState({
        isSliding: true,
        direction: "right",
        selectedSection: null
      });
    }
  };

  const handleSectionClick = (sectionId: number) => {
    setAnimationState({
      isSliding: true,
      direction: "left",
      selectedSection: sectionId
    });
  };

  return (
    <Fragment>
      <div className="bg-[url('/assets/bg_classroom.png')] w-screen h-screen bg-no-repeat bg-bottom bg-auto">
        <div className="px-2 md:px-0 md:container pt-6 pb-1">
          <div className="cursor-pointer w-fit" onClick={handleBackClick}>
            <Image src="/backic.png" width={64} height={64} alt="backic" />
          </div>
          {/* overflow-hidden */}
          <ScrollArea className="h-[75vh] scrollarea-hide-scrollbar">
            <div
              className={`shadow-md  ${
                animationState.isSliding ? "p-0" : "py-5"
              } rounded-2xl bg-[#f5fcff] lg:w-5/6 mx-auto  relative `}
            >
              <div
                className={`w-full h-full ${
                  animationState.isSliding
                    ? "animate-slideLeft"
                    : "animate-slideRight px-3"
                }`}
              >
                {!lessonParams && !animationState.isSliding && (
                  <h2 className="text-2xl font-semibold text-zinc-700 mb-3 lg:mb-12 ml-7">
                    {mockLessonData?.lesson_name}
                  </h2>
                )}
                {/* {mockLessonData.sections &&
                  mockLessonData?.sections.map((section) => (
                    <SectionItem
                      key={section.section_id}
                      sectionData={section}
                      onClick={() => handleSectionClick(section.section_id)}
                      selectedSection={selectedSection} 
                    />
                  ))} */}

                <div className="flex">
                  <div className="w-full">
                    <div
                      className={`transition-all duration-500 ${
                        animationState.selectedSection
                          ? "w-0 opacity-0 -translate-x-full"
                          : "w-full opacity-100 translate-x-0"
                      }`}
                    >
                      {mockLessonData.sections &&
                        mockLessonData?.sections.map((section) => (
                          <SectionItem
                            key={section.section_id}
                            sectionData={section}
                            onClick={() =>
                              handleSectionClick(section.section_id)
                            }
                          />
                        ))}
                    </div>
                  </div>
                  <div className=" relative flex-1">
                    {animationState.selectedSection && (
                      <div
                        className={`transition-all duration-500 transform absolute top-0 left-0  w-[1150px]
                     ${
                       animationState.isSliding
                         ? "translate-x-full opacity-100"
                         : "translate-x-0 opacity-0"
                     }
                   `}
                      >
                        <TabsContainer
                          section={
                            mockLessonData.sections.find(
                              (s) =>
                                s.section_id === animationState.selectedSection
                            ) || ({ section_contents: [] } as Section)
                          }
                          isVisible={animationState.selectedSection !== null}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Fragment>
  );
}

export default UnitPage;
