import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProgressChartProps {
  data: {
    name: string;
    progress: number;
    lesson?: {
      title: string;
      progress: number;
    }[];
  }[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  const [hiddenBars, setHiddenBars] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số lượng cột hiển thị trên mỗi trang

  // Xử lý dữ liệu cho biểu đồ
  const chartData = data[0]?.lesson
    ? data[0].lesson.map((item) => ({
        name: item.title,
        progress: item.progress,
        fill: item.progress >= 100 ? "#3EC474" : "#4079CE",
        type: item.progress >= 100 ? "completed" : "progress"
      }))
    : data.map((item) => ({
        name: item.name,
        progress: item.progress,
        fill: item.progress >= 100 ? "#3EC474" : "#4079CE",
        type: item.progress >= 100 ? "completed" : "progress"
      }));

  const handleLegendClick = (type: string) => {
    setHiddenBars((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      }
      return [...prev, type];
    });
  };

  const filteredData = chartData.filter(
    (item) => !hiddenBars.includes(item.type)
  );

  // Tính toán dữ liệu cho trang hiện tại
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-lg">
      <div className="flex flex-wrap gap-4 mb-6 justify-end">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 cursor-pointer relative transition-all duration-300 
            ${hiddenBars.includes("completed") ? "opacity-50" : "opacity-100"}`}
          onClick={() => handleLegendClick("completed")}
        >
          <span className="text-sm text-gray-600 relative flex items-center gap-2">
            <div className="w-4 h-4 bg-[#3EC474] rounded transition-transform duration-300 hover:scale-110" />
            {hiddenBars.includes("completed") && (
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-400" />
            )}
            Đã hoàn thành
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 cursor-pointer relative transition-all duration-300
            ${hiddenBars.includes("progress") ? "opacity-50" : "opacity-100"}`}
          onClick={() => handleLegendClick("progress")}
        >
          <span className="text-sm text-gray-600 relative flex items-center gap-2">
            <div className="w-4 h-4 bg-[#4079CE] rounded transition-transform duration-300 hover:scale-110" />
            {hiddenBars.includes("progress") && (
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-400" />
            )}
            % hoàn thành
          </span>
        </motion.div>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={paginatedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#555555" }}
              tickLine={{ stroke: "#555555" }}
              fontSize={12}
            />
            <YAxis
              ticks={[0, 20, 40, 60, 80, 100]}
              domain={[0, 100]}
              label={{
                value: "Tiến độ (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#555555"
              }}
              tick={{ fill: "#555555" }}
              tickLine={{ stroke: "#555555" }}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc", 
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            />
            <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
              {paginatedData.map((entry, index) => (
                <Cell 
                  key={`cell-${entry.name}-${index}`}
                  fill={entry.fill}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Thêm điều khiển phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
