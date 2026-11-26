import type { ComponentType } from "react";
import Cover from "./Cover";
import {
  AssignmentSlide,
  CleaningSlide,
  DemoSlide,
  NextStepsSlide,
  ResultsSlide,
  ScenariosSlide,
  SensitivitySlide,
  ShapSlide,
  TestResultsSlide,
  ValidationSlide,
} from "./Tables";
import { ConclusionSlide, CostSlide, DataSlide, LimitsSlide, ProblemSlide } from "./Narrative";

export type SlideDef = { title: string; Component: ComponentType };

/** Thứ tự đúng với bộ slide gốc (16 trang). `title` là tiêu đề gốc của từng slide. */
export const slides: SlideDef[] = [
  { title: "SmartStay AI", Component: Cover }, // 1
  { title: "Phân công công việc", Component: AssignmentSlide }, // 2
  { title: "Bài toán: overbooking khi nào có lợi?", Component: ProblemSlide }, // 3
  { title: "Dữ liệu Hotel Booking Demand", Component: DataSlide }, // 4
  { title: "Các quyết định làm sạch quan trọng", Component: CleaningSlide }, // 5
  { title: "Chín kịch bản thực nghiệm", Component: ScenariosSlide }, // 6
  { title: "Kết quả của chín thực nghiệm", Component: ResultsSlide }, // 7
  { title: "So sánh mô hình trên tập validation (kiểm định)", Component: ValidationSlide }, // 8
  { title: "Kết quả phân loại trên test", Component: TestResultsSlide }, // 9
  { title: "Chi phí overbooking trên test (r = 2)", Component: CostSlide }, // 10
  { title: "Độ nhạy theo r", Component: SensitivitySlide }, // 11
  { title: "Mô hình dựa vào đâu để dự đoán?", Component: ShapSlide }, // 12
  { title: "Web demo SmartStay AI", Component: DemoSlide }, // 13
  { title: "Hạn chế", Component: LimitsSlide }, // 14
  { title: "Kết luận", Component: ConclusionSlide }, // 15
  { title: "Hướng phát triển tiếp theo", Component: NextStepsSlide }, // 16
];
