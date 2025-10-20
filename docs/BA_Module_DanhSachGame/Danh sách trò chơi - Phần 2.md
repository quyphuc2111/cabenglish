# 📑 TÀI LIỆU THIẾT KẾ CHI TIẾT - MODULE DANH SÁCH TRÒ CHƠI

# BKT SmartKids - Game Library Module

## PHẦN 2: EPIC 2 - Quản lý trò chơi (Admin Module)

---

## 📋 EPIC OVERVIEW

### Epic Information

- **Epic ID:** EP-002
- **Epic Name:** Quản lý trò chơi (Game Management)
- **Version:** 1.0
- **Date:** October 20, 2025
- **Status:** In Planning
- **Epic Type:** Admin Functionality

### Epic Description

Epic này tập trung vào việc cung cấp các công cụ quản lý cho quản trị viên để tạo, cập nhật, xóa và tổ chức các trò chơi, chủ đề, nhóm tuổi, cùng với các tính năng import/export và sắp xếp. Điều này đảm bảo hệ thống luôn cập nhật với nội dung chất lượng cao, phù hợp với người dùng cuối.

**As a** quản trị hệ thống sử dụng nền tảng SmartKids,  
**I want** quản lý các trò chơi có trong hệ thống của tôi,  
**So that** tôi có thể cung cấp các trò chơi chất lượng tới học sinh.

### Business Value

- Cho phép admin dễ dàng mở rộng thư viện trò chơi, duy trì chất lượng nội dung, và tối ưu hóa trải nghiệm người dùng.
- Giảm thời gian thủ công bằng cách hỗ trợ import/export hàng loạt.
- Tăng tính linh hoạt cho hệ thống, hỗ trợ cập nhật nhanh chóng các trò chơi mới từ GDevelop.

### KPIs

- Thời gian trung bình để thêm một trò chơi mới: < 5 phút.
- Số lượng trò chơi được quản lý: Ít nhất 50 games trong quý đầu tiên.
- Tỷ lệ lỗi import/export: < 1%.
- Thời gian response cho các hành động CRUD: < 500ms.

### Stakeholders

- Quản trị viên hệ thống (Admin users).
- Đội ngũ phát triển và thiết kế game (GDevelop creators).
- Ban lãnh đạo dự án (để đảm bảo chất lượng nội dung).
- Người dùng cuối (học sinh và phụ huynh, gián tiếp qua nội dung chất lượng).

### Target Release

- Sprint 2 (October 25, 2025 - November 1, 2025).
- Dependencies: Hoàn thành Epic 1 và database schema.

### Risks & Mitigations

- Risk: Tích hợp import/export Excel có thể gặp lỗi định dạng → Mitigation: Sử dụng thư viện Excel đáng tin cậy (e.g., EPPlus cho .NET) và validate input nghiêm ngặt.
- Risk: Quyền truy cập admin bị lạm dụng → Mitigation: Role-based access control (RBAC) với JWT authentication.

---

## 📝 USER STORY 2.2.1: CRUD cho danh sách game topic

- **User Story ID:** US-008
- **Epic Link:** EP-002
- **Title:** Quản lý chủ đề trò chơi (CRUD Game Topics)

**User Story:**

- **As a** quản trị viên hệ thống,
- **I want** tạo, đọc, cập nhật và xóa các chủ đề trò chơi (topics),
- **So that** tôi có thể tổ chức và quản lý các category của trò chơi một cách hiệu quả.

**Description:**
Admin có thể truy cập dashboard để quản lý topics: thêm mới (với tên, mô tả, icon), xem danh sách, chỉnh sửa, và xóa (với xác nhận). Hỗ trợ validation để tránh duplicate topic_name.

**Business Context:**
Topics là cách phân loại chính cho games, giúp admin dễ dàng cấu trúc thư viện và hỗ trợ filter cho user.

**Priority:** High (Must have)
**Story Points (Estimation):** 5 điểm
**Sprint:** Sprint 2
**Assigned To:** Backend Developer + Admin Frontend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design admin UI cho topics đã approve
- [x] API endpoints cho CRUD đã define
- [x] Database table game_topic đã sẵn sàng

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] Integration tests passed
- [ ] All AC verified by QA
- [ ] Documentation updated

**Technical Requirements:**

**API Endpoints:**

```
GET /api/admin/topics  // Lấy danh sách topics
Query Parameters:
  - page: int (default: 1)
  - pageSize: int (default: 20)

Response 200:
{
  "success": true,
  "data": {
    "topics": [...],
    "totalCount": 10
  }
}

POST /api/admin/topics  // Tạo mới topic
Body:
{
  "topicName": "New Topic",
  "topicNameVi": "Chủ đề mới",
  "description": "...",
  "iconUrl": "/icons/new.png",
  "order": 5,
  "isActive": true
}

Response 201:
{
  "success": true,
  "data": { "topicId": 5 }
}

PUT /api/admin/topics/{topicId}  // Cập nhật topic
Body: { ... fields to update ... }

Response 200:
{
  "success": true
}

DELETE /api/admin/topics/{topicId}  // Xóa topic
Response 200:
{
  "success": true
}
```

**Database Changes:**

- Sử dụng table game_topic hiện có.
- Khi xóa, CASCADE delete các links trong game_topic_link.

**Performance:**

- Response time < 500ms cho CRUD.
- Cache danh sách topics cho admin trong 10 phút.

