export default function PptToJson() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-2xl">PptToJson</div>
      <div className="w-[400px]">
        <form
          className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          action="/api/ppt"
          method="post"
          encType="multipart/form-data"
        >
          <label className="text-md" htmlFor="email">
            testing
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="file"
            type="file"
            required
            autoComplete="off"
          />
          <button className="rounded-md px-4 py-2 text-foreground mb-2 bg-green-600 hover:bg-green-500">
            Generate
          </button>
        </form>
      </div>
    </div>
  );
}
