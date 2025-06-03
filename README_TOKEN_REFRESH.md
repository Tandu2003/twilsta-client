# Auto Token Refresh Implementation

## Tổng quan

Hệ thống auto refresh token đã được triển khai để tự động gia hạn access token khi hết hạn, tránh
buộc người dùng phải đăng nhập lại và ngăn chặn vòng lặp refresh token vô hạn.

## Các thành phần chính

### 1. TokenManager (`src/lib/token-manager.ts`)

Quản lý trạng thái refresh token và ngăn chặn vòng lặp:

- **Singleton pattern**: Đảm bảo chỉ có 1 instance duy nhất
- **Queue mechanism**: Xử lý nhiều request đồng thời
- **Rate limiting**: Ngăn chặn refresh quá thường xuyên (tối thiểu 5s giữa các lần)
- **Max attempts**: Giới hạn tối đa 3 lần thử refresh
- **Auto redirect**: Tự động chuyển về trang login khi refresh thất bại

```typescript
// Sử dụng TokenManager
import TokenManager from '@/lib/token-manager';

// Kiểm tra có đang refresh không
const isRefreshing = TokenManager.isCurrentlyRefreshing();

// Thử refresh token
const success = await TokenManager.refreshToken();

// Reset state (khi logout)
TokenManager.resetState();
```

### 2. Axios Interceptor (`src/lib/axios.ts`)

Tự động xử lý lỗi 401 và refresh token:

- **Auto retry**: Tự động thử lại request sau khi refresh thành công
- **Smart detection**: Chỉ refresh khi thực sự cần thiết
- **Endpoint filtering**: Tránh refresh cho các endpoint auth để tránh vòng lặp

### 3. useAuthRefresh Hook (`src/hooks/useAuthRefresh.ts`)

React hook để quản lý auth state:

```typescript
import { useAuthRefresh } from '@/hooks/useAuthRefresh';

const MyComponent = () => {
  const { checkAndRefreshToken, logout, isRefreshing } = useAuthRefresh();

  // Sử dụng trong component
  const handleAction = async () => {
    const isValid = await checkAndRefreshToken();
    if (isValid) {
      // Thực hiện action khi token hợp lệ
    }
  };

  return (
    <div>
      {isRefreshing && <LoadingSpinner />}
      <button onClick={handleAction}>Action</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### 4. Enhanced Middleware (`src/middleware.ts`)

Middleware cải tiến với refresh logic:

- **Attempt tracking**: Theo dõi số lần thử refresh để tránh vòng lặp
- **Smart refresh**: Chỉ refresh khi cần thiết và trong giới hạn
- **Header tracking**: Sử dụng header để track refresh attempts

## Cách hoạt động

### Flow refresh token tự động:

1. **Request gửi đi**: Client gửi request với access token
2. **Server trả 401**: Access token hết hạn hoặc không hợp lệ
3. **Axios interceptor bắt lỗi**: Kiểm tra có nên refresh không
4. **TokenManager refresh**: Gọi API refresh-token bằng fetch (tránh interceptor loop)
5. **Retry request**: Nếu refresh thành công, thử lại request gốc
6. **Handle failure**: Nếu refresh thất bại, redirect về login

### Ngăn chặn vòng lặp:

- **Rate limiting**: Tối thiểu 5s giữa các lần refresh
- **Max attempts**: Tối đa 3 lần thử trong 1 session
- **Endpoint filtering**: Không refresh cho `/auth/refresh-token`, `/auth/login`, `/auth/register`
- **State tracking**: Theo dõi trạng thái để tránh multiple refresh cùng lúc

## Best Practices

### 1. Khi sử dụng API calls:

```typescript
// ✅ Tốt - Sử dụng apiInstance sẽ tự động handle refresh
import apiInstance from '@/lib/axios';

const fetchData = async () => {
  try {
    const response = await apiInstance.get('/api/data');
    return response.data;
  } catch (error) {
    // Error đã được handle bởi interceptor
    console.error('API call failed:', error);
  }
};

// ❌ Tránh - Bypass interceptor
const response = await fetch('/api/data', {
  headers: { Authorization: `Bearer ${token}` },
});
```

### 2. Trong React components:

```typescript
// ✅ Tốt - Sử dụng hook
const { checkAndRefreshToken, isRefreshing } = useAuthRefresh();

useEffect(() => {
  checkAndRefreshToken();
}, []);

// ❌ Tránh - Manual token handling
const [token, setToken] = useState(null);
```

### 3. Khi logout:

```typescript
// ✅ Tốt - Reset token state
const { logout } = useAuthRefresh();
await logout(); // Tự động reset TokenManager state

// ❌ Tránh - Chỉ xóa cookies
document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
```

## Monitoring và Debug

### Logs để theo dõi:

- `Token refreshed successfully for user: {userId}` - Refresh thành công
- `Token refresh failed: {error}` - Refresh thất bại
- `Refresh token attempted too frequently, skipping...` - Rate limiting
- `Max refresh attempts exceeded, redirecting to login...` - Quá số lần thử

### Debug tips:

1. **Kiểm tra Network tab**: Xem có loop requests không
3. **Application tab**: Kiểm tra cookies expiry
4. **Redux DevTools**: Theo dõi auth state changes

## Error Handling

Hệ thống xử lý các trường hợp lỗi phổ biến:

- **Network errors**: Retry với exponential backoff
- **Server errors**: Log và redirect appropriate
- **Invalid refresh token**: Clear state và redirect login
- **Rate limiting**: Skip refresh và log warning
- **Max attempts**: Hard redirect để reset state

## Configuration

Các tham số có thể điều chỉnh trong TokenManager:

```typescript
private maxRefreshAttempts = 3;           // Số lần thử tối đa
private minRefreshInterval = 5000;        // Interval tối thiểu (ms)
```

Trong useAuthRefresh:

```typescript
const interval = 5 * 60 * 1000; // Check token mỗi 5 phút
```