**Security:**

- Response time < 500ms cho CRUD.
- Cache danh sách topics cho admin trong 10 phút.

**Security:**

- Chỉ admin role mới truy cập (403 nếu không phải).
- Validate input: topic_name unique, icon_url valid URL.
- Rate limiting: 50 requests/minute/admin.

---

### Acceptance Criteria - US-008

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Tạo topic mới thành công**

```
Given admin đang ở dashboard topics và form tạo mới đã mở
When admin nhập các trường hợp lệ: topicName="Fruits", iconUrl="/icons/fruits.png", và submit POST /api/admin/topics
Then hệ thống tạo record mới trong bảng game_topic với các giá trị đã nhập
  And redirect về danh sách topics với message thành công "Tạo chủ đề thành công"
  And danh sách topics được refresh và hiển thị topic mới
```

**Scenario [HP-2]: Cập nhật topic thành công**

```
Given topic với ID=1 tồn tại trong database
When admin mở form cập nhật cho topic ID=1, chỉnh sửa topicName thành "Animals Updated", và submit PUT /api/admin/topics/1
Then hệ thống update record tương ứng trong bảng game_topic, với updated_at được cập nhật mới
  And danh sách topics được refresh và hiển thị tên topic đã thay đổi
  And không ảnh hưởng đến các record khác
```

**Scenario [HP-3]: Xóa topic thành công**

```
Given topic với ID=4 tồn tại và không có game liên kết
When admin click nút delete cho topic ID=4 và confirm trong dialog
Then hệ thống gọi DELETE /api/admin/topics/4, xóa record khỏi bảng game_topic
  And danh sách topics được refresh và topic ID=4 không còn hiển thị
  And message thành công "Xóa chủ đề thành công"
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Xem danh sách topics với sort theo order**

```
Given có 10 topics tồn tại trong database
When admin load trang dashboard topics
Then hệ thống hiển thị table với các columns: ID, Name, Description, Order, Active
  And các topics được sắp xếp theo order ASC mặc định
  And hỗ trợ sort bằng click header column
```

**Scenario [AF-2]: Toggle is_active cho topic**

```
Given topic với ID=2 có is_active=true
When admin toggle switch is_active trong danh sách hoặc form
Then hệ thống gọi PUT /api/admin/topics/2 để update is_active=false
  And topic được ẩn khỏi view của user (không hiển thị trong filter topics cho người dùng)
  And danh sách admin refresh với trạng thái mới
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Tạo topic với tên duplicate**

```
Given topicName="Animals" đã tồn tại trong database
When admin submit form tạo mới với topicName="Animals"
Then hệ thống trả về 400 Bad Request với message "Tên chủ đề đã tồn tại"
  And không tạo record mới trong database
  And hiển thị error trong form để admin chỉnh sửa
```

**Scenario [EX-2]: Xóa topic có games liên kết**

```
Given topic với ID=1 có games liên kết trong game_topic_link
When admin click delete cho topic ID=1
Then hệ thống hiển thị confirm dialog: "Chủ đề này có games liên kết, việc xóa sẽ ảnh hưởng đến links. Bạn vẫn muốn xóa?"
  And nếu admin confirm, thì CASCADE delete các links liên quan và xóa topic
  And nếu cancel, thì không xóa gì
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Tạo topic với order âm hoặc invalid**

```
Given admin nhập order=-1 trong form tạo mới
When admin submit form
Then hệ thống validate và set order=0 (default) nếu invalid
  And tạo record với order=0
  And hiển thị warning "Order phải >=0, đã set default 0"
```

**Scenario [EC-2]: Xem danh sách topics khi rỗng**

```
Given không có topics nào trong database
When admin load trang dashboard topics
Then hệ thống hiển thị empty state với message "Chưa có chủ đề nào"
  And có nút "Tạo mới" nổi bật để khuyến khích thêm
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Mở modal tạo hoặc cập nhật topic**

```
Given admin click nút "Tạo mới" hoặc "Chỉnh sửa" cho một topic
When modal mở
Then hiển thị form với các fields validate real-time (e.g., topicName unique check async)
  And nút submit disable nếu form invalid
```

**Scenario [UX-2]: Confirmation cho delete topic**

```
Given admin click nút delete cho một topic
When hệ thống hiển thị sweet alert hoặc modal confirm
Then yêu cầu confirm trước khi gọi API delete
  And nếu confirm, proceed; nếu không, cancel
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Load danh sách lớn topics**

```
Given có 100 topics trong database
When admin load trang dashboard
Then response time <1 giây với pagination hỗ trợ
  And hệ thống sử dụng index để optimize query
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Non-admin cố truy cập dashboard topics**

```
Given user không phải admin (e.g., role user thông thường)
When user cố GET /api/admin/topics hoặc truy cập trang dashboard
Then hệ thống trả về 403 Forbidden
  And redirect về trang login hoặc home với message "Bạn không có quyền truy cập"
```

---

## 📝 USER STORY 2.2.2: CRUD cho danh sách age

- **User Story ID:** US-009
- **Epic Link:** EP-002
- **Title:** Quản lý nhóm độ tuổi (CRUD Age Groups)

**User Story:**

- **As a** quản trị viên hệ thống,
- **I want** tạo, đọc, cập nhật và xóa các nhóm độ tuổi,
- **So that** tôi có thể điều chỉnh các nhóm tuổi phù hợp cho trò chơi.

