import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      // 這裡定義你的 user 結構，根據你 JWT 解密後的內容而定
      user?: {
        id: string;
        name: string;
        // 其他你放在 Token 裡的欄位...
      };
    }
  }
}
