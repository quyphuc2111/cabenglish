# HTTPS Setup Guide

## Tại sao cần HTTPS?

Một số tính năng web hiện đại yêu cầu HTTPS để hoạt động:
- 🎤 **Microphone API** (Speech Recognition)
- 📷 **Camera API**
- 📍 **Geolocation API**
- 🔔 **Push Notifications**

## Setup đã hoàn thành ✅

### 1. SSL Certificates
Đã tạo certificates bằng `mkcert`:
```
certificates/
├── localhost+2.pem          (Certificate)
└── localhost+2-key.pem      (Private Key)
```

### 2. Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",                    // HTTP (port 3000)
    "dev:https": "next dev --experimental-https ..."  // HTTPS (port 3000)
  }
}
```

## Cách sử dụng

### Chạy với HTTPS:
```bash
npm run dev:https
```

### Truy cập:
```
https://localhost:3000
```

### Chạy bình thường (HTTP):
```bash
npm run dev
```

## Xử lý lỗi Microphone

### Lỗi: "NotFoundError: Requested device not found"

**Nguyên nhân:**
- Không có microphone trên thiết bị
- Microphone bị disable trong System Preferences
- Microphone đang được sử dụng bởi app khác

**Giải pháp:**

#### macOS:
1. Mở **System Settings** (⚙️)
2. Vào **Privacy & Security** → **Microphone**
3. Đảm bảo Chrome/Edge được cho phép
4. Kiểm tra microphone có hoạt động không (thử với app khác)

#### Kiểm tra microphone:
```bash
# List audio devices (macOS)
system_profiler SPAudioDataType
```

### Lỗi: "NotAllowedError"

**Giải pháp:**
1. Click vào icon 🔒 hoặc ⓘ bên trái thanh địa chỉ
2. Chọn **Site Settings**
3. Tìm **Microphone** và chọn **Allow**
4. Reload trang

### Lỗi: "NotReadableError"

**Giải pháp:**
- Đóng các ứng dụng khác đang sử dụng microphone (Zoom, Teams, etc.)
- Restart trình duyệt
- Restart máy tính nếu cần

## Fallback Option

Nếu không có microphone hoặc gặp lỗi, game sẽ hiển thị nút **"Bỏ qua"** để:
- Tiếp tục học mà không cần ghi âm
- Nhận 5 điểm (thay vì 10 điểm)
- Không bị block trong quá trình học

## Testing

### 1. Kiểm tra HTTPS hoạt động:
```bash
npm run dev:https
```
Mở `https://localhost:3000` - Nếu thấy cảnh báo certificate, click "Advanced" → "Proceed to localhost"

### 2. Kiểm tra Microphone:
- Vào trang có RecordingGame
- Click "Bắt đầu ghi âm"
- Cho phép microphone khi browser hỏi
- Nói từ tiếng Anh
- Kiểm tra kết quả

### 3. Test Speech Recognition:
```javascript
// Open browser console and run:
const recognition = new webkitSpeechRecognition();
recognition.lang = 'en-US';
recognition.onresult = (e) => console.log(e.results[0][0].transcript);
recognition.start();
// Then speak into microphone
```

## Browser Support

| Browser | Speech Recognition | HTTPS Required |
|---------|-------------------|----------------|
| Chrome  | ✅ Yes            | ✅ Yes         |
| Edge    | ✅ Yes            | ✅ Yes         |
| Safari  | ✅ Yes (iOS 14.5+)| ✅ Yes         |
| Firefox | ❌ No             | N/A            |

## Troubleshooting

### Nếu vẫn gặp lỗi:

1. **Kiểm tra microphone hoạt động:**
   - Thử ghi âm với app khác (Voice Memos, QuickTime)
   
2. **Kiểm tra browser permissions:**
   - Chrome: `chrome://settings/content/microphone`
   - Edge: `edge://settings/content/microphone`

3. **Restart browser:**
   - Đóng hoàn toàn browser
   - Mở lại và thử lại

4. **Sử dụng nút "Bỏ qua":**
   - Nếu không có microphone
   - Nếu không muốn sử dụng tính năng ghi âm
   - Vẫn có thể hoàn thành bài học

## Production Deployment

Khi deploy lên production, đảm bảo:
- ✅ Sử dụng HTTPS (Vercel, Netlify tự động có HTTPS)
- ✅ Domain có SSL certificate hợp lệ
- ✅ Không cần certificates folder (chỉ dùng cho localhost)

## Notes

- Certificates có hiệu lực đến: **19 April 2028**
- Certificates chỉ dùng cho development (localhost)
- File `*.pem` đã được thêm vào `.gitignore`