**Description:**
Tương tự CRUD topics, nhưng cho table age: thêm min/max age, description. Validation cho unique age_name và min_age < max_age.

**Business Context:**
Age groups đảm bảo games phù hợp với phát triển trẻ em, admin cần quản lý để mở rộng range tuổi.

**Priority:** High (Must have)
**Story Points (Estimation):** 4 điểm
**Sprint:** Sprint 2
**Assigned To:** Backend Developer + Admin Frontend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design admin UI cho ages đã approve
- [x] API endpoints cho CRUD đã define
- [x] Database table age đã sẵn sàng

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] Integration tests passed
- [ ] All AC verified by QA
- [ ] Documentation updated

**Technical Requirements:**

**API Endpoints:**

```
GET /api/admin/ages  // Lấy danh sách ages
Query Parameters:
  - page: int (default: 1)
  - pageSize: int (default: 20)

Response 200:
{
  "success": true,
  "data": {
    "ages": [...],
    "totalCount": 5
  }
}

POST /api/admin/ages  // Tạo mới
Body:
{
  "ageName": "6-7 tuổi",
  "ageNameEn": "6-7 years old",
  "description": "...",
  "minAge": 6,
  "maxAge": 7,
  "order": 4
}

Response 201:
{
  "success": true,
  "data": { "ageId": 4 }
}

PUT /api/admin/ages/{ageId}  // Cập nhật
Body: { ... fields to update ... }

Response 200:
{
  "success": true
}

DELETE /api/admin/ages/{ageId}  // Xóa
Response 200:
{
  "success": true
}
```

**Database Changes:**

- Sử dụng table age hiện có.
- CASCADE delete links trong game_age_link khi xóa.

**Performance:**

- Response time < 500ms cho CRUD.

**Security:**

- Chỉ admin role mới truy cập.
- Validate min_age < max_age, age_name unique.

---

### Acceptance Criteria - US-009

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Tạo age mới thành công**

```
Given admin đang ở dashboard ages và form tạo mới đã mở
When admin nhập các trường hợp lệ: ageName="6-7 tuổi", minAge=6, maxAge=7, và submit POST /api/admin/ages
Then hệ thống tạo record mới trong bảng age với các giá trị đã nhập
  And redirect về danh sách ages với message thành công "Tạo nhóm tuổi thành công"
  And danh sách ages được refresh và hiển thị age mới
```

**Scenario [HP-2]: Cập nhật age thành công**

```
Given age với ID=1 tồn tại trong database
When admin mở form cập nhật cho age ID=1, chỉnh sửa description thành "Mô tả mới", và submit PUT /api/admin/ages/1
Then hệ thống update record tương ứng trong bảng age, với updated_at được cập nhật mới
  And danh sách ages được refresh và hiển thị mô tả đã thay đổi
  And không ảnh hưởng đến các record khác
```

**Scenario [HP-3]: Xóa age thành công**

```
Given age với ID=3 tồn tại và không có game liên kết
When admin click nút delete cho age ID=3 và confirm trong dialog
Then hệ thống gọi DELETE /api/admin/ages/3, xóa record khỏi bảng age
  And danh sách ages được refresh và age ID=3 không còn hiển thị
  And message thành công "Xóa nhóm tuổi thành công"
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Xem danh sách ages**

```
Given có 5 ages tồn tại trong database
When admin load trang dashboard ages
Then hệ thống hiển thị table với các columns: ID, Name, Min Age, Max Age, Order, Description
  And các ages được sắp xếp theo order ASC mặc định
  And hỗ trợ sort bằng click header column
```

**Scenario [AF-2]: Toggle is_active cho age (nếu có field tương tự)**

```
Given age với ID=2 (giả sử có is_active nếu cần mở rộng)
When admin toggle switch is_active
Then hệ thống gọi PUT /api/admin/ages/2 để update is_active
  And danh sách refresh với trạng thái mới
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Tạo age với min_age > max_age**

```
Given admin nhập minAge=7, maxAge=6
When admin submit form tạo mới
Then hệ thống validate và trả error "Min age phải nhỏ hơn max age"
  And không tạo record
  And hiển thị error trong form
```

**Scenario [EX-2]: Xóa age có games liên kết**

```
Given age với ID=1 có games liên kết trong game_age_link
When admin click delete cho age ID=1
Then hệ thống hiển thị confirm dialog: "Nhóm tuổi này có games liên kết, việc xóa sẽ ảnh hưởng đến links. Bạn vẫn muốn xóa?"
  And nếu confirm, CASCADE delete các links và xóa age
  And nếu cancel, không xóa
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Tạo age với age_name duplicate**

```
Given ageName="3-4 tuổi" đã tồn tại
When admin submit form tạo mới với ageName="3-4 tuổi"
Then hệ thống trả 400 Bad Request với message "Tên nhóm tuổi đã tồn tại"
  And không tạo record
```

**Scenario [EC-2]: Xem danh sách ages khi rỗng**

```
Given không có ages nào trong database
When admin load trang dashboard ages
Then hệ thống hiển thị empty state với message "Chưa có nhóm tuổi nào"
  And có nút "Tạo mới" nổi bật
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Form validation real-time cho min/max age**

