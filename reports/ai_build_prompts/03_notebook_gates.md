# PHẦN 3/5 — `notebooks/07_final_test.ipynb`: cấu hình + GATE + PRE-FLIGHT (FINAL=False)
> Điều kiện: Phần 1–2 đã được N4 nghiệm thu. Nếu chưa → DỪNG.
> **Phần này chỉ viết đến nhánh dừng PRE-FLIGHT. Tuyệt đối không viết cells đọc test ở bước này (đó là Phần 4), tuyệt đối không đặt FINAL=True.**

## Luật vàng
1. **KHÔNG mở/đọc `data/processed/test.csv`** — notebook ở Phần này dừng trước khi đọc nó.
2. Không sửa file nguồn / protocol / `.gitignore`; không tạo `test_final*`; không đổi tên; `Tung_mlp_v2` giữ nguyên.
3. Branch Arena đã gán; push branch đó; không checkout branch khác; không tự merge.

## Cấu trúc notebook (đúng thứ tự cell)

**Cell 0 (md):** Tiêu đề + cảnh báo: "Mở test đúng MỘT lần; chỉ khi N4 đổi FINAL=True và Restart & Run All; mọi bảng ngoài mục 7 protocol ghi nhãn thăm dò (post-hoc). Xem `reports/final_protocol.md` mục 8."

**Cell 1 (code) — Cấu hình:**
```python
FINAL = False                      # N4 doi thanh True khi chay chinh thuc — ban KHONG doi
PROTOCOL_TAG  = "protocol-v1"
PROTOCOL_MD   = "reports/final_protocol.md"
RESULTS       = "reports/results"
FROZEN        = f"{RESULTS}/frozen_thresholds.csv"
MODELS        = ["dummy", "logreg", "tree", "lightgbm_smotenc", "Tung_mlp_v2"]
LOCKED_HASHES = {  # tu protocol muc 2 — tinh sha256 de doi chieu, KHONG doc noi dung test
    "data/processed/train.csv": "4e75d796b7e993bb350d202d428f9e3ad9d746daa3e42704deb0cbb21482329e",
    "data/processed/val.csv":   "1fcbee5f639ac363bbbf155235d2cad45436d5e3dd7a73b1c1e422289c3485c1",
    "data/processed/test.csv":  "2cac5114304eb69a10b47f34881ded19dfbd5bbcb3d0a9ed107b438c100ae200",
    "models/Tung_mlp_v2.joblib":"5090cbc6273c034ad4446a69b9f8e728217a6a956084de504ca248553759b970",
}
```

**Cell 2 (code) — GATE 1 (tag):** subprocess `git rev-parse --verify refs/tags/protocol-v1`. Thất bại → in rõ `DỪNG: chưa có tag protocol-v1` + `raise SystemExit(1)`.

**Cell 3 (code) — GATE 2 (protocol & frozen):** `PROTOCOL_MD` tồn tại; `FROZEN` tồn tại; đọc `FROZEN`: mọi model ∈ `MODELS\{dummy}` có đủ 6 dòng r ∈ {0.5, 1, 2, 3, 5, 10}; thiếu → in danh sách thiếu + dừng.

**Cell 4 (code) — GATE 3 (src không đổi kể từ tag):** `git diff --quiet protocol-v1 -- src/ reports/final_protocol.md`; có khác biệt → in `git diff --stat` + dừng.

**Cell 5 (code) — GATE 4 (hash):** `hashlib.sha256` từng file trong `LOCKED_HASHES`; in bảng kỳ vọng vs thực tế; bất kỳ lệch → dừng.

**Cell 6 (code) — GATE 5 (model/proba đủ):** với mỗi model ∈ `MODELS\{dummy}`: `models/<model>.joblib` tồn tại + `models/proba_val_<model>.npy` tồn tại và `len == 14400`; thiếu → in danh sách thiếu + dừng.

**Cell 7 (code) — GATE 6 (chống chạy lại):** nếu `reports/results/test_final.csv` tồn tại → in `DỪNG: đã có test_final.csv — không chạy lại` + dừng.

**Cell 8 (code) — KẾT THÚC PRE-FLIGHT:** nếu `FINAL is False`: in `PRE-FLIGHT PASSED. Chỉ N4 mới được đổi FINAL=True + Restart & Run All.` + `raise SystemExit`. (Kết thúc cell cuối cùng của Phần 3.)

## Nghiệm thu Phần 3 (dán log nguyên văn)
Restart & Run All:
- Nếu chưa có tag `protocol-v1` (hiện tại): notebook **dừng ở GATE 1** với thông báo rõ ràng. → **Đây là kết quả mong đợi tại thời điểm này.**
- Tạo sẵn tag giả để test? **KHÔNG.** Không tạo/xóa/đổi tag thật. (Muốn thử GATE khác: copy repo sang thư mục tạm, tạo tag `protocol-v1-test` cục bộ — không push — rồi chạy thử và xóa tag tạm; ghi rõ đã làm trong bàn giao.)
- Xác nhận: không cell nào sau Cell 8 tồn tại ở Phần này; `test_final*` không được tạo; `data/processed/test.csv` không bị đọc (notebook dừng trước).

## Bàn giao Phần 3 cho N4
Nộp: (a) log Restart & Run All nguyên văn; (b) `git diff --stat main`; (c) SHA nhánh; (d) mọi quyết định (vd: thư mục tạm để thử gate) + lý do.
**Không viết cells đọc test / bảng / artifacts — đó là Phần 4, chỉ bắt đầu khi N4 duyệt.**
