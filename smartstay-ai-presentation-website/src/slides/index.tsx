import type { ComponentType } from "react";
import { Slide01, Slide02, Slide03, Slide04, Slide05, Slide06 } from "./slides1";
import { Slide07, Slide08, Slide09, Slide10, Slide11 } from "./slides2";
import {
  Slide12,
  Slide13,
  Slide14,
  Slide15,
  Slide16,
} from "./slides3";

export type SlideDefinition = {
  id: number;
  title: string;
  Component: ComponentType;
};

export const slides: SlideDefinition[] = [
  { id: 1, title: "SmartStay AI", Component: Slide01 },
  { id: 2, title: "Phân công công việc", Component: Slide02 },
  { id: 3, title: "Bài toán: overbooking khi nào có lợi?", Component: Slide03 },
  { id: 4, title: "Dữ liệu Hotel Booking Demand", Component: Slide04 },
  { id: 5, title: "Các quyết định làm sạch quan trọng", Component: Slide05 },
  { id: 6, title: "Chín kịch bản thực nghiệm", Component: Slide06 },
  { id: 7, title: "Kết quả của chín thực nghiệm", Component: Slide07 },
  {
    id: 8,
    title: "So sánh mô hình trên tập validation (kiểm định)",
    Component: Slide08,
  },
  { id: 9, title: "Kết quả phân loại trên test", Component: Slide09 },
  { id: 10, title: "Chi phí overbooking trên test (r = 2)", Component: Slide10 },
  { id: 11, title: "Độ nhạy theo r", Component: Slide11 },
  { id: 12, title: "Mô hình dựa vào đâu để dự đoán?", Component: Slide12 },
  { id: 13, title: "Web demo SmartStay AI", Component: Slide13 },
  { id: 14, title: "Hạn chế", Component: Slide14 },
  { id: 15, title: "Kết luận", Component: Slide15 },
  { id: 16, title: "Hướng phát triển tiếp theo", Component: Slide16 },
];

export const totalSlides = slides.length;