```
Given admin đang nhập form tạo mới
When admin nhập minAge > maxAge
Then hiển thị error real-time "Min age phải nhỏ hơn max age"
  And nút submit disable
```

**Scenario [UX-2]: Confirmation cho delete age**

```
Given admin click nút delete cho một age
When hệ thống hiển thị modal confirm
Then yêu cầu confirm trước khi gọi API delete
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Load danh sách lớn ages**

```
Given có 50 ages trong database
When admin load trang
Then response time <1 giây với pagination
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Non-admin cố truy cập dashboard ages**

```
Given user không phải admin
When user cố GET /api/admin/ages
Then trả về 403 Forbidden
```

---

## 📝 USER STORY 2.2.3: CRUD cho danh sách game

- **User Story ID:** US-010
- **Epic Link:** EP-002
- **Title:** Quản lý trò chơi (CRUD Games)

**User Story:**

- **As a** quản trị viên hệ thống,
- **I want** tạo, đọc, cập nhật và xóa các trò chơi,
- **So that** tôi có thể thêm nội dung mới từ GDevelop.

**Description:**
Admin quản lý games: thêm url_game, image_url, link topics/ages. Upload icon/thumbnail.

**Business Context:**
Core cho việc mở rộng thư viện games.

**Priority:** Critical (Must have)
**Story Points (Estimation):** 8 điểm
**Sprint:** Sprint 2
**Assigned To:** Backend Developer + Admin Frontend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design admin UI cho games đã approve
- [x] API endpoints cho CRUD đã define
- [x] Database table game đã sẵn sàng

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] Integration tests passed
- [ ] All AC verified by QA
- [ ] Documentation updated

**Technical Requirements:**

**API Endpoints:**

```
GET /api/admin/games  // Lấy danh sách games
Query Parameters:
  - page: int (default: 1)
  - pageSize: int (default: 20)

Response 200:
{
  "success": true,
  "data": {
    "games": [...],
    "totalCount": 50
  }
}

POST /api/admin/games  // Tạo mới, bao gồm arrays topicIds, ageIds
Body:
{
  "gameName": "New Game",
  "urlGame": "https://newgame.com",
  "topicIds": [1,2],
  "ageIds": [3]
}

Response 201:
{
  "success": true,
  "data": { "gameId": 10 }
}

PUT /api/admin/games/{gameId}  // Cập nhật, update links

DELETE /api/admin/games/{gameId}  // Xóa
```

**Database Changes:**

- Insert/update game, và manage links trong game_topic_link, game_age_link (delete old, insert new).

**Performance:**

- Response time <500ms, handle file upload for image_url.

**Security:**

- Admin only, validate url_game là URL hợp lệ, file upload secure (type jpg/png, size <2MB).

---

### Acceptance Criteria - US-010

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Tạo game mới thành công**

```
Given admin đang ở dashboard games và form tạo mới đã mở
When admin nhập các trường hợp lệ: gameName="New Game", urlGame="https://newgame.com", chọn topicIds=[1,2], ageIds=[3], và submit POST /api/admin/games
Then hệ thống tạo record mới trong bảng game
  And tạo các links tương ứng trong game_topic_link (2 records) và game_age_link (1 record)
  And redirect về danh sách games với message "Tạo game thành công"
  And danh sách refresh hiển thị game mới
```

**Scenario [HP-2]: Cập nhật game thành công**

```
Given game với ID=1 tồn tại, có links cũ topicIds=[1]
When admin mở form cập nhật, thay đổi gameName="Updated Game", update topicIds=[1,3] (thêm 3, giữ 1), và submit PUT /api/admin/games/1
Then hệ thống update record game, delete links cũ không còn, insert links mới
  And danh sách refresh với dữ liệu cập nhật
  And num_liked vẫn giữ nguyên nếu không thay đổi
```

**Scenario [HP-3]: Xóa game thành công**

```
Given game với ID=5 tồn tại
When admin click delete cho game ID=5 và confirm
Then hệ thống gọi DELETE /api/admin/games/5, xóa record game
  And CASCADE xóa tất cả links trong game_topic_link và game_age_link
  And set num_liked=0 (nếu cần reset), danh sách refresh không còn game ID=5
  And message "Xóa game thành công"
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Upload image cho game**

```
Given admin đang ở form tạo/cập nhật game
When admin upload file image.jpg hợp lệ
Then hệ thống save file vào storage (e.g., S3 hoặc local), update image_url trong record game
  And hiển thị preview image trong form
```

**Scenario [AF-2]: Xem danh sách games với links hiển thị**

```
Given có 20 games tồn tại
When admin load dashboard games
Then table hiển thị columns: ID, Name, Url Game, Num Liked, Topics (list), Ages (list), Active
  And hỗ trợ expand row để xem chi tiết links
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Tạo game với url_game invalid**

```
Given admin nhập url_game="invalid_url"
When submit form
Then validate error "Url game phải là URL hợp lệ"
  And không tạo record
```

**Scenario [EX-2]: Upload file image invalid (wrong type)**

```
Given admin upload file .txt thay vì image
When submit
Then error "File phải là jpg/png"
  And không update image_url
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Tạo game với multiple links (many-to-many)**

```
Given admin chọn 3 topics và 2 ages
When submit
Then hệ thống handle đúng: insert 3 records game_topic_link và 2 records game_age_link
  And không duplicate nếu select trùng (nhờ unique key)
