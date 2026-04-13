export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-orange-400">
          設定新密碼
        </h2>
        <input
          type="password"
          placeholder="新密碼"
          className="mb-4 w-full rounded border p-2"
          required
        ></input>
        <input
          type="password"
          placeholder="確認新密碼"
          className="mb-4 w-full rounded border p-2"
          required
        ></input>
        <button
          type="submit"
          className="w-full cursor-pointer rounded-full bg-orange-400 py-2 font-bold text-white transition hover:bg-orange-300"
        >
          儲存新密碼
        </button>
      </form>
    </div>
  );
}