```

**Scenario [EC-2]: Cập nhật game xóa hết links**

```
Given game ID=1 có links cũ
When update topicIds=[], ageIds=[]
Then delete tất cả links cũ, record game vẫn giữ nhưng không links
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Multi-select dropdown cho topics/ages trong form**

```
Given mở form tạo/cập nhật
When admin click dropdown topics
Then hiển thị multi-select checkbox với list topics từ API /api/v1/topics
  And tương tự cho ages
```

**Scenario [UX-2]: Confirmation delete game**

```
Given click delete
When hiển thị modal
Then message "Xóa game sẽ xóa links liên quan. Confirm?"
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Load danh sách lớn games**

```
Given 100 games
When load
Then <1s với pagination và JOIN links optimize
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Secure file upload**

```
Given upload file
When process
Then validate type (jpg/png), size <2MB, scan malware nếu có
  And nếu invalid, reject với error
```

---

## 📝 USER STORY 2.2.4: Import game từ file excel

- **User Story ID:** US-011
- **Epic Link:** EP-002
- **Title:** Import games từ file Excel (Import Games from Excel)

**User Story:**

- **As a** quản trị viên,
- **I want** import games từ file Excel,
- **So that** tôi có thể thêm hàng loạt games nhanh chóng.

**Description:**
Hỗ trợ tạo mới, ghi đè, hoặc mix dựa trên game_id. File template với columns: game_name, url_game, topics (comma separated), etc.

**Business Context:**
Tiết kiệm thời gian cho admin khi deploy nhiều games.

**Priority:** Medium (Should have)
**Story Points (Estimation):** 6 điểm
**Sprint:** Sprint 2
**Assigned To:** Backend Developer + Admin Frontend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Template Excel define và approve
- [x] API import define

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] All AC verified by QA

**Technical Requirements:**

**API Endpoints:**

```
POST /api/admin/games/import
Form Data:
  - file: Excel file (.xlsx)
  - mode: "create" | "overwrite" | "merge"

Response 200:
{
  "success": true,
  "importedCount": 10,
  "errors": ["Row 5: Invalid url"]
}
```

**Database Changes:**

- Batch insert/update games và links (parse comma separated cho topics/ages).

**Performance:**

- Handle 100 rows <10s, batch transactions.

**Security:**

- Validate file type .xlsx, size <5MB, sanitize data.

---

### Acceptance Criteria - US-011

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Import ở mode create new**

```
Given file Excel với 5 rows games mới (không trùng game_id)
When admin upload file và chọn mode="create", submit POST /api/admin/games/import
Then hệ thống parse file, tạo 5 records game mới và links tương ứng
  And return importedCount=5, errors=[]
  And danh sách games refresh với 5 games mới
```

**Scenario [HP-2]: Import ở mode overwrite**

```
Given file Excel với rows có game_id tồn tại
When admin upload và chọn mode="overwrite"
Then hệ thống update fields cho games tồn tại (ghi đè), update links
  And return importedCount, errors nếu có
```

**Scenario [HP-3]: Import ở mode merge**

```
Given file Excel với mix new và existing game_id
When admin upload và chọn mode="merge"
Then hệ thống tạo mới cho rows mới, update cho existing
  And handle links: add new nếu có, không xóa old nếu không chỉ định
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Parse topics/ages comma separated**

```
Given row trong file có topics="Animals,Numbers" (tên hoặc ID)
When parse
Then tìm ID topics tương ứng, tạo multiple links cho game
  And tương tự cho ages
```

**Scenario [AF-2]: Download template Excel**

```
Given admin click "Download template"
When download
Then nhận file .xlsx với columns mẫu: game_id, game_name, url_game, topics, ages, etc.
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Import file invalid format**

```
Given upload file .csv thay vì .xlsx
When submit
Then trả error "File phải là .xlsx"
  And không process, importedCount=0
```

**Scenario [EX-2]: Data invalid trong row cụ thể**

```
Given file có row 5 với url_game invalid
When import
Then process partial (tiếp tục các row khác), return errors=["Row 5: Invalid url_game"]
  And importedCount cho các row thành công
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Import file rỗng (no data rows)**

```
Given file Excel chỉ có header, no data
When submit
Then return "No data to import", importedCount=0
```

**Scenario [EC-2]: Import với duplicate game_id trong file**

```
Given file có 2 rows với cùng game_id
When import mode="create"
Then error cho row thứ 2 "Duplicate game_id in file"
  And chỉ import row đầu
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Progress bar trong khi import**

```
Given upload file lớn
When submit
Then hiển thị progress bar, sau khi xong show report modal với importedCount và errors list
```

**Scenario [UX-2]: Chọn mode import**

```
Given mở form import
Then dropdown chọn mode: create/overwrite/merge, với tooltip giải thích
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Import file lớn**

```
Given file với 200 rows
When import
Then process batch (e.g., 50 rows/lần), time <20s
  And không crash memory
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Malicious file (e.g., script embedded)**

```
Given upload file malicious
When process
Then validate và reject nếu detect, hoặc sanitize all data as text
```

---

## 📝 USER STORY 2.2.5: Tìm kiếm và lọc trong danh sách game

- **User Story ID:** US-012
- **Epic Link:** EP-002
- **Title:** Tìm kiếm và lọc trong danh sách game (Search & Filter Games in Admin)

**User Story:**

- **As a** quản trị viên,
- **I want** tìm kiếm và lọc games,
- **So that** tôi có thể dễ dàng tìm game cụ thể.

**Description:**
Tìm theo name, filter theo topic, age, active status.

**Business Context:**
Giúp admin quản lý large list.

**Priority:** High (Must have)
**Story Points (Estimation):** 4 điểm
**Sprint:** Sprint 2
**Assigned To:** Frontend + Backend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] UI filter approve

**Definition of Done (DoD):**

- [ ] Code
- [ ] Tests

**Technical Requirements:**

**API Endpoints:**

```
GET /api/admin/games?keyword=animal&topicIds=1,2&ageIds=3&isActive=true&page=1&pageSize=20
```

**Database Changes:**

- Query với LIKE cho keyword, JOIN cho topic/age filters, WHERE is_active.

**Performance:**

- <500ms, use indexes on game_name, is_active.

**Security:**

- Admin only.

---

### Acceptance Criteria - US-012

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Tìm kiếm theo name**

```
Given có games với name chứa "animal"
When admin nhập keyword="animal" vào search box và submit (debounce 500ms)
Then hệ thống gọi API với keyword, return list games matching
  And hiển thị list filtered
  And highlight keyword trong name nếu có
```

**Scenario [HP-2]: Filter theo topic**

```
Given admin chọn topicIds=1 (Animals)
When apply filter
Then API gọi với topicIds=1, return games có link đến topic 1
  And badge filter "Animals" hiển thị
```

**Scenario [HP-3]: Filter theo age và is_active**

```
Given admin chọn ageIds=3 và isActive=true
When apply
Then return games matching filters
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Combine multiple filters**

```
Given keyword="animal", topicIds=1, ageIds=3
When apply
Then query AND conditions, return games thỏa tất cả
```

**Scenario [AF-2]: Clear filters**

```
Given filters applied
When click "Clear all"
Then reset to full list
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: No results sau filter**

```
Given filters dẫn đến no games
When apply
Then empty state "No games found with these filters"
  And gợi ý "Try different filters"
```

**Scenario [EX-2]: Invalid keyword (too short)**

```
Given keyword <1 char
When search
Then không gọi API, placeholder "Enter at least 1 char"
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Search với special chars**

```
Given keyword="animal & number!"
When search
Then sanitize to "animal number", return relevant
```

**Scenario [EC-2]: Filter với all topics/ages**

```
Given select all
When apply
Then tương đương no filter
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Debounce search input**

```
Given typing keyword
When stop 500ms
Then gọi API
```

**Scenario [UX-2]: Badges for active filters**

```
Given filters applied
Then show removable badges
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Large dataset filter**

```
Given 1000 games
When filter
Then <500ms với optimized JOIN/INDEX
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Non-admin search**

```
Then 403
```

---

## 📝 USER STORY 2.2.6: Hỗ trợ phân trang cho danh sách topic, age, game

- **User Story ID:** US-013
- **Epic Link:** EP-002
- **Title:** Phân trang cho danh sách (Pagination for Lists)

**User Story:**

- **As a** quản trị viên,
- **I want** phân trang cho danh sách topics, ages, games,
- **So that** tôi có thể duyệt large lists mà không load all.

**Description:**
Pagination với page, pageSize, totalCount cho tất cả lists.

**Business Context:**
Cải thiện performance cho admin với data lớn.

**Priority:** Medium (Should have)
**Story Points (Estimation):** 3 điểm
**Sprint:** Sprint 2
**Assigned To:** Frontend + Backend Developer

**Definition of Ready (DoR):**

- [x] AC
- [x] UI pagination approve

**Definition of Done (DoD):**

- [ ] Code
- [ ] Tests

**Technical Requirements:**

**API Endpoints:**

- All GET admin lists add page/pageSize, return totalCount.

**Database Changes:**

- Use LIMIT/OFFSET for pagination.

**Performance:**

- Efficient count query.

**Security:**

- Admin only.

---

### Acceptance Criteria - US-013

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Load page 2 cho games**

```
Given 50 games, pageSize=20
When admin navigate to page 2
Then gọi API với page=2, return games 21-40 và totalCount=50
  And UI show pagination controls with current page 2
```

**Scenario [HP-2]: Pagination cho topics**

```
Given 30 topics
When load page 1
Then show 20 topics đầu, next button active
```

**Scenario [HP-3]: Pagination cho ages**

```
Given 15 ages, pageSize=10
When load
Then page 1: 1-10, page 2: 11-15
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Infinite scroll option (nếu implement)**

```
Given scroll to bottom
When end of page 1
Then auto load page 2 và append
```

**Scenario [AF-2]: Change pageSize**

```
Given select pageSize=50
When apply
Then reload list với 50 items/page
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Invalid page (e.g., page=100)**

```
Given total pages=3
When navigate page=100
Then default to page 1 hoặc last page, message "Page not found"
```

**Scenario [EX-2]: No data**

```
Given 0 items
When load
Then no pagination, empty state
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Total items = pageSize**

```
Given 20 items, pageSize=20
When load
Then only page 1, no next/prev
```

**Scenario [EC-2]: Total items < pageSize**

```
Given 15 items, pageSize=20
Then only page 1, show all 15
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Pagination controls UI**

```
Given multi pages
When display
Then show prev/next buttons, page numbers (1 2 3 ...), jump to page input
```

**Scenario [UX-2]: Loading state per page**

```
Given navigate page
When loading
Then skeleton loader
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: High pages (large data)**

```
Given 10000 items
When navigate page 50
Then fast query with COUNT(*) optimize, <500ms
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Non-admin pagination**

```
Then 403 on API
```

---

## 📝 USER STORY 2.2.7: Xem một trò chơi trong danh sách (theo url_game)

- **User Story ID:** US-014
- **Epic Link:** EP-002
- **Title:** Xem chi tiết trò chơi (View Game Detail in Admin)

**User Story:**

- **As a** quản trị viên,
- **I want** xem preview game theo url_game,
- **So that** tôi có thể kiểm tra trước khi active.

**Description:**
Click view để load WebView/iframe url_game trong admin dashboard, cùng chi tiết game.

**Business Context:**
Giúp admin verify game content.

**Priority:** Medium (Should have)
**Story Points (Estimation):** 4 điểm
**Sprint:** Sprint 2
**Assigned To:** Frontend Developer

**Definition of Ready (DoR):**

- [x] AC
- [x] UI preview approve

**Definition of Done (DoD):**

- [ ] Code
- [ ] Tests

**Technical Requirements:**

**API Endpoints:**

- Use GET /api/admin/games/{id} cho detail.

**Frontend:**

- Iframe cho preview url_game, sandboxed.

**Performance:**

- Load iframe <3s.

**Security:**

- Sandbox iframe to prevent scripts.

---

### Acceptance Criteria - US-014

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Preview game thành công**

```
Given game ID=1 với url_game valid
When admin click "View" cho game ID=1
Then load detail từ API, hiển thị iframe với url_game
  And show chi tiết: name, description, links
```

**Scenario [HP-2]: Xem detail mà không preview**

```
Given url_game empty
When view
Then chỉ show detail text, no iframe
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Edit từ detail screen**

```
Given đang ở detail page
When click "Edit"
Then mở form update cho game đó
```

**Scenario [AF-2]: Delete từ detail**

```
Given ở detail
When click delete và confirm
Then xóa và redirect list
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Url_game invalid hoặc không load**

```
Given url_game broken
When load iframe
Then error in modal "Cannot load game preview. Check url"
  And vẫn show detail text
```

**Scenario [EX-2]: Game ID không tồn tại**

```
Given ID=999 not exist
When access /games/999
Then 404, message "Game not found"
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Long load time cho iframe**

```
Given url_game slow
When load
Then timeout sau 10s, show "Load timeout"
```

**Scenario [EC-2]: Iframe với content interactive**

```
Given game có JS
When load
Then sandbox restrict scripts if needed
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Modal cho preview**

```
Given click view
When open
Then modal full-screen với iframe và detail side by side
```

**Scenario [UX-2]: Loading spinner cho iframe**

```
Given loading url
When wait
Then spinner "Loading preview..."
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Preview fast**

```
Given normal url
When load
Then <3s for iframe ready
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Non-admin view**

```
Then 403
```

---

## 📝 USER STORY 2.2.8: Sắp xếp thứ tự hiển thị của game topic, age và game

- **User Story ID:** US-015
- **Epic Link:** EP-002
- **Title:** Sắp xếp thứ tự hiển thị (Reorder Display Order)

**User Story:**

- **As a** quản trị viên,
- **I want** sắp xếp order bằng drag-and-drop hoặc manual update,
- **So that** tôi có thể ưu tiên hiển thị items.

**Description:**
Drag-drop in list to update order field, hoặc input number.

**Business Context:**
Cho phép admin control thứ tự hiển thị cho user.

**Priority:** Medium (Should have)
**Story Points (Estimation):** 5 điểm
**Sprint:** Sprint 2
**Assigned To:** Frontend + Backend Developer

**Definition of Ready (DoR):**

- [x] AC
- [x] UI drag-drop approve

**Definition of Done (DoD):**

- [ ] Code
- [ ] Tests

**Technical Requirements:**

**API Endpoints:**

```
PUT /api/admin/reorder?type=topic  // Body: [{"id":1, "order":2}, ...]
```

**Database Changes:**

- Batch update order fields.

**Performance:**

- <500ms for batch.

**Security:**

- Admin only, validate orders unique if need.

---

### Acceptance Criteria - US-015

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Reorder bằng drag-drop cho topics**

```
Given list topics với order hiện tại [1:1, 2:2, 3:3]
When admin drag item ID=1 to position giữa 2 và 3
Then hệ thống calculate new orders [2:1, 3:2, 1:3], gọi PUT /api/admin/reorder?type=topic với array mới
  And list refresh với order mới
```

**Scenario [HP-2]: Manual update order cho age**

```
Given age ID=1 order=1
When admin input order=5 trong form hoặc inline edit, submit
Then update order=5, adjust others if conflict (e.g., shift)
```

**Scenario [HP-3]: Reorder cho games**

```
Given drag game ID=10 to top
Then update orders accordingly
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Reorder với sort column**

```
Given reorder xong
When list sort by order ASC
Then display theo order mới
```

**Scenario [AF-2]: Undo reorder nếu error**

```
Given drag
When API fail
Then rollback UI to old order
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Order conflict (duplicate order)**

```
Given manual input order đã tồn tại
When submit
Then auto adjust (e.g., shift others), or error "Order duplicate"
```

**Scenario [EX-2]: Reorder list rỗng**

```
Given no items
When try drag
Then no action, message "No items to reorder"
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Reorder single item**

```
Given only 1 item
When drag
Then no change needed, order giữ nguyên
```

**Scenario [EC-2]: Reorder large list (100 items)**

```
Given 100 items
When drag to end
Then update batch efficient, no lag UI
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Drag handle icon**

```
Given list
When hover
Then show drag handle icon bên cạnh item
```

**Scenario [UX-2]: Visual feedback drag**

```
Given dragging
When move
Then highlight drop position
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Reorder large list**

```
Given 200 items
When reorder
Then batch update <1s
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Non-admin reorder**

```
Then 403 on API
```

---

## 📝 USER STORY 2.2.9: Export game ra file excel

- **User Story ID:** US-016
- **Epic Link:** EP-002
- **Title:** Export games ra file Excel (Export Games to Excel)

**User Story:**

- **As a** quản trị viên,
- **I want** export danh sách games hiện tại (có thể filtered) ra Excel,
- **So that** tôi có thể lưu trữ, chỉnh sửa và import lại.

**Description:**
Export với columns: game_id, name, url_game, topics (comma), ages (comma), etc.

**Business Context:**
Hỗ trợ backup và edit offline.

**Priority:** Medium (Should have)
**Story Points (Estimation):** 4 điểm
**Sprint:** Sprint 2
**Assigned To:** Backend Developer + Admin Frontend Developer

**Definition of Ready (DoR):**

- [x] AC
- [x] Columns export define

**Definition of Done (DoD):**

- [ ] Code
- [ ] Tests

**Technical Requirements:**

**API Endpoints:**

```
GET /api/admin/games/export?filters=...  // Return file stream .xlsx
```

**Database Changes:**

- Query filtered list, generate Excel.

**Performance:**

- 100 rows <5s, stream response.

**Security:**

- Admin only, no sensitive data.

---

### Acceptance Criteria - US-016

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Export all games**

```
Given 50 games trong list
When admin click "Export"
Then gọi API, download .xlsx với 50 rows data (columns: id, name, etc.)
  And file có header, formatted nicely
```

**Scenario [HP-2]: Export filtered games**

```
Given filters applied (e.g., keyword="animal")
When export
Then only export games matching filters (e.g., 10 rows)
```

**Scenario [HP-3]: Export với links comma separated**

```
Given game có multiple topics
When export
Then column topics: "Animals,Numbers"
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Export empty list**

```
Given no games after filter
When export
Then download empty .xlsx (chỉ header) hoặc warning "No data, empty file"
```

**Scenario [AF-2]: Export cho topics/ages (nếu mở rộng)**

```
Given dashboard topics
When export
Then tương tự, file với columns topics
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Export fail do server error**

```
Given API error
When click export
Then toast "Export failed, try again"
  No file download
```

**Scenario [EX-2]: Large export timeout**

```
Given 10000 rows
When export
Then handle stream, no timeout, nhưng nếu quá lớn, limit or warning
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Export với special chars in data**

```
Given name có ", & "
When export
Then escape đúng trong Excel, no break cells
```

**Scenario [EC-2]: Export khi list rỗng**

```
Given 0 games
When export
Then file với header only
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Button export với loading**

```
Given click export
When generating
Then loading spinner, disable button
```

**Scenario [UX-2]: File name custom**

```
Given export
Then file name "games_export_2025-10-20.xlsx"
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Export big data**

```
Given 500 rows
When export
Then <10s, stream to client
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Non-admin export**

```
Then 403
```

---

**🎯 KẾT THÚC PHẦN 2 - EPIC 2 HOÀN THIỆN**

### Migration Script Bổ Sung

Không cần migration mới vì schema đã define ở phần 1. Nếu cần add index cho admin queries:

```sql
ALTER TABLE game ADD INDEX idx_admin_search (game_name, is_active);
ALTER TABLE game_topic ADD INDEX idx_admin_order (order);
ALTER TABLE age ADD INDEX idx_admin_order (order);
```

### Diagram UI/UX cho Admin Dashboard

```
┌──────────────────────────────────────────────────────────┐
│ Admin Dashboard - Game Management                        │
│                                                          │
│ ┌────────────────────┐ ┌───────────────────────────────┐ │
│ │ Sidebar            │ │ Main Content                  │ │
│ │ - Topics           │ │ ┌───────────────────────────┐ │ │
│ │ - Ages             │ │ │ Search Bar & Filters      │ │ │
│ │ - Games            │ │ │ Keyword: [ ] Topic: [v]   │ │ │
│ │ - Import/Export    │ │ └───────────────────────────┘ │ │
│ │ - Reorder         │ │ ┌───────────────────────────┐ │ │
│ └────────────────────┘ │ │ Table/List                │ │ │
│                        │ │ ID | Name | Order | Active │ │ │
│                        │ │ Drag handles for reorder   │ │ │
│                        │ └───────────────────────────┘ │ │
│                        │ ┌───────────────────────────┐ │ │
│                        │ │ Pagination: Prev 1/5 Next │ │ │
│                        │ └───────────────────────────┘ │ │
│                        │ ┌───────────────────────────┐ │ │
│                        │ │ Buttons: Create New, Export│ │ │
│                        │ └───────────────────────────┘ │ │
│                        └───────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```
